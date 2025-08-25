const fs = require('fs');
const path = require('path');
const Module = require('module');
const storage = require('node-persist'); // token gerektirmeyen lokal DB
const ayarlar = require('./ayarlar.json');
const { Client, GatewayIntentBits, REST, Routes, Collection, SlashCommandBuilder } = require('discord.js');

// initialize local storage synchronously (sağlam, token gerektirmez)
try {
  storage.initSync({
    dir: path.join(__dirname, 'data_storage'),
    stringify: JSON.stringify,
    parse: JSON.parse,
    encoding: 'utf8',
    logging: false,
    ttl: false
  });
  console.log('Local storage hazır:', path.join(__dirname, 'data_storage'));
} catch (e) {
  console.warn('Local storage başlatılamadı, devam ediliyor. Hata:', e && e.message ? e.message : e);
}

// quick.db uyumluluk shim'i: require('quick.db') çağrılarını yakalar
const quickdbShim = {
  fetch: (k) => storage.getItemSync(k),
  get: (k) => storage.getItemSync(k),
  set: (k, v) => storage.setItemSync(k, v),
  delete: (k) => storage.removeItemSync(k),
  del: (k) => storage.removeItemSync(k),
  push: (k, v) => {
    const arr = storage.getItemSync(k) || [];
    arr.push(v);
    storage.setItemSync(k, arr);
    return arr;
  },
  all: () => {
    // basit dump
    return storage.keys().reduce((acc, key) => { acc[key] = storage.getItemSync(key); return acc; }, {});
  }
};
const origLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'quick.db') return quickdbShim;
  return origLoad.apply(this, arguments);
};

// Client: guild intent + mesaj intent isteğe bağlı (MessageContent şu an devre dışı; portal'da izin gerektirir)
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

// Collections
client.slashCommands = new Collection();
client.legacyCommands = new Collection();
client.aliases = new Collection();

// Komut dizinleri
const commandsDir = path.join(__dirname, 'komutlar');
const legacyDir = path.join(__dirname, 'komutlar_legacy');
if (!fs.existsSync(commandsDir)) fs.mkdirSync(commandsDir);
if (!fs.existsSync(legacyDir)) fs.mkdirSync(legacyDir);

// REST (slash kaydı)
const rest = new REST({ version: '10' }).setToken(ayarlar.token || process.env.BOT_TOKEN || '');

// Helper: güvenli require (hatalı dosyaları yakala)
function safeRequire(fp) {
  try {
    delete require.cache[require.resolve(fp)];
    return require(fp);
  } catch (e) {
    console.error('safeRequire hata:', fp, e && e.message ? e.message : e);
    return null;
  }
}

// Asenkron başlangıç akışı (komut yükleme, slash register vb.)
(async () => {
  try {
    // 1) Slash komutlarını yükle (komutlar/)
    const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.js'));
    const slashPayload = [];
    for (const file of files) {
      const fp = path.join(commandsDir, file);
      try {
        const content = fs.readFileSync(fp, 'utf8');
        if (/SlashCommandBuilder|new\s+SlashCommandBuilder|data:\s*new\s+SlashCommandBuilder/.test(content)) {
          const cmd = safeRequire(fp);
          if (cmd && cmd.data && cmd.data.name) {
            client.slashCommands.set(cmd.data.name, cmd);
            // Ensure legacy helpers and other code that read client.commands see slash commands too
            if (!client.commands) client.commands = new Collection();
            client.commands.set(cmd.data.name, cmd);
            try { slashPayload.push(cmd.data.toJSON()); } catch (e) { console.error(`Payload hatası ${file}:`, e && e.message ? e.message : e); }
            console.log(`Slash komutu yüklendi: ${file}`);
          } else {
            const target = path.join(legacyDir, file);
            fs.renameSync(fp, target);
            console.log(`Taşındı (slash tanımlı değil): ${file} -> komutlar_legacy`);
          }
        } else {
          const target = path.join(legacyDir, file);
          fs.renameSync(fp, target);
          console.log(`Legacy/atlandı ve taşındı: ${file} -> komutlar_legacy`);
        }
      } catch (e) {
        console.error('Komut yüklenirken hata:', file, e && e.message ? e.message : e);
        try { fs.renameSync(fp, path.join(legacyDir, file)); } catch(_) {}
      }
    }

    // 2) Legacy komutları yükle (komutlar_legacy/)
    const legacyFiles = fs.existsSync(legacyDir) ? fs.readdirSync(legacyDir).filter(f => f.endsWith('.js')) : [];
    for (const file of legacyFiles) {
      const fp = path.join(legacyDir, file);
      const mod = safeRequire(fp);
      if (mod && typeof mod.run === 'function') {
        const name = (mod.help && mod.help.name) ? mod.help.name : file.replace('.js','');
        client.legacyCommands.set(name.toLowerCase(), mod);
        const aliases = (mod.conf && Array.isArray(mod.conf.aliases)) ? mod.conf.aliases : [];
        for (const a of aliases) client.aliases.set(a.toLowerCase(), name.toLowerCase());
        console.log(`Legacy komut yüklendi: ${name}`);
      } else {
        console.log(`Legacy yüklenemedi veya uyumsuz: ${file}`);
      }
    }

    // 3) global slash kayıt (sadece appId/token geçerliyse)
    // ---> Güvenli slash kaydı: client hazır olunca çalıştır (global önce, başarısızsa guild-bazlı)
    // slashPayload değişkeni yukarıda oluşturuluyor ve push edildi
    client.once('ready', async () => {
      // bilgi
      console.log(`${client.user.tag} hazır. Sunucu sayısı: ${client.guilds.cache.size}`);

      // eğer payload boşsa atla
      if (!Array.isArray(slashPayload) || slashPayload.length === 0) {
        console.log('Kayıt edilecek slash komutu yok.');
        return;
      }

      // rest tokenı set et (güncelle)
      const token = ayarlar.token || process.env.BOT_TOKEN || '';
      if (!token) {
        console.warn('Uyarı: Bot tokeni tanımlı değil; slash kaydı atlanacak.');
        return;
      }
      rest.setToken(token);

      // uygulama id'sini tercih sırasıyla: client.application.id -> ayarlar.clientID -> env
      const appId = (client.application && client.application.id) ? client.application.id : (ayarlar.clientID || ayarlar.ClientID || process.env.CLIENT_ID);
      if (!appId) {
        console.warn('Uyarı: Application ID belirlenemedi; slash komutları kaydedilmeyecek.');
        return;
      }

      // önce global kayıt dene
      try {
        console.log('Global slash komutları kaydediliyor...');
        await rest.put(Routes.applicationCommands(appId), { body: slashPayload });
        console.log('Global slash komutları başarıyla kaydedildi!');
        return;
      } catch (globalErr) {
        console.warn('Global kayıt başarısız:', globalErr && (globalErr.message || JSON.stringify(globalErr)));
        // başarısızsa guild bazlı kayıt dene (her sunucu için)
        const guildIds = client.guilds.cache.map(g => g.id);
        for (const gid of guildIds) {
          try {
            await rest.put(Routes.applicationGuildCommands(appId, gid), { body: slashPayload });
            console.log(`Guild ${gid} için slash komutları kaydedildi.`);
          } catch (guildErr) {
            console.error(`Guild ${gid} kaydı hatası:`, guildErr && (guildErr.message || JSON.stringify(guildErr)));
          }
        }
      }
    });

    // event handler'lar (aynı dosyada kalmaya devam)
    client.on('interactionCreate', async interaction => {
      // Support chat-input and context-menu interactions safely
      const isChat = typeof interaction.isChatInputCommand === 'function' ? interaction.isChatInputCommand() : false;
      const isCtx = typeof interaction.isContextMenuCommand === 'function' ? interaction.isContextMenuCommand() : false;
      if (!isChat && !isCtx) return;
      const cmdName = interaction.commandName;
      const cmd = (client.slashCommands && client.slashCommands.get(cmdName)) || (client.commands && client.commands.get(cmdName));
      if (!cmd || typeof cmd.execute !== 'function') {
        try { if (!interaction.replied) await interaction.reply({ content: 'Komut bulunamadı.', ephemeral: true }); } catch(_) {}
        return;
      }
      try {
        await cmd.execute(interaction);
      } catch (e) {
        console.error('Slash exec hata:', e && e.stack ? e.stack : e);
        try { if (!interaction.replied) await interaction.reply({ content: 'Komut çalıştırılırken hata oluştu.', ephemeral: true }); } catch(_) {}
      }
    });

    client.on('messageCreate', async message => {
      if (message.author.bot || !message.guild) return;
      const prefix = ayarlar.prefix || '!';
      if (!message.content.startsWith(prefix)) return;
      const args = message.content.slice(prefix.length).trim().split(/\s+/);
      const cmdName = args.shift().toLowerCase();
      const key = client.legacyCommands.has(cmdName) ? cmdName : (client.aliases.get(cmdName) || null);
      if (!key) return;
      const command = client.legacyCommands.get(key);
      if (!command) return;
      try { await command.run(client, message, args); } catch (e) { console.error('Legacy exec hata:', e && e.stack ? e.stack : e); message.reply('Komut çalıştırılırken hata oluştu.').catch(()=>{}); }
    });

    // start login
    client.login(ayarlar.token || process.env.BOT_TOKEN || '').then(()=>console.log('Bot giriş başarılı.')).catch(err => {
      console.error('Bot giriş hatası:', err && err.message ? err.message : err);
    });

  } catch (e) {
    console.error('Başlatma hatası:', e && e.stack ? e.stack : e);
  }
})();
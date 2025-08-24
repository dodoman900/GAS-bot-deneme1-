// Başlangıç - discord.js importu ve uyumluluk kontrolü
const Discord = require('discord.js'); // discord.js temel kütüphane
if (!Discord || !Discord.GatewayIntentBits) { // versiyon kontrolü
  console.error('\ndiscord.js v14 API bulunamadı veya uyumsuz. Lütfen proje dizininde aşağıyı çalıştırın:\n\n  npm install discord.js@14\n\nAyrıca Node sürümünüzü en az 16.9+ yapın. Mevcut Node sürümünüz: ' + process.version + '\n');
  process.exit(1);
}
const { Client, GatewayIntentBits, Partials, ActivityType, Collection, PermissionFlagsBits, EmbedBuilder, ChannelType, version } = Discord;

// Client oluşturma (botun ana örneği)
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // sunucu listesini alabilmek için
    GatewayIntentBits.GuildMessages, // sunucu mesajlarını dinlemek için
    GatewayIntentBits.MessageContent, // mesaj içeriğini okumak için (komutlar)
    GatewayIntentBits.GuildMembers, // üyelerle ilgili işlemler için
    GatewayIntentBits.GuildVoiceStates, // ses kanalları için
    GatewayIntentBits.DirectMessages, // DM'leri almak için
  ],
  partials: [Partials.Channel, Partials.Message, Partials.User], // eksik parçaları desteklemek için
});

// Ayarlar ve yardımcı kütüphaneler
const ayarlar = require('./ayarlar.json'); // token, prefix gibi ayarlar
const fs = require('fs'); // dosya okuma
const moment = require('moment'); // tarih/süre formatlama
require('./util/eventLoader')(client) // event loader (mevcut yapıya bağlama)

// prefix tanımı
var prefix = ayarlar.prefix;

// basit log helper (zamanlı loglama)
const log = message => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
};

// Komut koleksiyonları (komut/alias yönetimi)
client.commands = new Collection(); // tüm komutları tutar
client.aliases = new Collection();  // alias -> komut ismi haritası

// Komutları yükle (komut dosyalarını ./komutlar/ dizininden al)
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`); // her komut modülünü yükle
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props); // komutu kaydet
    (props.conf.aliases || []).forEach(alias => {
      client.aliases.set(alias, props.help.name); // aliasleri kaydet
    });
  });
});

// Komut reload / load / unload yardımcıları (dinamik güncelleme)
client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};
client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

// ready event: bot hazır olduğunda çalışır (durum ayarlama)
client.on('ready', () => {
     // oynuyor kısmı (durum metinleri)
     var actvs = [
       `${prefix}yardım ${client.guilds.cache.size} sunucuyu`, // gösterilecek metin 1
       `${prefix}yardım ${client.users.cache.size} Kullanıcıyı`, // metin 2
       `${prefix}yardım` // metin 3
     ];
     client.user.setActivity(actvs[Math.floor(Math.random() * actvs.length)], { type: ActivityType.Listening }); // durum ayarla
     setInterval(() => {
         client.user.setActivity(actvs[Math.floor(Math.random() * actvs.length)], { type: ActivityType.Listening});
     }, 15000); // 15s aralıklarla durumu döndür

     // konsola temel bilgi yazdır (başarılı açılış bildirimi)
     console.log ('_________________________________________');
     console.log (`Kullanıcı İsmi     : ${client.user.username}`);
     console.log (`Sunucular          : ${client.guilds.cache.size}`);
     console.log (`Kullanıcılar       : ${client.users.cache.size}`);
     console.log (`Prefix             : ${ayarlar.prefix}`);
     console.log (`Durum              : Bot Çevrimiçi!`);
     console.log ('_________________________________________');
});

// permission elevation helper (komut izin seviyelerini hesaplar)
client.elevation = message => {
  if (!message.guild) return 0; // DM'de varsayılan seviye
  let permlvl = 0;
  if (message.member.permissions.has(PermissionFlagsBits.BanMembers)) permlvl = 2;       // ban yetkisi => seviye 2
  if (message.member.permissions.has(PermissionFlagsBits.Administrator)) permlvl = 3;   // admin => seviye 3
  if (message.author.id === ayarlar.sahip) permlvl = 4;                                // bot sahibi => seviye 4
  return permlvl;
};

// client login (botu Discord'a bağla)
client.login(ayarlar.token);

// Stat gönderici (periyodik bot istatistikleri gönderir)
client.on('ready', () => {
  const moment = require("moment");
  require("moment-duration-format"); // moment duration format plugin

  setInterval(() => {
    const calismasure = moment.duration(client.uptime).format(" D [gün], H [saat], m [dakika], s [saniye]"); // uptime hesapla
    let botdurum = client.channels.cache.find(c => c.id === '874853388389613609'); // istatistik kanal id'si
    const botistatistik = new EmbedBuilder() // embed oluştur
      .setColor('Red')
      .setTitle('= Bot İstatistikleri =')
      .addFields(
        { name: 'RAM', value: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}/512mb`, inline: true },
        { name: 'Çalışma Süresi', value: `${calismasure}`, inline: true },
        { name: 'Ping', value: `${client.ws.ping}`, inline: true },
        { name: 'discord.js', value: `v${version}`, inline: true },
        { name: 'Bilgi', value: `${client.guilds.cache.size} sunucu ve ${client.users.cache.size} kullanıcıya hizmet veriyor.`, inline: false }
      )
      .setTimestamp()
      .setFooter({ text: 'GroSS Anime Servers', iconURL: 'https://www.canes.cf/images/caneslogo.png' });
    if (botdurum) botdurum.send({ embeds: [botistatistik] }).catch(()=>{}); // gönder, hatayı yut
  }, 10000); // her 10 saniyede bir (isteğe bağlı olarak uzatın)
});

// DM loglayıcı (DM geldiğinde belirli kanala gönderir)
client.on("messageCreate", msg => {
  const dm = client.channels.cache.get("874857150546067456"); // DM'leri yazdırılacak kanal id
  if (msg.channel && msg.channel.type === ChannelType.DM) {
    if (msg.author.id === client.user.id) return; // botun kendi DM'leri yoksay
    if (!dm) return; // kanal yoksa çık
    const botdm = new EmbedBuilder()
      .setTitle(`${client.user.username} Dm`)
      .setTimestamp()
      .setColor('Red')
      .setThumbnail(msg.author.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: 'Gönderen', value: msg.author.tag, inline: true },
        { name: 'Gönderen ID', value: msg.author.id, inline: true },
        { name: 'Gönderilen Mesaj', value: msg.content || 'Yok' }
      );
    dm.send({ embeds: [botdm] }).catch(()=>{}); // hatayı yut
  }
  if (msg.author && msg.author.bot) return; // bot mesajlarını yoksay
});

// guild add/remove eventleri (sunucu eklenme/atılma logları)
client.on("guildCreate", async guild => { 
  // ...existing code... // buraya kanal id koyup log atabilirsiniz
});
client.on("guildDelete", async guild => { 
  // ...existing code... // buraya kanal id koyup log atabilirsiniz
});

// Global hata yakalayıcılar — native modul derleme/uyumsuzluklarında yardımcı mesaj verir
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err && err.stack ? err.stack : err);
  if (err && err.message && err.message.includes('better_sqlite3')) {
    console.error('\nbetter-sqlite3 uyumsuzluğu tespit edildi. quick.db yerine node-persist kullanıldı; eğer eski native modül hatası görüyorsanız proje kökünde şu komutları çalıştırın:\n\n  npm rebuild better-sqlite3 --build-from-source\n\nveya node_modules/ silip yeniden kurun:\n\n  rm -rf node_modules package-lock.json && npm install\n');
  }
  process.exit(1);
});
process.on('unhandledRejection', (reason, p) => {
  console.error('Unhandled Rejection at:', p, 'reason:', reason);
  if (reason && reason.message && reason.message.includes('better_sqlite3')) {
    console.error('\nbetter-sqlite3 binary uyumsuzluğu tespit edildi. Düzeltmek için:\n\n  npm rebuild better-sqlite3 --build-from-source\n');
  }
});
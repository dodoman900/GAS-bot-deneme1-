const { EmbedBuilder } = require('discord.js');
const { analyzeFile } = require('../tools/auto_fix');
const fs = require('fs');
const path = require('path');

exports.run = async (client, message, args) => {
  if (!message.guild) return message.reply('Bu komut sunucuda kullanılmalıdır.');
  const commandsDir = path.join(__dirname, '..', 'komutlar');
  const legacyDir = path.join(__dirname);
  const results = [];

  const scan = dir => {
    if (!fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.js'))) {
      const fp = path.join(dir, f);
      const content = fs.readFileSync(fp, 'utf8');
      results.push(analyzeFile(fp, content));
    }
  };
  scan(commandsDir);
  scan(legacyDir);

  const embed = new EmbedBuilder()
    .setTitle('Diagnose - Özet')
    .setColor('Yellow')
    .setTimestamp()
    .setDescription(`Tarandı: ${results.length} dosya. Hata / öneri olanlar listelendi.`);

  for (const r of results) {
    const top = r.issues.filter(i => i.severity === 'error').slice(0,2).map(i => `${i.code}: ${i.reason}`).join('\n') ||
                r.issues.filter(i=>i.severity==='warning').slice(0,2).map(i=>`${i.code}: ${i.reason}`).join('\n') ||
                r.issues[0].reason;
    embed.addFields({ name: r.file, value: top + '\nÇözüm: ' + (r.issues[0].suggestion || 'Manuel kontrol'), inline: false });
  }

  return message.channel.send({ embeds: [embed] });
};

exports.conf = { enabled: true, guildOnly: true, aliases: ['diag'], permLevel: 3 };
exports.help = { name: 'diagnose-legacy', description: 'Dosyaları tarar ve hata önerisi verir.', usage: 'diagnose' };
  }
};

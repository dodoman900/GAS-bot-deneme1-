// Komut: botun bulunduğu bir sunucudan ayrılması (sahip onayı ile)
const Discord = require('discord.js');
exports.run = async (client, message, args) => {
  const ayarlar = require('../ayarlar.json');
  if (message.author.id !== ayarlar.sahip) return message.channel.send(":x: Hey, bu komutu sadece bot sahibi kullanabilir!");
  const guildid = args[0];
  if (!guildid) return message.channel.send(':x: Ayrılınacak sunucunun ID\'sini girmelisin!');
  const guild = client.guilds.cache.get(guildid);
  if (!guild) return message.channel.send(':x: Bu ID ile bir sunucu bulunamadı.');
  await guild.leave().catch(() => {});
  const embed = {
    title: 'İşlem Başarılı',
    description: '✅ Başarıyla sunucudan ayrıldım',
    fields: [{ name: 'Ayrıldığım Sunucunun ID\'si', value: `${guildid}` }],
    footer: { text: 'Groß Anime Servers' }
  };
  return message.channel.send({ embeds: [new Discord.MessageEmbed(embed)] });
};
exports.conf = { enabled: true, guildOnly: false, aliases: [], permLevel: 0 };
exports.help = { name: 'sunucudan-ayrıl', description: 'Belirtilen ID deki sunucudan ayrılır', usage: 'sunucudan-ayrıl <ID>' };
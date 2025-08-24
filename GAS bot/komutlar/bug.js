const Discord = require("discord.js");
const { EmbedBuilder } = require('discord.js');
module.exports.run = async (bot, message, args) => {
let bug = args.join(" ").slice(0);
let user = message.author.username;
let guild = message.guild.name;
let guildid = message.guild.id;
let kanal = message.channel.name;
  let kanalid = message.channel.id;
let channel = bot.channels.cache.get("874877419851513886")//bug repot kanal id
let embed = new EmbedBuilder()
.setTitle("Bug Bildirisi")
.setColor("Red")
.addFields(
  { name: 'Bug', value: bug || 'Yok' },
  { name: 'Report Eden', value: user, inline: true },
  { name: 'Sunucu', value: guild, inline: true },
  { name: 'Sunucu ID', value: guildid, inline: true },
  { name: 'Kanal', value: kanal, inline: true },
  { name: 'Kanal ID', value: kanalid, inline: true }
);
  const embed2 = new EmbedBuilder()
    .setColor("Red")
    .setDescription(`${message.author.username}, hata bildiriminiz yetkililere iletilmiştir. Geri dönüş yapılacaktır.`);
    await message.channel.send({ embeds: [embed2] });
const sent = await channel.send({ embeds: [embed] });
if (sent) {
  sent.react('❌').catch(()=>{});
  sent.react('✔').catch(()=>{});
}
  
}
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['hatabildir', 'bugreport', 'bugbildir', 'hata', 'bug'],
  permLevel: 0  
};
exports.help = {
  name: 'bug-bildir',
  description: 'Botla ilgili hataları bildirirsiniz.',
  usage: 'bug-bildir'
}
const Discord = require('discord.js');
 
exports.run = (client, message, args) => {// can#0002
if(!message.member.hasPermission('MANAGE_CHANNELS')) return;

let channel = message.mentions.channels.first() || message.channel;
message.channel.send(` ${channel}Adlı kanalın kilidi kaldırıldı .`).then(m => m.delete({timeout: 7000}));

let everyone = message.guild.roles.cache.find(a => a.name === '@everyone');
channel.updateOverwrite(everyone, { 'SEND_MESSAGES': null }, 'Kaldıran yetkili: '+message.author.tag);
channel.send(new Discord.MessageEmbed()
.setColor('GREEN')
.setTitle(channel.name+' Kilit kaldırıldı.')
.setDescription(`Yetkililer bu kanalın kilitlemesini kaldırdı.`));

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["kilitaç","kanalkilitaç","aç"],
  permLevel: 0
};
 
exports.help = {
  name: 'unlock'
};
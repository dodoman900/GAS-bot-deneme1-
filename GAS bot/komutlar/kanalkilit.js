const Discord = require('discord.js');
 
exports.run = (client, message, args) => {
if(!message.member.hasPermission('MANAGE_CHANNELS')) return;

let channel = message.mentions.channels.first() || message.channel;

let reason;
if(!message.mentions.channels.first()) {
if(args[0]) reason = args.slice(0).join(' ');
};
if(message.mentions.channels.first()) {
if(args[1]) reason = args.slice(1).join(' ');
};

let reasonn;
if(!reason) reasonn = '. Kilitleme sebebi girilmedi.';
if(reason) reasonn = ` for ${reason} reason.`;
message.channel.send(` ${channel} Kanalı kilitlendi.`).then(m => m.delete({timeout: 7000}));

let everyone = message.guild.roles.cache.find(a => a.name === '@everyone');
channel.updateOverwrite(everyone, { 'SEND_MESSAGES': false }, 'Tarafından kilitlendi:'+message.author.tag);
channel.send(new Discord.MessageEmbed()
.setColor('RED')
.setTitle(channel.name+' kanalı kilitlenmiştir,sadece yönetici izini olan kullanıcılar yazabilir.')
.setDescription(`Maalesef ki, sadece moderatörler kanal kilitleme yetkisine sahiptir.${reasonn}Lütfen karara saygı duyunuz,kanal gelecekte yeniden açılabilir.`));

};
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["kilitle","kanal-kilitle","kanalkilit"],
  permLevel: 0
};
 
exports.help = {
  name: 'lock'
};
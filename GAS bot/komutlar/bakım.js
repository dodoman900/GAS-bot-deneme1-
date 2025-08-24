const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const database = require('quick.db');

exports.run = async (client, message, args) => {// can#0002
if(message.author.id !== '817403879725072395') return;

function gönderkardesim(content) {
const infoEmbed = new EmbedBuilder()
.setColor('Blue')
.setDescription(content)
.setTimestamp()
.setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true }) });
return message.channel.send({ embeds: [infoEmbed] })
};

const durum = await database.fetch(client.user.id);
if(durum == true) {

await database.delete(client.user.id);
return gönderkardesim('Bakım artık sona erdi.');

} else {

await database.set(client.user.id, true);
database.set(client.user.id+':)', { 
author: message.author,
time: Date.now() 
});

return gönderkardesim('Bakım modu açıldı.\nArtık hiç bir kimse komutları kullanamayacak.');
};


}; 
exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['bakım'],
  permLevel: 0
};
 
exports.help = {
  name: 'bakım-modu',
  usage: 'bakım',
};// codare ♥
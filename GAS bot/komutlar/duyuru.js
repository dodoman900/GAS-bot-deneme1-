const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');
const data = require('quick.db');
 
exports.run = async (client, message, args) => {
if(!message.member.permissions.has('ADMINISTRATOR')) {
    const err = new EmbedBuilder()
      .setThumbnail(message.author.displayAvatarURL({dynamic: true}))
      .setImage('https://cdn.glitch.com/0c8ef551-5187-48a8-9daf-f2cc35630f21%2Fyoneticigif.gif')
      .setTitle('Bir hata oldu!')
      .setDescription(`• \`${client.ayarlar.prefix}duyuru | ${client.ayarlar.prefix}yaz\` **kullanmak için,** \`Yönetici\` **yetkisine sahip olman gerekiyor.**`);
    return message.channel.send({ embeds: [err] });
}
if(!args[0]) {
    const err2 = new EmbedBuilder().setTitle('Bir hata oldu!').setDescription(`${message.author} İçerik için yazı yazmayı unuttunuz.`);
    return message.channel.send({ embeds: [err2] });
}
message.delete();
return message.channel.send({ embeds: [ new EmbedBuilder().setDescription(args.join(' ')) ] });

};
exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['duyuru'],
  permLevel: 0
}

exports.help = {
  name: 'duyuru'
};

// GAS bot

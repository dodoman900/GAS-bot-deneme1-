const { MessageEmbed } = require("discord.js");

const ayarlar = require('../ayarlar.json')
var prefix = ayarlar.prefix
exports.run = async (client, message, args, join, ) => {
    const embed = new MessageEmbed()
        .setAuthor("Komut tablosu")
        .setTitle("**Groß Anime Servers Genel Hizmet Botu** \n \n Yalnızca resmi hizmete mahsustur.")
       
        .setDescription(`Toplam komut sayısı: ${client.commands.size}`)
        .setColor("PURPLE")
        .setTimestamp()
        .setThumbnail(client.user.displayAvatarURL)
        .setFooter(message.author.tag, message.author.displayAvatarURL);
    client.commands.forEach(cmd => {
        embed.addField(`${cmd.help.name}`, `Diğer kullanımlar: ${cmd.help.aliases || "Yok"}\ Kullanımı: \`${prefix}${cmd.help.usage}\``, true);
    });
    return message.channel.send(embed);
}


exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['h', 'halp', 'help', 'y']
};

exports.help = {
  name: 'yardım',
  description: 'Tüm komutları gösterir.',
  usage: 'yardım [komut]'
};

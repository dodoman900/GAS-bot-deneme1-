const Discord = require("discord.js")
const db = require("quick.db")

exports.run = async(client, message, args) => {  

    const öneri = args.slice(0).join(' ');
    if(!öneri) return message.channel.send("Bir öneri belirtmelisin. ")
       
  const embed = new Discord.MessageEmbed()
.setTitle("Bana bir öneride bulundular :3")
  .addField("Belirtilen Öneri:", öneri)
  .addField("Öneri Belirten Kişi:", `Adı: **${message.author.tag}** - Etiketi: <@${message.author.id}> - ID: **${message.author.id}**`)
  .setColor("BLUE")
  .setFooter(client.user.username, client.user.avatarURL())
  .setThumbnail(message.author.avatarURL({format: "gif"}))
  message.channel.send(` Öneriniz başarıyla iletildi!`)
  client.channels.cache.get("874877194445393961").send(embed)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["öner"],
    permLevel: 0
}

exports.help = {
    name: "öneri",
    description: "öneri bildirirsiniz",
    usage: "öneri <öneri>"
}
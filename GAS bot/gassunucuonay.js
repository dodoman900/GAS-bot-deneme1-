let db = require('quick.db')


exports.run = async(client, message, args) => {  

exports.run = async (client, message, args) => {
    const ayarlar = require('../ayarlar.json')
    let id = ayarlar.sahip //buranın içerisine kendi id ni yaz
    let user = message.mentions.users.first() || client.users.cache.get(args.slice(1).join(' '))
    if (message.author.id !== id) return message.channel.send("Bu komutu yalnızca bot sahibi kullanabilir!")
    }
    
    
let guild = client.guilds.cache.get(args[0])
db.set(`onay.${guild.id}`, true)
}

exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["onay","gas-onay"],
    permLevel: 3,
    kategori: "mod"
  };
  
  
  exports.help = {
    name: 'gasonay',
    description: 'Groß Anime Servers kanallarını kurar.',
    usage: 'gas-kanalları'
  };
const Discord = require("discord.js")
const ms = require("ms")
const db = require("quick.db")
module.exports.run = async(client,message,args)=> {
let zaman = args[0]
let yazı = args.slice(1).join(" ")

if(!zaman) return message.reply(":x: Bir süre girmelisin! \n !hatırlat GAS Botu >_<")
if(!yazı) return message.reply(":x: Bir yazı girmelisin! \n \n !hatırlat GAS Botu >_<")
db.set(`hatırlat_${message.author.id}`,Date.now() + ms(zaman))
message.channel.send("Haaai,siparişiniz alındı gerekli sürede dönüş yapılacak :3")
const interval = setInterval(function() {


    if(Date.now() > db.fetch(`hatırlat_${message.author.id}`)){
        db.delete(`hatırlat_${message.author.id}`)
        message.author.send(`**Hatırlatma:**${yazı}`)
        .catch(e => console.log(e))
        clearInterval(interval)
    }

},1000)
}

exports.conf = {
    enabled: true,
    guildOnly: true,
    aliases:[]
}

exports.help = {
    name:"hatırlat",
    description:"Hatırlatırsınız",
    usage:"hatırlat 10m Dream Studio",
    category:"genel"
}
const Discord = require('discord.js');


exports.run = async (client, message, args) => {
  if(message.author.id !== "817403879725072395") return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setDescription("Way Çakal Bu Sahibimin Komutu!"))
                 if(isNaN(args[0])){
                   const embeds = new Discord.MessageEmbed()
                   .setColor("RANDOM")
                   .setDescription("Lütfen Sayı Yaz!")
                   message.channel.send(embeds)
                 }else{

                   let icon = client.user.displayAvatarURL();
                  if (client.guilds.cache.size < args[0]){
                   const embedss = new Discord.MessageEmbed()
                   .setColor("RANDOM")
                   .setDescription(" Bu Komutu Kullana Bilmek İçin Botun En Az "+args[0]+" Sunucuda Olması Lazım.")
                   message.channel.send(embedss)
                    message.channel.send()
                  }else{
                    
                    let content = "";
                   // v14: koleksiyondan diziye çevirip sırala
                   const top = [...client.guilds.cache.values()].sort((a,b) => b.memberCount - a.memberCount);
                    for (let i = 0; i < args[0]; i++) {
                      content += `${i+1}. **${top[i].name}** ~ **${top[i].memberCount}** Kullanıcı Bulunmaktadır. \n`
                    }
                   const embed = new Discord.MessageEmbed()
                   .setColor("RANDOM")           
                   .setTitle(`Botun Olduğu En İyi `+ args[0]+ ` Sunucu`)
                   .setThumbnail(icon)
                   .setDescription(content)
                   message.channel.send(embed);
                  }
                 }
};
exports.conf = {
  enabled: true, 
  guildOnly: false, 
  aliases: ["toplist"],
  permLevel: 0
};

exports.help = {
  name: 'top', 
  description: '',
  usage: 'top'
};

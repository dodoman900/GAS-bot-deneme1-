const dc = require('discord.js');
exports.run = async(client, message, args) => {
const embed = new dc.MessageEmbed()
.setColor("RANDOM")
.setFooter(`${message.author.tag} istedi`, message.author.displayAvatarURL({dynamic: true}))
.setTimestamp()
  message.channel.send(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %20")
                      .setColor("RANDOM"))
  .then(a => {
    setTimeout(function(){
      a.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %40")
            .setColor("RANDOM"))
      .then(b => {
        setTimeout(function(){
          b.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %60")
                .setColor("RANDOM"))
          .then(c => {
            setTimeout(function(){
              c.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %80")
                    .setColor("RANDOM"))
              .then(d => {
                setTimeout(function(){
                  d.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %100")
                        .setColor("RANDOM"))
                  .then(e => {
                    setTimeout(function(){
                      e.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %100 .")
                            .setColor("RANDOM"))
                      .then(f => {
                        setTimeout(function(){
                          f.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %100 ..")
                                .setColor("RANDOM"))
                          .then(g => {
                            setTimeout(function(){
                              g.edit(embed.setDescription("Ping değerim hesaplanıyor lütfen bekleyiniz. %100 ...")
                                    .setColor("RANDOM"))
                              .then(h => {
                                setTimeout(function(){
                                  h.edit(embed.setDescription(`:ping_ping: Pingim: **${client.ws.ping}** ms!`)
                                        .setColor("GREEN"))
                                }, 500)
                              })
                            }, 500)
                          })
                        }, 500)
                      })
                    }, 500)
                  })
                }, 1000)
              })
            }, 1000)
          })
        }, 1000)
      })
    }, 1000)
  })
};
exports.conf = {
  aliases: ['p'],
  permLevel: 0
};
exports.help = {
  name: "ping"
};
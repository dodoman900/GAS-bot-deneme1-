const ayarlar = require('../ayarlar.json');
var prefix = ayarlar.prefix
let talkedRecently = new Set();
module.exports = message => {
  if (talkedRecently.has(message.author.id)) {
    return;
  }
  talkedRecently.add(message.author.id);
	setTimeout(() => {
    talkedRecently.delete(message.author.id);
  }, 2500);
  let client = message.client;
  if (message.author.bot) return;
  if (!message.content.startsWith(ayarlar.prefix)) return;
  let command = message.content.split(' ')[0].slice(ayarlar.prefix.length);
  let params = message.content.split(' ').slice(1);
  let perms = client.elevation(message);
  let cmd;
  
  if (client.commands.has(command)) {
    cmd = client.commands.get(command);
 
  } else if (client.aliases.has(command)) {
    cmd = client.commands.get(client.aliases.get(command));
   }
 
   /* if(cmd) kısmının üzerine bunu yazıyorsunuz */
   var database = require('quick.db')
   if(cmd && cmd.help.name !== 'bakım-modu') {
    const neblmölçmedimikamk = require('quick.db').fetch(client.user.id);
    if(neblmölçmedimikamk == true) {
    var DURATION = require('humanize-duration');
    const chimped = database.fetch(client.user.id+':)');
    var TIMESTAMP = Date.now() - chimped.time;
    var RESULT = DURATION(TIMESTAMP, { language: 'tr', round: true, conjunction: ', ', serialComma: false });
    message.react('❌');
    return message.reply(`***${client.user.username}*** şu anda bakımda.\nYaklaşık ***${RESULT} önce*** bakıma alınmış.\nBakıma alan: ***${chimped.author.tag}***`);
    };
    };

  //MESSAGE.JS DE 
// cmd.run(client, message, args, db); YAZISININ ÜSTÜNE
//YAPIŞTIR
var db = require('quick.db')
if (db.fetch(`cokaradalistere_${message.author.id}`)) return message.channel.send("Olamaz sen botun karalistesinde bulunuyorsun botu kullanamazsın.")
  if (cmd) {
    if (perms < cmd.conf.permLevel) return;
    try {
      const res = cmd.run(client, message, params, perms);
      if (res && res.catch) res.catch(err => {
        const ch = client.channels.cache.get('874864524837146645');
        if (ch) ch.send(err.toString()).catch(()=>{});
      });
    } catch (err) {
      const ch = client.channels.cache.get('874864524837146645');
      if (ch) ch.send(err.toString()).catch(()=>{});
    }
   }
 
 };


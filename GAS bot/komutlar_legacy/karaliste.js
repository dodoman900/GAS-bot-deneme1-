const Discord = require('discord.js');
const Blacklist = require('../models/Blacklist'); // Karaliste modeli
const ayarlar = require('../ayarlar.json');

exports.run = async (client, message, args) => {
  if (message.author.id !== ayarlar.sahip) return message.reply('Bu komutu yalnızca bot sahibi kullanabilir!');

  const subCommand = args[0];
  const userId = args[1];
  if (!subCommand || !['aç', 'kapat', 'bilgi'].includes(subCommand)) {
    return message.reply('Lütfen **aç**, **kapat** veya **bilgi** yazınız.');
  }

  if (!userId) return message.reply('Bir kullanıcı ID belirtmelisiniz.');

  const user = await client.users.fetch(userId).catch(() => null);
  if (!user) return message.reply('Geçerli bir kullanıcı ID belirtmelisiniz.');

  if (subCommand === 'aç') {
    const existing = await Blacklist.findOne({ userId });
    if (existing) return message.reply(`${user.tag} zaten karalistede.`);
    await Blacklist.create({ userId });
    return message.reply(`${user.tag} artık botu kullanamayacak.`);
  }

  if (subCommand === 'kapat') {
    const existing = await Blacklist.findOne({ userId });
    if (!existing) return message.reply(`${user.tag} karalistede değil.`);
    await Blacklist.deleteOne({ userId });
    return message.reply(`${user.tag} artık botu kullanabilir.`);
  }

  if (subCommand === 'bilgi') {
    const existing = await Blacklist.findOne({ userId });
    if (existing) {
      return message.reply(`${user.tag} karalistede. Sebep: ${existing.reason}`);
    } else {
      return message.reply(`${user.tag} karalistede değil.`);
    }
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['karaliste'],
  permLevel: 0,
};

exports.help = {
  name: 'blacklist',
  description: 'Kullanıcıyı karalisteye alır veya çıkarır.',
  usage: 'blacklist <aç|kapat|bilgi> <kullanıcıID>',
};
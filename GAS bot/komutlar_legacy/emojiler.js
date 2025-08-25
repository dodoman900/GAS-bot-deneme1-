const { EmbedBuilder } = require('discord.js');

exports.run = async (client, msg, args) => {
  if (!msg.guild) return msg.reply('Bu komutu sunucuda kullanınız.');
  try {
    const animEmotes = [];
    const staticEmotes = [];
    msg.guild.emojis.cache.forEach(e => {
      (e.animated ? animEmotes : staticEmotes).push(e.toString());
    });

    const staticText = staticEmotes.length ? `__**[${staticEmotes.length}] Normal Emoji**__\n${staticEmotes.join(' ')}` : '\n**Normal Emoji Bulunmuyor**';
    const animText = animEmotes.length ? `\n\n__**[${animEmotes.length}] Hareketli Emoji**__\n${animEmotes.join(' ')}` : '\n**Hareketli Emoji Bulunmuyor**';

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setDescription(staticText + animText)
      .setAuthor({ name: `${msg.guild.name} Sunucusu Emojileri`, iconURL: msg.guild.iconURL() })
      .setFooter({ text: `Bu komutu kullanan kullanıcı ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
      .setTimestamp();

    return msg.channel.send({ embeds: [embed] });
  } catch (err) {
    const embed = new EmbedBuilder()
      .setColor('Red')
      .setDescription('Sunucuda çok fazla emoji ya da başka bir hata var; gösteremiyorum.')
      .setFooter({ text: `Bu komutu kullanan kullanıcı ${msg.author.tag}`, iconURL: msg.author.displayAvatarURL() })
      .setTimestamp();
    return msg.channel.send({ embeds: [embed] });
  }
};

exports.conf = {
  aliases: ['emoji-liste'],
  permLevel: 0,
  kategori: 'Sunucu'
};

exports.help = {
  name: 'emojiler',
  description: 'Sunucudaki tüm emojileri gösterir.',
  usage: 'emojiler'
};

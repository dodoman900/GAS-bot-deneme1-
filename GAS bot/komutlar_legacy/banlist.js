const { EmbedBuilder } = require('discord.js');

// Sunucudaki yasaklıları listeleyen legacy (message) komut
exports.run = async (client, message, args) => {
  if (!message.guild) return message.reply('Bu komut sunucularda kullanılmalıdır.');
  try {
    const bans = await message.guild.bans.fetch();
    if (!bans || bans.size === 0) {
      const noEmbed = new EmbedBuilder()
        .setColor('#0070FF')
        .setDescription('Bu sunucuda yasaklı kullanıcı bulunmuyor.')
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL() })
        .setFooter({ text: `Bu komutu kullanan kullanıcı ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });
      return message.channel.send({ embeds: [noEmbed] });
    }

    // limit: çok uzun listeler embed sınırını aşabilir; burada basit string formunda gösteriyoruz (gerekiyorsa sayfalandır)
    const banListStr = bans.map(b => `${b.user.tag} (${b.user.id})`).join('\n').slice(0, 1900);
    const embed = new EmbedBuilder()
      .setColor('#0070FF')
      .setTitle('Sunucudaki Yasaklı Kullanıcılar')
      .setDescription(banListStr)
      .setFooter({ text: `Bu komutu kullanan kullanıcı ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    await message.channel.send({ embeds: [embed] });
  } catch (err) {
    const errEmbed = new EmbedBuilder()
      .setColor('Red')
      .setTitle('Hata')
      .setDescription('Sunucuda yasaklı kullanıcılar çok fazla veya bir hata oluştu; bunu gösteremiyorum.')
      .setFooter({ text: `Bu komutu kullanan kullanıcı ${message.author.tag}`, iconURL: message.author.displayAvatarURL() })
      .setTimestamp();
    return message.channel.send({ embeds: [errEmbed] });
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['yasak-listesi'],
  permLevel: 0
};

exports.help = {
  name: 'banlist',
  description: 'Sunucudaki yasaklı kullanıcıları gösterir.',
  usage: 'banlist'
};

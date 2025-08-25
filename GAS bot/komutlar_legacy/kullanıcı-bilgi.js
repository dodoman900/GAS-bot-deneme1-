const { EmbedBuilder } = require('discord.js');

function checkDays(date) {
  const now = Date.now();
  const diff = now - date.getTime();
  const days = Math.floor(diff / 86400000);
  return `${days} gün önce`;
}
function formatDate(d) {
  return d.toLocaleDateString('tr-TR', { day:'2-digit', month:'long', year:'numeric' });
}

exports.run = async (client, message, args) => {
  if (!message.guild) return;
  const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
  const member = message.guild.members.cache.get(user.id);
  if (!member) return message.reply('Kullanıcı sunucuda bulunamadı.');

  const embed = new EmbedBuilder()
    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL({ dynamic:true }) })
    .setThumbnail(user.displayAvatarURL({ dynamic:true }))
    .setColor(member.displayHexColor === '#000000' ? '#ffffff' : member.displayHexColor)
    .addFields(
      { name: 'Üye bilgisi:', value: `**Kullanıcı İsmi:** ${member.displayName}\n**Katılım Tarihi:** ${formatDate(member.joinedAt)} - ${checkDays(member.joinedAt)}\n**Rolleri:** ${member.roles.cache.sort((a,b)=>b.position-a.position).map(r=>r.toString()).slice(0,20).join(' | ') || 'Bulunmuyor'}` },
      { name: 'Kullanıcı bilgisi:', value: `**Tag**: ${user.tag}\n**ID:** ${user.id}\n**Kuruluş Tarihi**: ${formatDate(user.createdAt)} - ${checkDays(user.createdAt)}` }
    )
    .setFooter({ text: `Bu komutu kullanan kullanıcı ${message.author.tag}`, iconURL: message.author.displayAvatarURL({ dynamic:true }) })
    .setTimestamp();

  return message.channel.send({ embeds: [embed] });
};

exports.conf = { aliases: ['profilim','kullanıcıbilgi','profil','kb','bilgi'], permLevel: 0, kategori: 'Genel' };
exports.help = { name: 'kullanıcı-bilgi', description: 'Kullanıcı hakkında bilgi verir.', usage: 'kullanıcı-bilgi @Kullanıcı' };
  kategori: 'Genel'
};

exports.help = {
  name: 'kullanıcı-bilgi',
  description: 'Kullanıcı hakkında bilgi verir.',
  usage: 'kullanıcı-bilgi @Kullanıcı'
};

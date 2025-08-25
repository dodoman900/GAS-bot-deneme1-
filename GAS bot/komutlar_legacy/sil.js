const { EmbedBuilder, PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {
  // Yetki kontrolü
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
    return message.reply('Bu komutu kullanmak için Mesajları Yönet yetkisine sahip olmalısınız.');
  }

  const amount = parseInt(args[0], 10);
  if (!amount || amount <= 0) return message.reply('Silmem için geçerli bir sayı belirtin.');
  if (amount > 100) return message.reply('En fazla 100 mesaj silebilirim.');

  try {
    await message.channel.bulkDelete(amount, true);
    const embed = new EmbedBuilder()
      .setDescription(`**${amount}** mesaj silindi.`)
      .setColor('Green');
    const m = await message.channel.send({ embeds: [embed] });
    setTimeout(() => m.delete().catch(()=>{}), 3000);
  } catch (err) {
    console.error(err);
    return message.reply('Mesaj silme sırasında bir hata oluştu.');
  }
};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'temizle',
  description: 'Belirtilen miktarda mesaj siler',
  usage: 'temizle <miktar>'
};
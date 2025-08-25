const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  // Slash komut tanımı
  data: new SlashCommandBuilder()
    .setName('duyuru') // Komut adı
    .setDescription('Belirtilen mesajı duyuru olarak gönderir.') // Komut açıklaması
    .addStringOption(option =>
      option.setName('mesaj')
        .setDescription('Duyurulacak mesaj')
        .setRequired(true)), // Mesaj parametresi

  // Komutun çalıştırılma işlevi
  async execute(interaction) {
    const mesaj = interaction.options.getString('mesaj'); // Slash komutundan mesajı al
    const embed = new EmbedBuilder()
      .setColor('Blue')
      .setDescription(mesaj);

    await interaction.reply({ content: 'Duyuru gönderildi.', ephemeral: true });
    await interaction.channel.send({ embeds: [embed] });
  }
};
  // Legacy message-based destek (exports.run benzeri)
  const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.member || !message.member.permissions.has('ADMINISTRATOR')) {
    return message.channel.send('Bu komutu kullanmak için Yönetici olmalısınız.');
  }
  const text = args.join(' ').trim();
  if (!text) return message.channel.send('Duyuru metnini girin.');
  const embed = new EmbedBuilder().setColor('Blue').setDescription(text);
  await message.channel.send({ embeds: [embed] }).catch(()=>{});
  await message.delete().catch(()=>{});
};

exports.conf = { enabled: true, guildOnly: true, aliases: ['duyuru','announce'], permLevel: 2 };
exports.help = { name: 'duyuru', description: 'Kanala duyuru gönderir (admin).', usage: 'duyuru <mesaj>' };

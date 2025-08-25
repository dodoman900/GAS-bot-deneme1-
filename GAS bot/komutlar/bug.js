const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bug')
    .setDescription('Botla ilgili bir hatayı bildirir.')
    .addStringOption(option =>
      option.setName('hata')
        .setDescription('Bildirilecek hata')
        .setRequired(true)),

  async execute(interaction) {
    const hata = interaction.options.getString('hata');
    const kanal = interaction.client.channels.cache.get('874877419851513886'); // Hata bildirimi kanalı

    const embed = new EmbedBuilder()
      .setTitle('Hata Bildirimi')
      .setColor('Red')
      .addFields(
        { name: 'Hata', value: hata },
        { name: 'Bildiren Kullanıcı', value: `${interaction.user.tag} (${interaction.user.id})` },
        { name: 'Sunucu', value: interaction.guild.name, inline: true },
        { name: 'Kanal', value: interaction.channel.name, inline: true },
      );

    await interaction.reply({ content: 'Hata bildiriminiz iletildi.', ephemeral: true });
    if (kanal) await kanal.send({ embeds: [embed] });
  },
};
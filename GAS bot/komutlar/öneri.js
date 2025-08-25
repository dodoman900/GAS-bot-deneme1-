const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ayarlar = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('öneri')
    .setDescription('Önerinizi bildirirsiniz.')
    .addStringOption(o => o.setName('metin').setDescription('Öneriniz').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('metin');
    const embed = new EmbedBuilder()
      .setTitle('Yeni Öneri')
      .setDescription(text)
      .addFields({ name: 'Gönderen', value: `${interaction.user.tag} (${interaction.user.id})` })
      .setTimestamp();

    await interaction.reply({ content: 'Öneriniz alındı, teşekkürler!', ephemeral: true });

    const owner = await interaction.client.users.fetch(ayarlar.sahip).catch(() => null);
    if (owner) owner.send({ embeds: [embed] }).catch(() => { });
  },
};
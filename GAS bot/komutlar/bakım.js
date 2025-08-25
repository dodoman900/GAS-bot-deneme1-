const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Maintenance = require('../models/Maintenance');
const ayarlar = require('../ayarlar.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bakım')
    .setDescription('Botu bakım moduna alır veya çıkarır.'),

  async execute(interaction) {
    if (interaction.user.id !== ayarlar.sahip) {
      return interaction.reply({ content: 'Bu komutu yalnızca bot sahibi kullanabilir!', ephemeral: true });
    }

    const durum = await Maintenance.findOne({ botID: interaction.client.user.id });
    if (durum) {
      await Maintenance.deleteOne({ botID: interaction.client.user.id });
      return interaction.reply('Bakım modu kapatıldı.');
    } else {
      await Maintenance.create({
        botID: interaction.client.user.id,
        authorID: interaction.user.id,
        timestamp: Date.now(),
      });
      return interaction.reply('Bakım modu açıldı. Artık komutlar kullanılamayacak.');
    }
  },
};
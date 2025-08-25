const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  // Slash komut tanımı
  data: new SlashCommandBuilder()
    .setName('ping') // Komut adı
    .setDescription('Botun ping değerini gösterir.'), // Komut açıklaması

  // Komutun çalıştırılma işlevi
  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setColor('Green')
      .setDescription(`:ping_pong: WS Ping: **${interaction.client.ws.ping}ms**`);
    await interaction.reply({ embeds: [embed] });
  },
};
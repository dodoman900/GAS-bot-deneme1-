const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  // Slash komut tanımı
  data: new SlashCommandBuilder()
    .setName('istatistik') // Komut adı
    .setDescription('Botun istatistiklerini gösterir.'), // Komut açıklaması

  // Komutun çalıştırılma işlevi
  async execute(interaction) {
    const uptime = Math.floor(process.uptime()); // Botun çalışma süresi
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Bellek kullanımı

    // Embed oluşturma
    const embed = new EmbedBuilder()
      .setTitle('Bot İstatistikleri')
      .setColor('Blue')
      .addFields(
        { name: 'Çalışma Süresi', value: `${Math.floor(uptime / 60)} dakika`, inline: true },
        { name: 'Bellek Kullanımı', value: `${memory} MB`, inline: true },
        { name: 'Sunucular', value: `${interaction.client.guilds.cache.size}`, inline: true },
      )
      .setTimestamp();

    // Yanıt gönderme
    await interaction.reply({ embeds: [embed] });
  },
};
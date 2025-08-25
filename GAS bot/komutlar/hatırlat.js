// filepath: c:\Users\Doğukan Adam\Desktop\GAS-bot-deneme1-\GAS bot\komutlar\hatırlat.js
// Basit hatırlatıcı (in-memory). Slash parametreleri: süre (ör. 10m) ve mesaj.

const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hatırlat')
    .setDescription('Belirtilen süre sonra DM ile hatırlatma gönderir.')
    .addStringOption(o => o.setName('süre').setDescription('Ör: 10m, 2h').setRequired(true))
    .addStringOption(o => o.setName('mesaj').setDescription('Hatırlatma mesajı').setRequired(true)),
  async execute(interaction) {
    const süre = interaction.options.getString('süre');
    const msg = interaction.options.getString('mesaj');
    const msz = ms(süre);
    if (!msz) return interaction.reply({ content: 'Geçersiz süre formatı.', ephemeral: true });
    await interaction.reply({ content: `Hatırlatma ayarlandı: ${süre}`, ephemeral: true });
    setTimeout(async () => {
      try { await interaction.user.send(`Hatırlatma: ${msg}`); } catch (e) {}
    }, msz);
  },
};
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yaz')
    .setDescription('Bot kanala belirtilen metni yazar.')
    .addStringOption(o => o.setName('metin').setDescription('Yazılacak metin').setRequired(true)),
  async execute(interaction) {
    const text = interaction.options.getString('metin');
    await interaction.reply({ content: 'Mesaj gönderiliyor...', ephemeral: true });
    await interaction.channel.send({ content: text });
  },
};

exports.run = (client, message, args) => {
  const text = args.join(' ').trim();
  if (!text) return message.channel.send('Yazdırılacak metni girin.');
  message.channel.send(text).catch(()=>{});
  try { message.delete().catch(()=>{}); } catch(_) {}
};

exports.conf = { enabled: true, guildOnly: true, aliases: ['say','yaz'], permLevel: 2 };
exports.help = { name: 'yaz', description: 'Bot kanala mesaj yazar.', usage: 'yaz <mesaj>' };

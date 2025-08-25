const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('anket')
    .setDescription('Bir anket oluşturur.')
    .addStringOption(option =>
      option.setName('başlık')
        .setDescription('Anket başlığı')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('şıklar')
        .setDescription('Şıkları virgülle ayırarak yazın (ör: şık1, şık2, şık3)')
        .setRequired(true)),

  async execute(interaction) {
    const başlık = interaction.options.getString('başlık');
    const şıklar = interaction.options.getString('şıklar').split(',').map(şık => şık.trim());
    if (şıklar.length > 10) {
      return interaction.reply({ content: 'Maksimum 10 şık ekleyebilirsiniz.', ephemeral: true });
    }

    const emojies = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    const embed = new EmbedBuilder()
      .setTitle(başlık)
      .setColor('Blue')
      .setDescription(şıklar.map((şık, i) => `${emojies[i]} ${şık}`).join('\n'));

    const message = await interaction.reply({ embeds: [embed], fetchReply: true });
    for (let i = 0; i < şıklar.length; i++) {
      await message.react(emojies[i]);
    }
  },
};
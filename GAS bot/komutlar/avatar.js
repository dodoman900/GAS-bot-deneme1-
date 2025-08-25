const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Kullanıcının avatarını gösterir.')
    .addUserOption(o => o.setName('kullanıcı').setDescription('Avatarı gösterilecek kullanıcı').setRequired(false)),

  async execute(interaction) {
    const user = interaction.options.getUser('kullanıcı') || interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`${user.username}#${user.discriminator}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setColor('Random');

    await interaction.reply({ embeds: [embed] });
  },
};
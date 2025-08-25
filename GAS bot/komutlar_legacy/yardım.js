const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('yardım')
    .setDescription('Tüm komutları gösterir.'),
  async execute(interaction) {
    const commands = interaction.client.commands;
    const embed = new EmbedBuilder()
      .setTitle('Komut Tablosu')
      .setColor('Purple')
      .setTimestamp()
      .setDescription(`Toplam komut sayısı: ${commands.size}`);
    for (const [name, cmd] of commands) {
      embed.addFields({ name: `/${name}`, value: cmd.data.description || 'Açıklama yok.', inline: true });
    }
    await interaction.reply({ embeds: [embed] });
  },
};

exports.run = (client, message, args) => {
  const prefix = require('../ayarlar.json').prefix || '!';
  const cmds = Array.from(client.legacyCommands.keys()).sort();
  const lines = cmds.map(c => `${prefix}${c}`);
  const chunk = lines.join('\n') || 'Komut bulunamadı.';
  return message.channel.send(`Mevcut komutlar:\n\`\`\`\n${chunk}\n\`\`\``);
};

exports.conf = { enabled: true, guildOnly: false, aliases: ['help'], permLevel: 0 };
exports.help = { name: 'yardım', description: 'Komut listesini gösterir.', usage: 'yardım' };

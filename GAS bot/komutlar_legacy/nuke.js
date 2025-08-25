const { EmbedBuilder, PermissionsBitField } = require('discord.js');

exports.run = async (client, message, args) => {
  if (!message.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) return message.reply('Bu komutu kullanmak için Kanalları Yönet yetkisine sahip olmalısınız.');
  const onayembed = new EmbedBuilder()
    .setColor('Red')
    .setTitle('Nuke Komutu')
    .setDescription('**UYARI!** Bu kanal silinip kopyası oluşturulacaktır. Onaylıyorsanız 👍, iptal için 👎.')
    .setTimestamp();

  const msg = await message.channel.send({ embeds: [onayembed] });
  await msg.react('👍'); await msg.react('👎');

  const filter = (reaction, user) => ['👍','👎'].includes(reaction.emoji.name) && user.id === message.author.id;
  msg.awaitReactions({ filter, max: 1, time: 60000, errors: ['time'] })
    .then(collected => {
      const reaction = collected.first();
      if (reaction.emoji.name === '👍') {
        message.channel.clone({ position: message.channel.position }).then(ch => {
          message.channel.delete().catch(()=>{});
        }).catch(()=>{});
      } else {
        message.reply('Nuke işlemi iptal edildi!').then(m => setTimeout(()=>m.delete().catch(()=>{}),5000));
        msg.delete().catch(()=>{});
      }
    })
    .catch(() => {
      message.reply('Zaman aşımı veya hata oluştu.').then(m => setTimeout(()=>m.delete().catch(()=>{}),5000));
    });
};

exports.conf = { enabled: true, guildOnly: true, aliases: [], permLevel: 3, kategori: 'sunucu' };
exports.help = { name: 'nuke', description: 'Bot bulunduğunuz kanalı siler ve yeniden oluşturur.', usage: 'nuke' };

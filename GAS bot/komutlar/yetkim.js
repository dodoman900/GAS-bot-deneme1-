const Discord = require('discord.js');
const { PermissionFlagsBits } = require('discord.js');
const { stripIndents } = require('common-tags');
 
exports.run = (client, msg, args) => {
 
    let x;
    let x2;
    let x3;
    let x4;
    let x5;
    let x6;
    let x7;
    let x8;
    let x9;
    let x10;
    let x11;
    
    //yönetici
    if (msg.member.permissions.has(PermissionFlagsBits.Administrator)) x = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.Administrator)) x = "-"
    
    //Denetim kaydı
    if (msg.member.permissions.has(PermissionFlagsBits.ViewAuditLog)) x2 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ViewAuditLog)) x2 = "-"
    
    //Sunucuyu yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageGuild)) x3 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageGuild)) x3 = "-"
    
    //Rolleri yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageRoles)) x4 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageRoles)) x4 = "-"
    
    //Kanalları yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageChannels)) x5 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageChannels)) x5 = "-"
    
    //üyeleri at
    if (msg.member.permissions.has(PermissionFlagsBits.KickMembers)) x6 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.KickMembers)) x6 = "-"
    
    //üyeleri yasakla
    if (msg.member.permissions.has(PermissionFlagsBits.BanMembers)) x7 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.BanMembers)) x7 = "-"
    
    //mesajları yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageMessages)) x8 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageMessages)) x8 = "-"
    
    //kullanıcı adlarını yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageNicknames)) x9 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageNicknames)) x9 = "-"
    
    //emojileri yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) x10 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageEmojisAndStickers)) x10 = "-"
    
    //webhookları yönet
    if (msg.member.permissions.has(PermissionFlagsBits.ManageWebhooks)) x11 = "+"
    if (!msg.member.permissions.has(PermissionFlagsBits.ManageWebhooks)) x11 = "-"
    
    msg.channel.send(stripIndents`
    \`\`\`diff
    ${x} Yönetici
${x2} Denetim Kaydını Görüntüle
${x3} Sunucuyu Yönet
${x4} Rolleri Yönet
${x5} Kanalları Yönet
${x6} Üyeleri At
${x7} Üyeleri Yasakla
${x8} Mesajları Yönet
${x9} Kullanıcı Adlarını Yönet
${x10} Emojileri Yönet
${x11} Webhook'ları Yönet
\`\`\`
   `)
  msg.channel.send("```md\n# Başında \"-\" olanlar o yetkiye sahip olunmadığını gösterir. \n# Başında \"+\" olanlar o yetkiye sahip olunduğunu gösterir. \n```")
 
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['izinlerim'],
  permLevel: 0,
    kategori: "Komutlar"
};

exports.help = {
  name: 'yetkilerim',
  description: 'Komutu kullandığınız sunucudaki yetkilerinizi/izinlerinizi gösterir.',
  usage: 'yetkilerim'
};
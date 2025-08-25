const Discord = require('discord.js');
const { ChannelType } = require('discord.js');
const ayarlar = require('../ayarlar.json')
 
exports.run = async(client, message, args) => {  
   if(message.author.id !== ayarlar.sahip) {
     message.channel.send(':x: **Üzgünüm ama bu komutu sadece bot sahibi kullanabilir!**');
  
   };
 
     if(message.author.id === ayarlar.sahip) {
       
             message.channel.send(new Discord.MessageEmbed().setColor('#000000').setTitle('Komut girişi').setDescription('Gerekli Dosyalar Kurulsunmu?.').setFooter('Bu eylemi onaylıyorsan "evet" yazman yeterlidir.Bu eylem 30 saniye içinde sona erecek'))
 .then(() => {
 message.channel.awaitMessages(response => response.content === 'evet', {
 max: 1,
 time: 30000,
 errors: ['time'],
 })
 .then((collected) => {
      (async () => {
        // create category
        const category = await message.guild.channels.create({ name: 'GroSS Anime Servers', type: ChannelType.GuildCategory });
        // create text channels under category
        await message.guild.channels.create({ name: 'gas-tanıtım', type: ChannelType.GuildText, parent: category.id });
        await message.guild.channels.create({ name: 'gas-sunucuları', type: ChannelType.GuildText, parent: category.id });
        await message.guild.channels.create({ name: 'gas-etkinlikleri', type: ChannelType.GuildText, parent: category.id });
        await message.channel.send("Gerekli kanallar kuruluyor. Rolleri ve süsleri ayarlamak sana düşer :3")
      })();
           });
 });
         
     }
 };
 
 exports.conf = {
   enabled: true,
   guildOnly: false,
   aliases: ["gas-kanallarını-kur","gas-kanal","kanal"],
   permLevel: 3,
   kategori: "mod"
 };
 
 exports.help = {
   name: 'gaskanalları',
   description: 'Groß Anime Servers kanallarını kurar.',
   usage: 'gas-kanalları'
 };
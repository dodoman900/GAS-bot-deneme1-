const Discord = require('discord.js');
const { EmbedBuilder } = require('discord.js');

exports.run = async (client, message, args) => {

  var ayarlar = require('../ayarlar.json')
  if(message.author.id !== ayarlar.sahip) {
    message.channel.send(':x: **Üzgünüm ama bu komutu sadece bot sahibi kullanabilir!**');
 
  };
  if(message.author.id === ayarlar.sahip) {

 const embed1 = new EmbedBuilder()
  .setColor('Purple')
  .setDescription('**Gro*SS* Anime Servers Tanıtım metni**: \n\n Bu topluluk sunucular arasında daha kuvvetli bağlar yapmak için kurulmuş bir topluluktur. \n Tamamen Anime/Manga temalı sunuculardan oluşmaktadır. \n Küçük büyük ayırmaksızın birsürü sunucuyu içinde bulunduracak olan GAS Topluluğu büyümek ve daha fazla sunucuyu bu topluluğa katarak etkileşimi sağlamaya çalışmaktadır. \n Bu bağlar ve sunucular arasındaki etkileşim insanlar arasındaki etkileşim sunucuların daha çok öne çıkmasını sağlayak şekildedir. \n Topluluktaki sunucuların birbiri arasındaki bağların gelişmesi için sürekli şekilde birbiriyle etkileşimde bulunmasına dayalı olarak yükselmeye çalışan bir topluluktur.')
 




const embed = new EmbedBuilder()
  .setColor('Purple')
  .setDescription("Sıkça Sorulan Sorular (S.S.S.) \n\n Neden bu adı seçtiniz,Gross kötü/kaba anlamında değil mi? \n Evet Gross İngilizce'de bu anlamlarda kullanılıyor. Lakin Almanca'da Groß Büyük/Yetişmiş/İhtişamlı anlamlarına gelmektedir. \n Bu oluşumu yaratırken de bu sorunun sürekli geleceğinin farkındaydık,ama kefeyi size bıraktık. \n\n Botunuz özgün mü? \n Kısmen. Botumuzdaki çoğu kod <@782215331765813258> tarafından yazılmış/düzenlenmiş olsa da altyapısı Github`daki bağışlanmış bir altyapı üstüne geliştirilmiştir." )
 




  const embed2 = new EmbedBuilder()
  .setColor('Purple')
  .setDescription('**Gro*SS* Anime Servers Kriterleri:** \n\n Sunucunuzun herkese hitap edecek düzgün bir biçimi olmalıdır. \n Bu kapsamda üyelerin durumu,yönetim biçimi ve yönetim sorumlularının tavırları göz önüne alınacaktır.\n Sunucu yönetiminin koşullara hızlı uyan dinamik bir yapısı olması gerekmektedir. \n Sunucularda kişilerin hak ve özgürlüklerini kısıtlayıcı kural ya da eylem olmamalıdır. \n Kaydolacak sunucuların yapılacak değişiklikleri yakından takip etmesi istenecektir.')
 .setImage('https://cdn.discordapp.com/attachments/841667665408163921/875123645209534525/GAS-BANNER.png')
 .setFooter({ text: " 2021 GroSS Anime Servers", iconURL: client.user.displayAvatarURL() })



 const embed3 = new EmbedBuilder()
.setColor('Purple')
.setTitle('Başvuru ve kayıt işlemleri')
.setDescription('**Gro*SS*Anime Servers**`e kaydolmak için [bu mavi renkteki yazıya tıklayarak](https://discord.gg/EWqXEF2Hd9) başvuru kanalına başvuruda bulunabilirsiniz \n <@782215331765813258> ile iletişime geçebilirsiniz.')



    
  
  
   
  
  
  
  
  
     message.channel.send({ embeds: [embed, embed1] });
     message.channel.send({ embeds: [embed2, embed3] });
   
      }  
     };





























   exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ["gas-tanıt","gas-tanıtım","tanıt"],
    permLevel: 3,
    kategori: "mod"
  };
  
  
  exports.help = {
    name: 'gastanıt',
    description: 'Groß Anime Servers kanallarını kurar.',
    usage: 'gas-kanalları'
  };
module.exports = class {
    constructor (client) {
      this.client = client;
    }
    
    async run (guild) {
        var Discord = require('discord.js');

        this.client.fetchUser(guild.ownerID).then(owner => {

            var REGION = {
                "us-east": `:flag_us: East USA`,
                "us-west": `:flag_us: West USA`,
                "us-south": `:flag_us: South USA`,
                "us-central": `:flag_us: Central USA`,
                "brazil": `:flag_br: Brazil`,
                "japan": `:flag_jp: Japan`,
                "russia": `:flag_ru: Russia`,
                "singapore": `:flag_sg: Singapore`,
                "southafrica": `:flag_za: South Africa`,
                "hongkong": `:flag_hk: Hong Kong`,
                "sydney": `:flag_au: Sydney`,
                "eu-west": `:flag_eu: Western Europe`,
                "eu-central": `:flag_eu: Central Europe`
              };
              
              let loop = ('https://cdn1.iconfinder.com/data/icons/flat-business-icons/128/search-512.png');
              let LeaveEmbed = new Discord.RichEmbed()
              .setFooter(`${client.user.username} © 2019`, loop)
              .setTitle(`📌 ${guild.name} vient d'enlever **HoRaBoT** :sob:`)
              .addField(`📋 __Nom du serveur__:`, `**${guild.name}**`,true)
              .addField(`📊 __Nombre de membre__:`,`**${guild.members.filter(m => m.user).size}**`, true)
              .addField(`📊 __Nombre de bot__:`,`**${guild.members.filter(member => member.user.bot).size}**`, true)
              .addField(`👑 __Propriétaire__:`,`${guild.owner}`,true)
              .addField(`🌎 __Région du serveur__:`,REGION[guild.region],true)
              .addField(`📁 __ID du serveur__:`,`${guild.id}`,true)
              .setColor('RED')

            this.client.channels.get(this.client.config.support.logs).send(LeaveEmbed);
        });

    }
}  
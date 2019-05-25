module.exports = class {
    constructor (client) {
      this.client = client;
    }
    
    async run (guild) {
        var Discord = require('discord.js');

        if(this.client.databases[5].get(`guilds.${guild.id}`)){
            guild.owner.send(`Ce serveur (**${guild.name}**) est blacklist de ${this.client.user.username} pour la raison suivante : \`${this.client.databases[5].get(`guilds.${guild.id}`)}\``).then(() => {
                guild.leave();
            }).catch(err => {
                guild.leave();
            });
        }
        this.client.functions.createGuild(this.client, guild);

        this.client.fetchUser(guild.ownerID).then(owner => { 

            var embed = new Discord.RichEmbed()
                .setAuthor('Thank you for adding me to your guild !')
                .setDescription(`Hey! Merci de m'avoir invité sur votre serveur \`${guild.name}\`🎉!\n\nVous pouvez voir une liste de toutes les commandes en utilisant la commande \`&help\`\n\nSi vous avez des questions, vous pouvez rejoindre le serveur de support (FR)!\n➤ [https://discord.gg/exbfWmD]`)
                .setColor(this.client.config.embed.color)
                .setFooter(this.client.config.embed.footer)
                .setTimestamp();
            owner.send(embed).catch(err => this.client.logger.log(`I can't send message of thanks to the founder of ${guild.id}`, 'error'))

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
            let liveJEmbed = new Discord.RichEmbed()
            .setFooter(`${client.user.username} © 2019`, loop)
            .setTitle(`📌 Merci à ${guild.name} d'avoir ajouté **Framboise 🌙**`)
            .addField(`📋 __Nom du serveur__:`, `**${guild.name}**`,true)
            .addField(`📊 __Nombre de membre__:`,`**${guild.members.filter(m => m.user).size}**`, true)
            .addField(`📊 __Nombre de bot__:`,`**${guild.members.filter(member => member.user.bot).size}**`, true)
            .addField(`👑 __Propriétaire__:`,`${guild.owner}`,true)
            .addField(`🌎 __Région du serveur__:`,REGION[guild.region],true)
            .addField(`📁 __ID du serveur__:`,`${guild.id}`,true)
            this.client.channels.get(this.client.config.support.logs).send(liveJEmbed);
            });
    }
}  
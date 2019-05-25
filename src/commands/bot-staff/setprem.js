const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let owner = '546834648458723393'
const utils = require('../../utils/utils.json')

class Setprem extends Command {

    constructor (client) {
        super(client, {
            name: "setprem",
            description: `Définis si l'utilisateur mentionné est oui ou non premium !`,
            usage: "setprem <@membre> <on | off>",
            enabled: true,
            guildOnly: false,
            category: `${'<:owner:562954090347364353>'} • __Owner__`,
            aliases: [""],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            examples: "$setprem @• ɴ ᴏ ʀ ᴢ 🌙#4621 on",
            owner: true
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        try {

                var membre = message.mentions.members.first();
                if(!membre) return message.channel.send(utils.emotes.no + ' | Merci de mentionner un utilisateur.');

                var statut = args[1];
                if(statut !== "on" && statut !== "off") return message.channel.send(utils.emotes.no + ' | **Merci de preciser un argument valide ( on ou off).!**');
            
                if(statut === "on"){
                    this.client.databases[0].set(membre.id+'.premium', 'true');
                    message.channel.send(':tada: | Félicitations '+membre+', tu fais désormais parti des membres premium !');
                    console.log(`\x1b[1;32m[\x1b[1;33mPREMIUM-SYS\x1b[1;32m]\x1b[1;31m ${message.author.tag} \x1b[1;37m vient de give \x1b[1;31mle premium\x1b[1;37m  à \x1b[1;31m${membre.user.tag}\x1b[1;37m  `)
                }
                if(statut === "off"){
                    this.client.databases[0].set(membre.id+'.premium', 'false');
                    message.channel.send(':sob: | **'+membre.user+'**,  **ne fais désormais plus partis des membres prémium !**');
                    membre.send(':sob: | **Désolé un moderateur du bot , vient de te retiré des membres prémium.!**')
                    console.log(`\x1b[1;32m[\x1b[1;33mPREMIUM-SYS\x1b[1;32m]\x1b[1;31m ${message.author.tag} \x1b[1;37m vient de retirer \x1b[1;31mLe premium\x1b[1;37m  à \x1b[1;31m${membre.user.tag}\x1b[1;37m  `)
                }       
    } catch (exeption) {  
    var error = new Discord.RichEmbed()
    .setTitle('ERREUR !')
    .setDescription(`${'<:crash:555758858186915850>'} **${exeption}**`)
    .setColor('RED')
    .setFooter(`${this.client.user.username} © | Touts droits réservés.`)
    .setTimestamp()
    return message.channel.send(error);
        };
    };
  };

module.exports = Setprem;
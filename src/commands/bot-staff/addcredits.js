const Command = require("../../base/Command.js"),
Discord = require('discord.js');
const utils = require('../../utils/utils.json')

class Addcred extends Command {

    constructor (client) {
        super(client, {
            name: "addcoins",
            description: `Ajouter un nombre de coins à un utilisateur.`,
            usage: "addcoins <@membre> <nombre de coins à ajouter>",
            enabled: true,
            guildOnly: false,
            category: `${'<:tools1:563776735435423774>'} • __Staff du bot__`,
            aliases: ["addcred","addcredits"],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            examples: "$addcoins @• ɴ ᴏ ʀ ᴢ 🌙#4621 2000",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        try {
            let client = this.client
            var member = message.mentions.members.size > 0 ? message.mentions.members.first() : message.member;
            var member_data = (message.member === member) ? membersdata[0] : membersdata[1];

            if (member_data.modo === 'true') {
              var user = message.mentions.users.first() || message.author 
          
          //code
    
    
            var membre = message.mentions.members.first() || message.author;
            if(!membre) return message.channel.send(utils.emotes.no + ' | **Merci de préciser un utilisateur valide.!**')
                
            if(membre.id === message.author.id && message.author.id !='546834648458723393'){
              return message.channel.send(utils.emotes.no + `| **Vous ne pouvez pas vous donner de coins à vous même !**`)
            }    
            var nb_credits = args[1];
            if(isNaN(nb_credits) || !nb_credits) return message.channel.send(utils.emotes.no + ' | **Vous devez préciser un nombre de credits a ajouter.!**');
    
            this.client.databases[0].add(membre.id+'.credits', nb_credits);
        
            message.channel.send('<a:Sucess:557168623714566154>' + ' | '+nb_credits+` ${utils.emotes.money1}   ajoutés à **`+membre.user.username+`** !`);
            console.log(`\x1b[1;32m[\x1b[1;33mCOINS\x1b[1;32m]\x1b[1;31m ${message.author.tag} \x1b[1;37m vient de give \x1b[1;31m${nb_credits} coins\x1b[1;37m  à \x1b[1;31m${membre.user.tag}\x1b[1;37m  `)

            membre.send(`<:Infos:562297667560931366> | Un moderateur du bot (*${message.author.username}*), vient de vous give **${nb_credits}** coins ${utils.emotes.money1} .!`)
        }  else {
            let erreurembed = new Discord.RichEmbed()
            .setTitle('Hep Hep Hep,')
            .setDescription(utils.emotes.no + ` | Seul un **moderateur** de ${client.user.username} peut utilisez cette commande!`)
            .setColor(`RED`)
            .setFooter(`Dommage, ${message.author.tag} `)
            message.reply(erreurembed)
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

module.exports = Addcred;
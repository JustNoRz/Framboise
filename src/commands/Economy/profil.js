const Command = require("../../base/Command.js"),
Discord = require('discord.js');
const utils = require('../../utils/utils.json')

class Profile extends Command {

    constructor (client) {
        super(client, {
            name: "profil",
            description: `Affiche le profil du membre mentionné (ou de l'auteur du message)`,
            usage: "profile (@membre)",
            enabled: true,
            category: `${utils.emotes.moneybag} • __Economie__`,
            guildOnly: false,
            aliases: ["profile"],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            examples: "$profil @• ɴ ᴏ ʀ ᴢ 🌙#4621 ou $profil",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        try {
        var member = message.mentions.members.size > 0 ? message.mentions.members.first() : message.member;
        var user = message.mentions.users.first() || message.author

        var member_data = (message.member === member) ? membersdata[0] : membersdata[1];
        let userprem = (member_data.premium === "true") ? 'Oui :tada: !' : 'Non :sob:';

        var profile_embed = new Discord.RichEmbed()
            .setTitle("📌 • __Profil de " + user.tag + "__")
            .setDescription(member_data.bio)
            .addField(`${'<:membres:558956705631830017>'} • __Pseudo__`, user.username, true)
            .addField("💳 • __Argent__", member_data.credits + ` ${utils.emotes.coins}`, true)
            .addBlankField()
            .addField(`:medal:  • __Badge(s)__`,+member_data.badges.length > 0 ? ''+member_data.badges.map(b => b.str).join(' ') : `${utils.emotes.no} Aucun badges`+ '.', true)
            .addField(`<:premium:573977182481940480> • __Prémium__`,`${userprem}`,true)            
            .setColor(data.embed.color)
            .setFooter(data.embed.footer)
            .setTimestamp();

        message.channel.send(profile_embed); 
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

module.exports = Profile;
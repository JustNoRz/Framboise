const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let owner = '546834648458723393'
const utils = require('../../utils/utils.json')
let shop_db = require('../../utils/shop/shop.js')
class Setprem extends Command {

    constructor (client) {
        super(client, {
            name: "badges",
            description: `Permet de supprimer ou de give un badge à un utilisateur`,
            usage: "badges <@membre> <remove | add> <nom du badge>",
            enabled: true,
            guildOnly: false,
            category: `${'<:owner:562954090347364353>'} • __Owner__`,
            aliases: ["badges"],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            examples: "$badges add/remove @• ɴ ᴏ ʀ ᴢ 🌙#4621 dev01",
            owner: true
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        try {

                var membre = message.mentions.members.first();
                if(!membre) return message.channel.send(utils.emotes.no + ' | Merci de mentionner un utilisateur.');
                var member_data = (message.membre === membre) ? membersdata[0] : membersdata[1];
                var badge_name = args[2]
                var badge = null;
                for(var type in shop_db.badge){
                    var tbadges = shop_db.badge;
                    tbadges.forEach(gb => {
                        if(gb.name.toLowerCase() === badge_name) badge = gb;
                    });
                }


                if(!badge) return message.channel.send(`${utils.emotes.no} | Aucun badge trouvé pour \`${args[2]}\``);
                var statut = args[1];
                if(statut !== "add" && statut !== "remove") return message.channel.send(utils.emotes.no + ' | **Merci de preciser un argument valide (\`add\` ou \`remove\`).!**');
            
                if(statut === "add"){
                    if(member_data.badges.some(g => g.str === badge.str)) return message.channel.send(`${utils.emotes.no} | La personne possède déjà ce badge !`);
                    
                    let tbadges = [];
                    membersdata[0].badges.forEach(b => tbadges.push(b));
                    tbadges.push(badge);
                    
                    this.client.databases[0].set(membre.id+'.badges', tbadges);
                    message.channel.send(utils.emotes.yes + ' | **Vous venez de give le badge : '+badge_name+' ('+badge.str+') à '+membre+' !**');
                    console.log(`\x1b[1;32m[\x1b[1;33mBADGE-SYS\x1b[1;32m]\x1b[1;31m ${message.author.tag} \x1b[1;37m vient de give \x1b[1;31mle badge ${badge_name}\x1b[1;37m  à \x1b[1;31m${membre.user.tag}\x1b[1;37m  `)
                }
                if(statut === "remove"){
                    if(!member_data.badges.some(g => g.str === badge.str)) return message.channel.send(`${utils.emotes.no} | La personne ne possède pas ce badge !`);
                    this.client.databases[0].delete(membre.id+'.badges', tbadges);
                    message.channel.send(utils.emotes.yes + ' | **Vous venez retirer le badge : '+badge_name+' ('+badge.str+') à '+membre+' !**');
                    console.log(`\x1b[1;32m[\x1b[1;33mBADGE-SYS\x1b[1;32m]\x1b[1;31m ${message.author.tag} \x1b[1;37m vient de supprimer \x1b[1;31mLe badge\x1b[1;37m <badge> à \x1b[1;31m${membre.user.tag}\x1b[1;37m  `)
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
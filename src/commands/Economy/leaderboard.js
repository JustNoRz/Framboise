const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let functions = require('../../utils/functions')
const utils = require('../../utils/utils.json')

class Leaderboard extends Command {
    constructor (client) {
        super(client, {
            name: "leaderboard",
            description: `Affiche les utilisateurs qui dispose du plus de crédits et de réputation !`,
            usage: "leaderboard",
            enabled: true,
            guildOnly: false,
            category: `${utils.emotes.moneybag} • __Economie__`,
            aliases: ["lead"],
            permission: false,
            botpermissions: [ "SEND_MESSAGES" ],
            nsfw: false,
            examples: "$leaderboard",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        try{
            var asciitable = require('ascii-table');
     
            var leaderboard = [];
     
            this.client.databases[0].fetchAll().forEach(user => {
                if(typeof user.data !== 'object') user.data = JSON.parse(user.data);
     
                leaderboard.push({
                    id:user.ID,
                    credits:user.data.credits,
                    rep:user.data.rep,
                });
            });
     
            
            var validArgs = [
                "credits",
                "rep",
            ]
            if(!args[0] || !validArgs.includes(args[0])) return message.channel.send(utils.emotes.no + ' | Veuillez entrer un type de leaderboard ! (\`credits\` ou \`rep\`)');
            var order = [];

            let leadtop = []
            if(args[0] === 'rep') {
                leadtop = 'REPUTATIONS'}
            if(args[0] === 'credits'){
                leadtop = 'CREDITS'
            }
          
            var table = new asciitable(`CLASSEMENT PAR ${leadtop}`);
            if(args[0].toLowerCase() == 'rep' || args[0].toLowerCase() == 'reputation'){
                leaderboard = this.client.functions.sortByKey(leaderboard, 'rep');
                table.setHeading('#', 'Utilisateur', 'Reputation', 'Credits');
                order.push('rep','credits');
            }

        if(args[0].toLowerCase() == 'credits' || args[0].toLowerCase() == 'crédits'){
            leaderboard = this.client.functions.sortByKey(leaderboard, 'credits');
            table.setHeading('#', 'Utilisateur', 'Credits','Reputation');
            order.push('credits','rep');
        }
            
            if(leaderboard.length > 20) leaderboard.length = 20;
     
            fetchUsers(leaderboard, table, this.client).then(newTable => {
             var leaderboard_embed = new Discord.RichEmbed()
             .setAuthor('Leaderboard', this.client.user.displayAvatarURL)
             .setDescription('```'+newTable.toString()+'```')
             .setColor(data.embed.color)
             .setFooter(`${this.client.user.username} © | Touts droits réservés.`)
             message.channel.send(leaderboard_embed)
            });
     
            async function fetchUsers(array, table, client) {
                return new Promise((resolve, reject) => {
                    var pos = 0;
                    var narray = [];
                    array.forEach(element => {
                        client.fetchUser(element.id).then(user => {
                            pos++; 
                            var regex = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
                            var _user = user.username.replace(regex, '');
                            if(_user.length > 20) _user = _user.substr(0, 20)
                            table.addRow(pos, _user, element[order[0]], element[order[1]]);
                        });
                    });
                    resolve(table);
                });
            }
     
       } catch (exeption) {  
       var error = new Discord.RichEmbed()
       .setTitle('ERREUR !')
       .setDescription(`${'<:crash:555758858186915850>'} **${exeption}**`)
       .setColor('RED')
       .setFooter(`${this.client.user.username} © | Touts droits réservés.`)
       .setTimestamp()
       console.error(exeption)
       return message.channel.send(error);
        }
    }

}

module.exports = Leaderboard;
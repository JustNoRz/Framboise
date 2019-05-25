const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let owner = '546834648458723393'
const utils = require('../../utils/utils.json')

class Eval extends Command {

    constructor (client) {
        super(client, {
            name: "eval",
            description: `Execute le code.`,
            usage: "eval <code>",
            enabled: true,
            guildOnly: false,
            category: `${'<:owner:562954090347364353>'} • __Owner__`,
            aliases: [""],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            examples: "$eval message.channel.send('coucou')",
            owner: true
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        try {
            if(owner.includes(message.author.id)) {
                var users_data = this.client.databases[0];
                var servers_data = this.client.databases[1];
                var cooldowns_data = this.client.databases[2];
        
                if(message.content.includes('client.token') || message.content.includes('config.token')) return message.channel.send('```Js\nHum... the string may contains the discord bot token```'); 
                
                const content = message.content.split(' ').slice(1).join(' ');
                const result = new Promise((resolve, reject) => resolve(eval(content)));
                
                return result.then(output => {
                    if(typeof output !== 'string') output = require('util').inspect(output, { depth: 0 });
                    if(output.includes(this.client.token)) output = output.replace(this.client.token, 'T0K3N');
                    return message.channel.send(output, { code: 'js' });
                }).catch(err => {
                    err = err.toString();
                    if (err.includes(this.client.token)) err = err.replace(this.client.token, '`T0K3N`');
                    return message.channel.send(err, { code: 'js' })
                });
        } else {

            let erreurembed = new Discord.RichEmbed()
            .setTitle('Hep Hep Hep,')
            .setDescription(`<:crash:555758858186915850> || Seul le **créateur** de ${client.user.username} peut utilisez cette commande!`)
            .setColor(`RED`)
            .setFooter(`Dommage, ${message.author}`)
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

module.exports = Eval;
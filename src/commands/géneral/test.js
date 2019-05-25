const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let config = require('../../../config')
let moment = require('moment')
class Help extends Command {
    constructor (client) {
        super(client, {
            name: "test",
            description: 'Affiche l\'aide des commandes ou l\'aide d\'une commande en particulier',
            usage: "help (command)",
            enabled: true,
            guildOnly: false,
            category: '🔨 • __Général__',
            aliases: ["aide"],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            examples: "$help\n$help ping",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        if(!args[0]) {
            message.channel.send('Usage: N!emoji <:emoji: || nom de l\emoji>') 
        }
        let user = message.mentions.users.first() || message.author;
        let emjarg;
        if(args[0].startsWith('<:')) {
            emjarg = args[0].split(':').slice(-2)[0];
        } else {
            emjarg = args[0];
        }
        let emoji = message.guild.emojis.find(e => e.name  === `${args[0]}`) || message.guild.emojis.find(e => e.name === emjarg) || message.guild.emojis.get(args[0]);
        if(!emoji){
            message.channel.send('S\'il vous plaît spécifier un emoji valide.')
        }
    
        let emojian = emoji.animated;
        if(!emojian) {
            emojian = 'Non';
        } else {
            emojian = 'Oui';
        }
    
        const eembed = new Discord.RichEmbed()
            .setAuthor("Emoji Info", `https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Emoji_u1f64b.svg/768px-Emoji_u1f64b.svg.png`)
            .setDescription(`**● Nom** - \`${emoji.name}\`\n**● ID** - \`${emoji.id}\`\n**● Aperçu** - ${emoji}\n**● Animé** - \`${emojian}\`\n**● Lien** - [\`Téléchargement\`](${emoji.url})\n**● Ajouté le** - \`${moment.utc(emoji.createdAt).format("DD/MM/YYYY")} à ${moment.utc(emoji.createdAt).format("HH")}h${moment.utc(emoji.createdAt).format("mm")}\`\n**● Texte requi** - \`${emoji}\``)
            .setThumbnail(emoji.url)
            .setColor(message.guild.members.get(user.id).highestRole.color)
            .setFooter(`● ${message.guild.name} ●`)
            message.channel.send(eembed)
  }
}

module.exports = Help;
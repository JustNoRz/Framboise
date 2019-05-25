const Command = require("../../base/Command.js"),
Discord = require('discord.js');
const utils = require('../../utils/utils.json')

class Setdesc extends Command {

    constructor (client) {
        super(client, {
            name: "setdesc",
            description: `Changez la description qui apparaitra sur votre profil !`,
            usage: "setdesc <description>",
            category: `${utils.emotes.moneybag} • __Economie__`,
            enabled: true,
            guildOnly: false,
            aliases: ['setbio'],
            permission: false,
            botpermissions: [ "SEND_MESSAGES" ],
            nsfw: false,
            examples: "$setdesc Framboise la base",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        var bio = args.join(' '); // Gets the description 
        if(!bio) return message.channel.send(utils.emotes.no + ` | **Veuillez entrer une description valide !**`)
        if(bio.length > 100) return message.channel.send(utils.emotes.no + ` | **Votre description ne doit pas excéder les 100 caractères !**`)
        this.client.databases[0].set(`${message.author.id}.bio`, bio);

        message.channel.send(utils.emotes.yes + ` | Votre description vient d'être modifiée !`);
    }

}

module.exports = Setdesc;
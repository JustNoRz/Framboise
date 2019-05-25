const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let functions = require('../../utils/functions')
const utils = require('../../utils/utils.json')

class Work extends Command {

    constructor (client) {
        super(client, {
            name: "work",
            description: `Travaillez et gagnez de l'argent !`,
            usage: "work",
            enabled: true,
            guildOnly: true,
            category: `${utils.emotes.moneybag} • __Economie__`,
            aliases: [],
            permission: false,
            botpermissions: [ "SEND_MESSAGES", "EMBED_LINKS" ],
            nsfw: false,
            examples: "$work",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        
        var ms = require('ms');
        var cooldowns = this.client.databases[2];

        var isInCooldown = cooldowns.work.get(message.author.id);
        if(isInCooldown){
            if(isInCooldown > Date.now()) return message.channel.send(message.language.get('WORK_COOLDOWN', message.language.convertMs(isInCooldown - Date.now()))); 
        }

        var towait = Date.now() + ms('24h');
        cooldowns.work.set(message.author.id, towait);
        
        var phrases = [
            "Vous parvenez à trouver un travail chez l'épicerie. Vous gagnez ",
            "Vous devenez développeur de HoRaBoT, vous êtes payés ",
            "Vous parvenez facilement à trouver un travail : vous devenez boulanger. Vous gagnez ",
            "Vous livrez des journaux à votre quartier, vous gagnez ",
            "Vous devenez cuisinier au restaurant qui se trouve près de chez vous. Vous gagnez ",
            "Vous travaillez au graphisme d'un nouveau jeu qui vient de sortir. Vous gagnez ",
            "Vous montez une vidéo d'un très célèbre vidéaste. Vous gagnez ",
            "Vous devenez modérateur chez Discord. Votre salaire est de ",
            "Vous décidez par hasard de ramasser les déchets en ville. Un passant qui vous voit décide de vous remercier de garder la ville propre en vous donnant ",
            "Vous devenez caissier dans un magasin qui se trouve loin de chez vous. Vous êtes payés ",
            "Pour avoir été faire les courses, ta maman te passe ",
            "Grâce à tes petites affaires, tu gagnes ",
            "Après avoir eu un beau bulletin, ton père te donne ",
            "Tu travailles chez Carrefours et ton patron te paye comme salaire ",
            "Tu as réussi à vendre tous tes chocolats. La sommes totale de ta vente est de ",
            "Sur le trottoir, tu trouves ",
            "Tu as gagné le concour de la plus moche personne au monde, tu reçois ",
            "Après une petite promenade avec le chien de ta voisine, elle te donne "
        ];
        let resuslt = Math.floor((Math.random() * phrases.length));
        let usercredits = this.client.databases[0].get(`${message.author.id}.credits`)

    let to_add_credits = [];

    if(usercredits >= 10000){
      to_add_credits = functions.getRandomNum(2000, 7500)
    };
    if(usercredits <= 10000){
      to_add_credits = functions.getRandomNum(100, 2000)
    }

    var embed = new Discord.RichEmbed()
    .setAuthor('Salaire récupéré !')
    .setDescription(phrases[resuslt] + ` **${to_add_credits}** `+ utils.emotes.money1 + ' !')
    .setTimestamp()
    .setColor(data.embed.color)

        this.client.databases[0].add(`${message.author.id}.credits`, to_add_credits);

        message.channel.send(embed);

    }

}

module.exports = Work;
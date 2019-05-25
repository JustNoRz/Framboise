const Command = require("../../base/Command.js"),
Discord = require('discord.js');
const utils = require('../../utils/utils.json')
let shop_db = require('../../utils/shop/shop.js')
class Shop extends Command {
    constructor (client) {
        super(client, {
            name: "shop",
            description: `regarder, ou acheter des choses dans la boutique`,
            usage: "setdesc <description>",
            category: `${utils.emotes.moneybag} • __Economie__`,
            enabled: true,
            guildOnly: false,
            aliases: ['boutique'],
            permission: false,
            botpermissions: [ "SEND_MESSAGES" ],
            nsfw: false,
            examples: "$shop badge/avantages/avatar | $shop buy <nom de l'objet>",
            owner: false
        });
    }

    async run (message, args, membersdata, guild_data, data) {
        
        var author_badges = membersdata[0].badges;
        let shop_category = args[0]
        let valid_shop_category = [
            'badges',
            'avatar',
            'avantages'
        ]

        if(args[0] === 'buy'){
            var badge_name = args[1]
            var badge = null;
            for(var type in shop_db.badge){
                var tbadges = shop_db.badge;
                tbadges.forEach(gb => {
                    if(gb.name.toLowerCase() === badge_name) badge = gb;
                });
            }
            // if the badges is not found
            if(!badge) return message.channel.send(`${utils.emotes.no} | Aucun badge trouvé pour \`${args[1]}\``);
            // if the member has already the badge
            if(membersdata[0].badges.some(g => g.str === badge.str)) return message.channel.send(`${utils.emotes.no} | Vous possédez déjà ce badge !`);
            // if the member doesn't have enough credits
            if(membersdata[0].credits < badge.price) return message.channel.send(`${utils.emotes.no} | Vous n'avez pas assez de crédits pour acheter ce badge !`);
            // Updates databases
            var tbadges = [];
            membersdata[0].badges.forEach(b => tbadges.push(b));
            tbadges.push(badge);
            this.client.databases[0].set(`${message.author.id}.credits`, membersdata[0].credits - badge.price);
            this.client.databases[0].set(`${message.author.id}.badges`, tbadges);
            return message.channel.send(`${utils.emotes.yes} | Vous venez d'acheter le badge ${badge.name} (${badge.str}) pour ${badge.price} ${utils.emotes.money1} !`,);
            } else {
                
                if(args[0] === 'badges'){
                    let badges_shop_embed = new Discord.RichEmbed()
                    .setAuthor('Bienvenue sur la boutique de '+this.client.user.username+'. Tous nos articles sont affichés ci-dessous:')
                    .setTitle(`${utils.emotes.infos} **__Voici tous les articles de la categorie (\`Badges\`) __:**`)
                    .setFooter(`Pour acheter un badge faite : ${guild_data.prefix}shop buy <nom du badge> !`)
                    .setColor(data.embed.color)
                    .setTimestamp()
                    for(var type in shop_db.badge){
                        var str = '';
                        var tbadges = shop_db.badge;
                        tbadges.forEach(gb => {
                            if(!author_badges.some(g => g.str === gb.str)) str += `${gb.str} (** ${gb.price} ${utils.emotes.coins} **) - **${gb.name}**\n`;
                            else str += (`${gb.str} (** ${gb.price} ${utils.emotes.coins} **) - **${gb.name} (déjà acheté.)**\n`)
                        });
                        badges_shop_embed.setDescription(str.substr(0, str.length-0));
                    }    
                   return message.channel.send(badges_shop_embed)
                } //afficher badge shop

                if(args[0] === 'avantages'){  
                   return message.channel.send(utils.emotes.no + ' **Pas encore disponible...**')
                } //afficher shop des avantages

                if(args[0] === 'avatar'){  
                    return message.channel.send(utils.emotes.no + ' **Pas encore disponible...**')
                 } //afficher shop des avatar

        if(shop_category !== valid_shop_category){
            return message.channel.send(utils.emotes.no + ` | **Vous devez précisezune categorie valide.!** *(\`badges\`,\`avatar\`,\`avantages\`)*`)
            
        } //fin boucle error category
        
        } //fin boucle buy 
    
    } // boucle fin cmd
}

module.exports = Shop;
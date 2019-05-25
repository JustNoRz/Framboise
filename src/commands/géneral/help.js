const Command = require("../../base/Command.js"),
Discord = require('discord.js');
let config = require('../../../config')

class Help extends Command {
    constructor (client) {
        super(client, {
            name: "help",
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
        if(args[0]){

          let cmd = this.client.commands.get(args[0]) || this.client.commands.get(this.client.aliases.get(args[0]));
          if(!cmd) return message.channel.send((cmd) => ` | Commande ${cmd} introuvable !` , args[0]);
          var examples = cmd.help.examples.replace(/[$_]/g,guild_data.prefix);

          var group_embed = new Discord.RichEmbed()
          .setDescription(`<> = obligatoires et [] = optionnel`)
              .setAuthor(`${this.client.user.username}`, `${this.client.user.displayAvatarURL}`)
              .addField("• __Nom__ :", cmd.help.name , true)
              .addField("• __Utilisations__ :" , guild_data.prefix+cmd.help.usage , true)
              .addField("• __Exemple__ :", examples)
              .addBlankField()
              .addField("• __Categorie__ :" , cmd.help.category,true)
              .addField("• __Aliases__ :", cmd.conf.aliases.length > 0 ? cmd.conf.aliases.map(a => '`'+a+'`').join('\n') : 'Aucun alias.',true)
              .addField("• __Description__ :", cmd.help.description)
              .setColor(data.embed.color)
              .setFooter(data.embed.footer)

          if(cmd.conf.permission){
              group_embed.addField('Permissions :', `\`${cmd.conf.permission}\``);
          }
          if(!cmd.conf.enabled){
              group_embed.setDescription(`Cette commande est actuellement désactivée`);
          }
          if(cmd.conf.owner){
              group_embed.setDescription(`Seul le fondateur du bot peut effectuer cette commande !`);
          }
          return message.channel.send(group_embed);
      }
      var help_embed = new Discord.RichEmbed()
      .setAuthor('💻 • Listes des commandes disponibles :', commands_total)
          .setColor(data.embed.color)
          .setFooter(`${guild_data.prefix}help <commande> !`)
          .setThumbnail(`${this.client.user.displayAvatarURL}`)
          .setImage("https://media.discordapp.net/attachments/550309870465843201/575719348623245322/SPOILER_Banner-Framboise.png")
          .setTimestamp()

      var commands_total = 0;
      var categories = [];
      this.client.commands.forEach(cmd => {
          if(!categories.includes(cmd.help.category)){
              if(cmd.help.category === '<:owner:562954090347364353> • __Owner__' && message.author.id !== this.client.config.owner) return;
              categories.push(cmd.help.category); 
          }
      });
      this.client.commands.forEach(cmd => {
        if(!categories.includes(cmd.help.category)){
            if(cmd.help.category === '<:tools1:563776735435423774> • __Staff du bot__' && member_data.modo !== 'true') return;
            categories.push(cmd.help.category); 
        }
    });

      categories.forEach(cat => {
          var category = '';
          var pos = 0;
          var commands = this.client.commands.filter(cmd => cmd.help.category === cat);
          commands.forEach(cmd => {
              category += ' `'+cmd.help.name+'`';
              pos++
          });
          commands_total+=pos;
          help_embed.addField(cat+' - ('+pos+')', category.replace(/[' '_]/g,', ').substr(1));
      });
      message.channel.send(help_embed);
  }
}

module.exports = Help;
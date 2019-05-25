const Discord = require('discord.js')
let config = require('../../config')
const logo = require('asciiart-logo');

module.exports = class {

    constructor (client) {
        this.client = client;
    }

    async run () {       

        if(!this.client.databases[4].get('commands')) this.client.databases[4].set('commands', []);

        var games = [
            {
                name:`${this.client.user.username} | ${config.prefix}help`,
                type:`STREAMING`,
                url:`https://www.twitch.tv/framboise`
            },
            {
                name:`${this.client.users.size} utilisateurs ❤️`,
                type:`LISTEN`,
            },
            {
                name:`${this.client.guilds.size} serveurs❤️ `,
                type:`WATCHING`,
            }
        ];
        var client = this.client;
        var i = 0;
        setInterval(function(){
            client.user.setActivity(games[i].name, {type: games[i].type});
            if(games[parseInt(i + 1)]) i++;
            else i = 0;
        }, 20000);

        //Reday logo
        await new Promise((resolve) => setTimeout(resolve, 1000));
        await console.log(
          logo({
            name: `${this.client.user.username}`,
            font: 'Speed',
            lineChars: 15,
            padding: 5,
            margin: 2
          })
          .emptyLine()
          .right(`version ${require("../../package").version}`)
          .emptyLine()
          .wrap(`${client.user.username}#${client.user.discriminator}`)
          .render()
        );
        // Unmute members
        setInterval(function(){
            client.guilds.forEach(guild => {
                var data = client.databases[1].get(guild.id) || client.functions.createGuild(client, guild);
                if(Object.keys(data.muted) > 0){ 
                    for(var userID in data.muted){
                        var time = data.muted[userID];
                        var user = client.users.get(userID);
                        if(user && time < Date.now()){
                            // Unmute the member
                            guild.channels.forEach(ch => {
                                if(ch.permissionOverwrites.get(userID)) ch.permissionOverwrites.get(userID).delete()
                            });
                            delete data.muted[userID];
                            client.databases[1].set(`${guild.id}.muted`, data.muted);
                            if(guild.members.get(user.id)){
                                client.databases[1].add(`${guild.id}.case`, 1);
                                var tcase = client.databases[1].get(`${guild.id}.case`);
                                var modlogs = guild.channels.get(data.channels.modlogs);
                                if(!modlogs) return;
                                var modlog_embed = new Discord.RichEmbed()
                                    .setAuthor(language.get('MODLOGS_HEADERS', tcase)[5], user.avatarURL)
                                    .addField(language.get('MODLOGS_UTILS')[0], `\`${user.tag}\` (${user})`, true)
                                    .setColor(`#f44271`)
                                    .setTimestamp()
                                    .setFooter(client.config.embed.footer);
                                return modlogs.send(modlog_embed);
                            }
                        }
                    }
                }
            });
        }, 1000); // every second
    }
}  
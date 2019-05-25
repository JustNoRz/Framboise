// The MESSAGE event runs anytime a message is received
// Note that due to the binding of client to every event, every event
// goes `client, other, args` when this function is run.

var localDB = [];
var Discord = require("discord.js");

module.exports = class {
    constructor (client) {
        this.client = client;
    }

    async run (message) {

        // An array of client mention
        var clientMentions = [
            `<@${this.client.user.id}> `,
            `<@!${this.client.user.id}> `,
            `<@?${this.client.user.id}> `
        ];

        // If the messagr author is a bot
        if (message.author.bot) return;

        // If the member on a guild is invisible or not cached, fetch them.
        if (message.guild && !message.member) await message.guild.fetchMember(message.author.id);
        

        
        var ms = require('ms');

        var membersdata = this.client.functions.getUsersData(this.client, message);

        var data = { embed:{ color:this.client.config.embed.color, footer:this.client.config.embed.footer } };

        if(message.channel.type === 'dm'){
            var bl = this.client.databases[5].get(`users.${message.author.id}`)
            if(bl){
                return message.channel.send(message.language.get(`BLACKLIST_BANNED_USER`, bl))
            }

            const args = message.content.trim().split(/ +/g);
            const command = args.shift().toLowerCase();
            message.language = new(require('../languages/'+this.client.config.default_language+'.js'));
            let cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));
            if(!cmd) return message.channel.send(message.author.username+', aucune commande du nom `'+command+'`trouvé .');
            if ((cmd && cmd.conf.guildOnly) || (cmd && cmd.conf.permissions)) return message.channel.send("Cette commande est desactivée en mp , merci de l'utiliser sur un serveur utilisant le bot!.");
            if(cmd.conf.owner && message.author.id !== this.client.config.owner) return message.reply(`<:no:581413112519852049> | Seul \`• ɴ ᴏ ʀ ᴢ 🌙#4621\` peut effectuer ces commandes !`); 
            data.cmd = cmd;
            this.client.logger.log(`${message.author.username} (${message.author.id}) execute la commande ${cmd.help.name} en`, "cmd");
            return cmd.run(message, args, membersdata, {prefix:''}, data);
        }

        var guild_data = this.client.databases[1].get(message.guild.id) || this.client.functions.createGuild(this.client, message.guild);

        message.language = new(require('../languages/'+guild_data.lang+'.js'));

        /* SLOWMODE */

        if(!message.member.hasPermission('MANAGE_GUILD')){
            if(guild_data.slowmode[message.channel.id]){
                if(guild_data.userslowmode[`${message.channel.id}${message.author.id}`]){
                    var the_time = guild_data.userslowmode[`${message.channel.id}${message.author.id}`];
                    if(the_time > Date.now()){
                        message.delete();
                        var delai = message.language.convertMs(the_time - Date.now());
                        return message.author.send(message.language.get('SLOWMODE_PLEASE_WAIT', delai, message.channel));
                    }
                }
                this.client.databases[1].set(`${message.guild.id}.userslowmode.${message.channel.id}${message.author.id}`, Date.now() + guild_data.slowmode[message.channel.id]);
            }
        }
        const prefixMention = new RegExp(`^<@!?${this.client.user.id}>( |)$`);
        if(message.content.match(prefixMention)) return message.reply(message.language.get('PREFIX_INFO', guild_data.prefix));

        if(message.content === '@someone'){
            return this.client.commands.get('someone').run(message, null, membersdata, guild_data, data);
        }

        var validPrefixes = [
            guild_data.prefix,
            'framboise'
        ].concat(clientMentions);

        var prefix = null;
        validPrefixes.forEach(p => {
            if(message.content.startsWith(p)) prefix = p;
        });
        if(!prefix) return;
        
        const args = message.content.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();


        const cmd = this.client.commands.get(command) || this.client.commands.get(this.client.aliases.get(command));

        if(guild_data.commands[command]){
            return message.channel.send(guild_data.commands[command]);
        }

        if (!cmd) return;

        if(this.client.databases[5].get(`users.${message.author.id}`)){
            return message.channel.send(message.language.get(`BLACKLIST_BANNED_USER`, this.client.databases[5].get(`users.${message.author.id}`)))
        }

        var neededPermission = [];
        cmd.conf.botpermissions.forEach(perm => { if(!message.channel.permissionsFor(message.guild.me).has(perm)) neededPermission.push(perm); });
        if(neededPermission.length > 0) return message.channel.send(message.language.get('INHIBITOR_MISSING_BOT_PERMS', neededPermission.map(p => p).join(', ')));

        if(guild_data.ignored_channels.includes(message.channel.id)) return (message.delete()) && (message.author.send(message.language.get('CHANNEL_IGNORED', (message.channel))));
        if(cmd.conf.nsfw && !message.channel.nsfw) return message.channel.send(message.language.get('INHIBITOR_NSFW'))
        if(cmd.conf.permission){
            if(!message.member.hasPermission(cmd.conf.permission)) return message.channel.send(message.language.get('INHIBITOR_PERMISSIONS', cmd.conf.permission));
        }
        if(!cmd.conf.enabled) return message.channel.send(message.language.get('COMMAND_DISABLED'));
        if(cmd.conf.owner && message.author.id !== this.client.config.owner) return message.channel.send(message.language.get('OWNER_ONLY'));

        data.cmd = cmd;

        this.client.databases[4].push('commands', {
            date:Date.now(), 
            author:message.author.id, 
            data:{command:cmd.help.name,channel:{id:message.channel.id,name:message.channel.name},guild:{id:message.guild.id,name:message.guild.name}}
        });

        this.client.logger.log(`${message.author.username} (${message.author.id}) execute la commande ${cmd.help.name} sur ${message.guild.name} (${message.guild.id})`, "cmd");
        cmd.run(message, args, membersdata, guild_data, data);

    }
};
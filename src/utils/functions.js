const Discord = require('discord.js');

module.exports = {

    createGuild: function(client, guild){
        client.databases[1].set(guild.id, {
            id:guild.id, // The ID of the guild
            name:guild.name, // The name of the guild (when the bot is added)
            lang:"fr", // The language of the guild
            prefix:client.config.prefix, // the prefix of the guild
            commands:{}, // the guild's custom commands
            welcome:{ status:"disabled", message:"unknow", channel:"unknow" }, // Welcome messages plugin
            welcome_mp:{ status:"disabled", message:"unknow" }, // Welcome messages in DM plugin
            leave:{ status:"disabled", message:"unknow", channel:"unknow" }, // Goodbye messages plugin
            autorole:{ status:"disabled", role:"unknow" }, // Autorole plugin
            deleteinvite:{status:"disabled",channels:[]}, // Auto delete invites links
            ignored_channels:[], // The channels wich are ignored by the bot
            slowmode:{}, // An object like that : { "channelid":"slowmodetime", "channelid2", "slowmodetime2"}
            userslowmode:{}, // Used to store users data
            channels:{ modlogs: 'false', suggestion: 'false' }, // Used to store channels guild settings
            case: 0, // Used to store number of mod case
            muted: {} // This object is used to store muted member 
        });
        // Log in the console
        client.logger.log(`New server ${guild.name} - (${guild.id}) [${guild.memberCount} members]`, 'log');
        // return guild data object
        return client.databases[1].get(guild.id);
    },

    createUser: function(client, user){
        client.databases[0].set(user.id, {
            credits:50,
            rep:0,
            name:user.username,
            tag:user.discriminator,
            bio:"<:no:581413112519852049> | **Aucune description pour le moment!**", 
            badges:[],
            premium: 'false',
            modo: 'false',
            color:client.config.embed.color,
            stats:{ "commands":0, "findwords":{ "best-score":"unknow", "wins":0, }, "number":{ "best-score":"false", "wins":0, } }
        });
        // Log in the console
        console.log('\x1b[32m','[DB]','\x1b[0m', `New Utilisateur "${user.username}" enregistrer ! ID : "${user.id}"`);
        return client.databases[0].get(user.id);
    },

    getUsersData: function(client, message){
        var users_data = client.databases[0];
        var membersdata = [];
        var author_data = users_data.get(message.author.id) || client.functions.createUser(client, message.author);
        membersdata.push(author_data);

        if(message.mentions.members && message.mentions.members.size > 0){
            message.mentions.members.forEach(member => {
                var memberdata = users_data.get(member.id) || client.functions.createUser(client, member.user);
                membersdata.push(memberdata);
            });
        }

        return membersdata;
    },

    vote: async function(data, client){
        var user = await client.fetchUser(data.user);
        client.channels.get(client.config.votes.channel).send(`:arrow_up: **${user.tag}** \`(${user.id})\` vient de voter pour **${this.client.user.username}**, Merci !\nhttps://discordbots.org/bot//vote`);
        client.databases[0].add(`${data.user}.credits`, 30);
        user.send(`Bonjour ${user}, merci d'avoir voter pour ${this.client.user.username} !\nVôtre récompense : 50 crédits.`);
    },

    supportLink: async function(client){
        return new Promise(function(resolve, reject) {
            var guild = client.guilds.get(client.config.support.id);
            var channel = guild.channels.filter(ch => ch.type === 'text').first();
            if(channel){
                var options = {maxAge:0};
                channel.createInvite(options).then(i => {
                    resolve(i.url);
                });
            }
        });
    },
 
    sortByKey: function(array, key) {
        return array.sort(function(a, b) {
            var x = a[key]; var y = b[key];
            return ((x < y) ? 1 : ((x > y) ? -1 : 0));
        });
    },

    shuffle: function(pArray) {
        var array = [];
        pArray.forEach(element => array.push(element));
        var currentIndex = array.length, temporaryValue, randomIndex;
        while (0 !== currentIndex) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    },

    getRandomNum : function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },

    clearGuild: async function(guild) {
        guild.roles.forEach(r => r.delete().catch(O_o=>{}));
        guild.channels.forEach(c => c.delete().catch(O_o=>{}));
        guild.emojis.forEach(e => guild.deleteEmoji(e).catch(O_o=>{}));
        var bans = await guild.fetchBans();
        bans.forEach(u => guild.unban(u).catch(O_o=>{}));
        return true;
    }  
}
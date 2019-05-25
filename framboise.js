
// Load up the discord.js library
const { Client, Collection } = require("discord.js");
// We also load the rest of the things we need in this file:
const { promisify } = require("util"),
fs = require('fs'),
klaw = require("klaw"),
path = require("path"),
readdir = promisify(require("fs").readdir),
quickdb = require('quick.db');
quickdb.init('./data/Framboise.sqlite');

// Creates new class
class Framboise extends Client {

    constructor (options) {
        super(options);
        this.config = require("./config.js");
        this.commands = new Collection();
        this.aliases = new Collection();
        this.logger = require("./src/utils/logger.js");
        this.wait = require("util").promisify(setTimeout);
        this.functions = require('./src/utils/functions.js');
        this.databases = [ 
            new quickdb.table('users_data'),
            new quickdb.table('servers_data'),
            { 
                work: new quickdb.table('work'), 
                rep: new quickdb.table('rep'),
                xp: new quickdb.table('xp')
            },
            new quickdb.table('remindme'),
            new quickdb.table('stats'),
            new quickdb.table('blacklist')
        ],
        this.queues = new Collection()
    }

    loadCommand (commandPath, commandName) {
        try {
            const props = new (require(`${commandPath}${path.sep}${commandName}`))(this);
            client.logger.log(`Commande | ${props.help.name}. chargée !`);
            props.conf.location = commandPath;
            if (props.init) props.init(this);
            this.commands.set(props.help.name, props);
            props.conf.aliases.forEach(alias => {
                this.aliases.set(alias, props.help.name);
            });
            return false;
        } catch (e) {
            return `Impossible de chargé la commande: ${commandName}: ${e}`;
        }
    }
    
    async unloadCommand (commandPath, commandName) {
        let command;
        if (this.commands.has(commandName)) {
            command = this.commands.get(commandName);
        } else if (this.aliases.has(commandName)) command = this.commands.get(this.aliases.get(commandName));
        if (!command) return `The command \`${commandName}\` doesn"t seem to exist, nor is it an alias. Try again!`;
        if (command.shutdown) await command.shutdown(this);
        delete require.cache[require.resolve(`${commandPath}${path.sep}${commandName}.js`)];
        return false;
    }
}

// Creates new client
const client = new Framboise();

const init = async () => {

    // Search for all commands
    fs.readdir("./src/commands/", (err, content) => {
        if(err) console.log(err);
        var groups = [];
        content.forEach(element => {
            if(!element.includes('.')) groups.push(element);
        });
        groups.forEach(folder => {
            fs.readdir("./src/commands/"+folder, (e, files) => {
                let js_files = files.filter(f => f.split(".").pop() === "js");
                if(e) console.log(e);
                js_files.forEach(element => {
                    const response = client.loadCommand('./src/commands/'+folder, `${element}`);
                    if (response) client.logger.error(response);
                });
            });
        });
    });

    const evtFiles = await readdir("./src/events/");
    client.logger.log(`Loading a total of ${evtFiles.length} events.`, "log");
    evtFiles.forEach(file => {
        const eventName = file.split(".")[0];
        client.logger.log(`Loading Event: ${eventName}`);
        const event = new (require(`./src/events/${file}`))(client);
        client.on(eventName, (...args) => event.run(...args).catch(err => console.log(err)));
        delete require.cache[require.resolve(`./src/events/${file}`)];
    });

    client.login(client.config.token); 

};

init();

// if there are errors, log them
client.on("disconnect", () => client.logger.warn("Bot is disconnecting..."))
    .on("reconnecting", () => client.logger.log("Bot reconnecting...", "log"))
    .on("error", e => client.logger.error(e))
    .on("warn", info => client.logger.warn(info));

// if there is an unhandledRejection, log them
process.on("unhandledRejection", err => {
    console.error("Uncaught Promise Error: ", err);
});


// Gets vote webhook
const express = require('express');
const app = express();

var server = require('http').createServer(app);
server.listen(client.config.votes.port, () => console.log(`Framboise-Vote connecter sur le port: ${client.config.votes.port}!`));

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());       // to support JSON-encoded bodies

app.post('/votes', (req, res) => {
    console.log('[VOTES] Receiving a request...')
    if (req.headers.authorization !== client.config.votes.auth) {
        console.log('[VOTES] Rejected Post Request, Details Below\n', req.headers)
        res.status(401).send('Unauthorized');
    } else {
        console.log(`[VOTES] New vote post, user_id: ${req.body.user}, isWeekend: ${req.body.isWeekend}.`)
        client.functions.vote({user:req.body.user, isWeekend:req.body.isWeekend}, client);
        res.send('Sucess');
    }
});

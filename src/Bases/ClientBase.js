const { Client, GatewayIntentBits, Collection } = require('discord.js');
const loadCommands = require('../Handlers/LoadCommands')

class BaseClient extends Client
{
    constructor()
    {
        super({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.DirectMessages,
                
            ]
        })
        this.commands = new Collection()
    }
    
    start(token)
    {
        this.login(token)
        loadCommands(this)
    }

}

module.exports = BaseClient

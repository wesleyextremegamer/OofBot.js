require('dotenv').config({ path: ['./configs/KEYS.env', './configs/DEF.env'], quiet: true });
const path = require('path');
const fs = require('fs');
const Clientbase = require('./Bases/ClientBase.js');


class OofBot extends Clientbase
{
    constructor()
    {
        super();
        this.LoadListeners()
    }
    LoadListeners()
    {
        const eventsPath = path.join(__dirname, "Events")
        const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
    
        for (const file of eventFiles)
        {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath)

            if (event.once)
            {
                this.once(event.name, (...args) => event.execute(...args, this));
            }else{
                this.on(event.name, (...args) => event.execute(...args, this));
            }
        }
    }
}

const OofBot_CLI = new OofBot();
OofBot_CLI.start(process.env.DISCORD_ENV);

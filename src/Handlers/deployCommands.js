const { REST, Routes } = require('discord.js');
require('dotenv').config({path: ['./configs/KEYS.env', './configs/DEF.env'], quiet:true});
const fs = require('fs');
const path = require('path');
const recursiveSearching = require(path.join(__dirname, "../Modules/RecursiveSearching.js"));

module.exports = (commands) => { 
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);
    
    (async () => {
        try {
            await rest.put(
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commands}
    
            );
            if (process.env.DEBUG_MODE == 'TRUE')
            {
                console.log('✅ Commands registred successfully !');
            }
        } catch(error){
            console.error(error);
        }
    })();
}
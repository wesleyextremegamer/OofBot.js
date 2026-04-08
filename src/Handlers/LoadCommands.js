const fs = require('fs');
const path = require('path');
const deployCommands = require('./deployCommands.js');
const recursiveSearching = require(path.join(__dirname, "../Modules/RecursiveSearching.js"));

function Showlogs(logs)
{
    if (process.env.DEBUG_MODE === 'FALSE') return;

    for (const log of logs)
    {
        console.log(log)
    }
}
module.exports = (client) => {
    const client_commands = client.commands
    const commandsPath = path.join(__dirname, "../Commands");
    const commandFiles = recursiveSearching(commandsPath, '.js')

    const loadedCommands = [];
    let experimental = 0;
    let DebugMessages = [];

    for(const file of commandFiles)
    {
        try{
            const command = require(file)
            loadedCommands.push(command.data.toJSON());
            client_commands.set(command.data.name, command);  
            
            if (command.experimental && process.env.EXPERIMENTAL_COMMANDS === 'TRUE')
            {
                experimental++
            }else continue;

        }catch(error){
            DebugMessages.push(`\n---------------//----------------\n❌ Error while loading Commands from ${path.basename(file)}\n\n${error}\n----------------//----------------\n`);
        }
    }
    if (loadedCommands.length > 0)
    {
            if (experimental === 0) 
        {
            DebugMessages.push(`✅ ${loadedCommands.length} Client Commands Loaded ! `)
        }else if (experimental > 0)
        {
            DebugMessages.push(`✅ ${loadedCommands.length} Client Commands Loaded | ⚠️  Being ${experimental} of them Experimental !  `)
        }
    }
    
    if (loadedCommands.length === 0 )
    {
        DebugMessages.push('⚠️ 0 Client commands loaded (Not found or some internal error ocurred)')
        Showlogs(DebugMessages)
        return
    }else{
        Showlogs(DebugMessages)
        deployCommands(loadedCommands)  
    } 
}

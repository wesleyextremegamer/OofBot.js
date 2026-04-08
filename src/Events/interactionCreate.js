
const QueueManager = require('../Handlers/QueueManager.js')
const queue = new QueueManager();

module.exports = {
    name: 'interactionCreate',
    once: false,
    /** @param {import('discord.js').ChatInputCommandInteraction} interaction*/
    async execute(interaction)
    {
        if(interaction.isChatInputCommand())
        {
            const command = interaction.client.commands.get(interaction.commandName);
        
            if(!command)
            {
                console.error(`No valid ${interaction.commandName} command was found`);
                return;
            }
            try{
                queue.run(interaction, command)
            } catch(error){
                console.error(error);
                if(interaction.replied || interaction.deferred)
                {
                    await interaction.followUp({content:"A Error Ocorred while executing this command,\n try again later"});
                }else{
                    await interaction.reply({content: "An error occurred while executing this command, try again later"});
                }
            }
        }
    }
}
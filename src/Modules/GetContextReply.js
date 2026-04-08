/** @param {import('discord.js').ChatInputCommandInteraction} interaction */

module.exports = (interaction , IsFollowUp) => {
    if (interaction.replied || interaction.deferred)
    {
        if (IsFollowUp)
        {   
            return interaction.followUp.bind(interaction);
        }else{
            return interaction.editReply.bind(interaction);
        }

    }

    if (interaction.isButton())
    {
        return interaction.update.bind(interaction);
    }

    return interaction.reply.bind(interaction);
}
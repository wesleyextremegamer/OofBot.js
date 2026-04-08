module.exports = {
    name: 'messageCreate',
    once: false,
    /** @param {import('discord.js').Message} message */
    async execute(message)
    {
        if (message.author.bot) return;

        if (message.content === '&hello')
        {
            message.reply(`Hello, ${message.author.displayName} !`)
            await message.react()
        }
    }
}
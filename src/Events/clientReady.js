module.exports = {
    name: 'clientReady',
    once: true,
    /** @param {import('discord.js').Client} client */
    execute(client)
    {
        console.log(`🤖 Logged as ${client.user.tag} sucessfully`);
    }
}
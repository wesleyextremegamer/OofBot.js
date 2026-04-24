const DataMaster = require('#classes/DataMaster');

module.exports = {
	name: 'clientReady',
	once: true,
	/** @param {import('discord.js').Client} client */
	async execute(client) {
		console.log(`🤖 Logged as ${client.user.tag} sucessfully`);

		const guilds = client.guilds.cache;
		for (const [guildId, Guild] of guilds)
		{
			const members = await Guild.members.fetch();
			console.log(members.first().guild.name);
			await DataMaster.InsertGuild(guildId, members);
		}
	},
};
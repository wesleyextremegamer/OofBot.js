const GetContextReply = require('#modules/GetContextReply');

/** @param {import('discord.js').ChatInputCommandInteraction} interaction; */
module.exports = async (interaction) => {
	const command = interaction.client.commands.get(interaction.commandName);
	if (!command) {
		console.error(`No valid ${interaction.commandName} command was found in client`);
		return;
	}
	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);

		const Response = GetContextReply(interaction, true);
		await Response({ content : 'A Error Ocorred while executing this command,\n try again later' });
	}
};
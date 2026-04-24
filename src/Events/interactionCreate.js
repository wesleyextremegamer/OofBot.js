const ChatCommand_handler = require('#handlers/chatCommand_Handler');

module.exports = {
	name: 'interactionCreate',
	once: false,
	/** @param {import('discord.js').ChatInputCommandInteraction} interaction*/
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			await ChatCommand_handler(interaction);
		}
		else if (interaction.isMessageContextMenuCommand()) {
			return;
		}
		else {return;}

	},
};
const { ChannelType } = require('discord.js');
const dmMessage_Handler = require('#handlers/dmMessage_Handler');

module.exports = {
	name: 'messageCreate',
	once: false,
	/** @param {import('discord.js').Message} message */
	async execute(message) {
		if (message.author === message.client.user) return;

		if (message.channel.type === ChannelType.DM)
		{
			await dmMessage_Handler(message);
		}
	},
};
const { Client, GatewayIntentBits, Collection, Partials } = require('discord.js');
const commandsLoader = require('#src/Modules/commandsLoader');
const path = require('path');
const fs = require('fs');

class BaseClient extends Client {
	constructor() {
		super({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.DirectMessages,
				GatewayIntentBits.GuildPresences,
			],
			partials : [
				Partials.Message,
				Partials.Channel,
			],
		});
		this.commands = new Collection();
	}

	loadTasks(tasksPath)
	{
		const taskFiles = fs.readdirSync(tasksPath).filter(file => file.endsWith('.js'));

		for (const file of taskFiles)
		{
			const filePath = path.join(tasksPath, file);
			const task = require(filePath);

			try {
				task(this);
			} catch (err) {
				console.error(`Error loading task ${file}\n`, err);
			}
		}
	}
	loadListeners(listeanersPath) {
		const eventsPath = listeanersPath;
		const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

		for (const file of eventFiles) {
			const filePath = path.join(eventsPath, file);
			const event = require(filePath);

			if (event.once) {
				this.once(event.name, (...args) => event.execute(...args, this));
			}
			else {
				this.on(event.name, (...args) => event.execute(...args, this));
			}
		}
	}
	loadCommands(commandsPath) {
		commandsLoader(this, commandsPath);
	}
	start(token) {
		this.login(token);
	}

}

module.exports = BaseClient;

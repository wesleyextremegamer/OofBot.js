require('dotenv').config({ path: ['./Configs/env/KEYS.env', './Configs/env/DEF.env'], quiet: true });
const Clientbase = require('#src/Classes/constructors/ClientBase');
const { GetPathInCWD } = require('./Classes/FileManager');


class OofBot extends Clientbase {
	constructor() {
		super();
	}
	async start() {
		this.loadListeners(GetPathInCWD('/Events'));
		this.loadCommands(GetPathInCWD('/Commands/slashCommands'));
		this.loadTasks(GetPathInCWD('/Tasks'));
		await this.login(process.env.DISCORD_TOKEN);
	}
}

const OofBot_CLI = new OofBot();
OofBot_CLI.start(process.env.DISCORD_TOKEN);

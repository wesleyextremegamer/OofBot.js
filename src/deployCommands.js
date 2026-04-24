const { REST, Routes } = require('discord.js');
require('dotenv').config({ path: ['#configs/env/KEYS.env', '#configs/env/DEF.env'], quiet:true });

module.exports = (commands) => {
	const rest = new REST().setToken(process.env.DISCORD_TOKEN);

	(async () => {
		try {
			await rest.put(
				// Change to ApplicationCommands after.
				Routes.applicationGuildCommands(process.env.CLIENT_ID, '948344641391054870'),
				{ body: commands },

			);
			if (process.env.DEBUG_MODE == 'TRUE') {
				console.log('✅ Commands registred successfully !');
			}
		}
		catch (error) {
			console.error(error);
		}
	})();
};
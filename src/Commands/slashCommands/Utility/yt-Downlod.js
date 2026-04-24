const { spawn } = require('child_process');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');

const path = require('path');
const fs = require('fs');

const python3 = '#python3';
const ydlScript = '#scripts/yt-dlp.py';
const tempDownloads = '#temp/temp_downloads/';

module.exports = {
	experimental : true,
	data: new SlashCommandBuilder()
		.setName('yt-downloader')
		.setDescription('(Utility) - Downloads videos from youtube.')
		.addStringOption(Option =>
			Option.setName('url')
				.setDescription('The video Url')
				.setRequired(true),

		)
		.addStringOption(Option =>
			Option.setName('quality')
				.setDescription('Video quality')
				.addChoices([
					{ name: '240p', value: '240' },
					{ name: '360p', value: '360' },
					{ name: '720p', value: '720' },
					{ name: '1080p', value: '1080' },
				]),
		),


	/** @param {import('discord.js').ChatInputCommandInteraction} interaction */
	async execute(interaction) {
		const video_Url = interaction.options.getString('url');
		const quality = interaction.options.getString('quality');

		await interaction.deferReply();

		const process = spawn(python3, [ydlScript, video_Url, quality]);


		let videoFilename;
		let errorMessage;

		process.stdout.on('data', async (data) => {
			const output = data.toString().trim();
			console.log('[PYTHON LOG]:', output);

			if (output.includes('FILENAME:')) {
				videoFilename = output.split('FILENAME:')[1].trim();
			}
			else if (output.includes('ERROR:')) {
				errorMessage = output.split('ERROR:')[1].trim();
				console.log(errorMessage);
				if (errorMessage === 'FILE_SIZE_MAX_EXCEEDED') {
					await interaction.followUp('❌ **OoF !** -\n`I could not download this file cause its too large for me :(,\ntry to lower the quality and try again.`');
				}
			}
		});

		process.stdout.on('close', async () => {
			console.log('closed', videoFilename);
			if (videoFilename) {
				const fullPath = path.join(tempDownloads, videoFilename);

				if (fs.existsSync(fullPath)) {
					const videoAttachment = new AttachmentBuilder(fullPath, {
						name: videoFilename,
						description: `Youtube video downloaded by ${interaction.user.displayName}`,
					});

					await interaction.followUp({ files : [videoAttachment] });

					setTimeout(() => {
						fs.unlinkSync(fullPath);
					}, 5000);

				}
				else {
					await interaction.followUp({ content : '❌ **Oof** The video file was not found in the server.' });
				}
			}
			else if (!errorMessage) {
				await interaction.followUp({ content : '❌ **Oof** !\n`I couldnt Download this video because an error occured.` ' });
			}
		});
	},
};
const { SlashCommandBuilder, TextDisplayBuilder, MediaGalleryBuilder, ThumbnailBuilder, MediaGalleryItemBuilder, ContainerBuilder, MessageFlags, SectionBuilder, SeparatorBuilder, SeparatorSpacingSize, AttachmentBuilder } = require('discord.js');
const { GetPathInCWD } = require('#src/Classes/FileManager');
const Cache = require('#classes/Cache');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('roll-a-dice')
        .setDescription('(Fun !) Roll a dice, test your luck (or not) well.. have fun !')
        .addStringOption(Option =>
            Option.setName('question')
                .setDescription('Ask me for a advice, or something, i always give you the wrong answer.'),
        ),
    /** @param {import('discord.js').ChatInputCommandInteraction} Interaction  */
    async execute(Interaction)
    {
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        async function RollDice()
        {
            const mainContainer = new ContainerBuilder()
                .setAccentColor(0x00FF00)
                .addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('## Rolling the dice.. <:OOF:1332682754810450010>'),
                    new TextDisplayBuilder()
                        .setContent('### Lets see if you are lucky..'),
                )
                .addMediaGalleryComponents(
                    new MediaGalleryBuilder()
                        .addItems(
                            new MediaGalleryItemBuilder()
                                .setURL('https://cdn.dribbble.com/userupload/23060302/file/original-b8fc07986a14ae342f04e92d8f6d70ef.gif'),
                        ),
                );

            await Interaction.reply({ components : [mainContainer], flags : [MessageFlags.IsComponentsV2] });
        };
        async function SendResult()
        {
            const resultNumber = Math.floor(Math.random() * 6) + 1;

            const resultThemes = {
                1: 0xe53935,
                2: 0xf4511e,
                3: 0xfb8c00,
                4: 0xfdd835,
                5: 0x7cb342,
                6: 0x2e7d32,
            };
            const responses = {
                1: [
                    'No, thats not possible.',
                    'Never.',
                    'Only if you are born again.',
                    'Sorry to disappoint you, but no.',
                ],
                2: [
                    'What kind of question is that?',
                    'Maybe you need some fresh air.',
                    'I believe I can waste my time on more important things.',
                    'Please, get a life.',
                    "Well, I don't have anything to say about that, how about grapes?",
                ],
                3: [
                    "I don't think I understood what you mean...",
                    "Sometimes it's better to try again.",
                    'Your question is only surpassed in difficulty by living like a bot, just like me.',
                ],
                4: [
                    "Yes, you could... Oh no, I was mistaken, I thought it was another user, well, just try giving up, it's better :D",
                    'I think so, but you could try harder next time.',
                    "No, and please don't try that again.",
                    "On second thought, I think so, but that doesn't necessarily mean anything.",
                ],
                5: [
                    'Supposedly, that is, if you want to.',
                    'I think so',
                    'Even a monkey could ask a better question than that.',
                    'I have a question for you: who is that person behind you?',
                ],
                6: [
                    "Good to know, I'll share that with all the users :)",
                    "Roses are red, violets are blue, share this post with 10 people or I'll show up at your house at 12:00.",
                    'I would advise you to stop using Discord.',
                    'My prescription: 10 personal interactions per day.',
                    "I don't know, I'm not a doctor.",
                    "I can't reply, the Felca law blocked this message.",
                ],
            };

            const randResponse = responses[resultNumber][Math.floor(Math.random() * responses[resultNumber].length)];
            const cachedFallbackImg = await Cache.InsertFileToBufferIfNone('fallback_img.png', require.resolve(`#assets/Img/fallback_img.png`), 120000);
            const diceImgBuffers = await Cache.InsertFileToBufferIfNone(`dice_side_${resultNumber}.png`, GetPathInCWD(`Assets/Img/dice_side_${resultNumber}.png`));

            const diceImgAttachment = new AttachmentBuilder()
                .setFile(diceImgBuffers || cachedFallbackImg)
                .setName('dice_side.png');

            const mainContainer = new ContainerBuilder()
                .setAccentColor(resultThemes[resultNumber]);

            const mainSection = new SectionBuilder()
                    .addTextDisplayComponents(
                        new TextDisplayBuilder()
                            .setContent(`## <@${Interaction.user.id}> Rolled a dice`),

                        new TextDisplayBuilder()
                            .setContent(`### Here is the result : ${resultNumber}`),
                    )
                    .setThumbnailAccessory(
                        new ThumbnailBuilder()
                            .setURL(Interaction.user.avatarURL()),
                    );

            mainContainer.addSectionComponents(mainSection)
            .addMediaGalleryComponents(
                new MediaGalleryBuilder()
                    .addItems(
                        new MediaGalleryItemBuilder()
                            .setURL('attachment://dice_side.png'),
                    ),
            )
            .addSeparatorComponents(
                new SeparatorBuilder()
                    .setSpacing(SeparatorSpacingSize.Large),
            );
            const question = Interaction.options.getString('question');

            if (resultNumber === 6)
            {
                mainContainer.addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent('**Consider being an lucky guy !**'),
                );
            };
            if (question)
            {
                mainContainer.addTextDisplayComponents(
                    new TextDisplayBuilder()
                        .setContent(`**Your question >**  \`${question}\``),
                     new TextDisplayBuilder()
                        .setContent(`<:OOF:1332682754810450010> : \`${randResponse}\``),
                );
                // FUTURA ADIÇÃO;
                // if (true)
                // {
                //     if (true)
                //     {
                //         Interaction.client.guilds.cache.forEach(async guild => {
                //             const textChannels = guild.channels.cache.filter(channel => channel.isTextBased() && channel.isSendable());
                //             const FirstTextChannel = textChannels.first();

                //             await FirstTextChannel.send({ content: `Hey guys check it out !\n A guy in another server called ${Interaction.user.displayName}\nAsked me: \`${question}\`\nAnd I said: \` ${randResponse}\` \n Funny isn't ? ` });
                //         });
                //     }
                // }
            };

            await Interaction.editReply({ components: [mainContainer], files: [diceImgAttachment] });
        };

        await RollDice();
        await delay(2000);
        await SendResult();
    },
};
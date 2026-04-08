const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, Collector, ComponentType } = require('discord.js');
const { resolve } = require('dns');
const path = require('path')
const GetContextReply = require(path.join(__dirname, "../../Modules/GetContextReply.js"))

async function wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = {
    rateLimit : {
        cooldown : 5000,
        max_queue  : 5,
        scope: 'guild-user',
    },
    
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('responds with with great bot status info.'),
    /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
    async execute(interaction) {
        /** @param {import('discord.js').ChatInputCommandInteraction} interaction */
        async function SendMessage(interaction)
        {   
            function getLatencyStatus(from, latency)
            {   
                const status = {
                    'ws-none' : '🔵 - None `(Websocket latency was not ready, maybe refreshing can help...)`',
                    'ws-unstable' : '🟡 - Unstable `(A possible connection issue is causing slowness; integrations and internal events may be affected.)',
                    'rest-acceptable' : '🟡 - Acceptable `(More or less, Its not so slow, but its not like a big deal)`',
                    'rest-slow' : '⏳ - Slow `(There is some congestion in the API; interactions may be affected, causing delays in feedback.)`',
                    'rest-calculating' : '🕑 - Calculating... `(Wait, Work in progress !)`',
                    'rest-none': '⛔ - None `(Oof ! RestAPI latency was below 0, thats not so good by the way)`',
                    'all-stable' : '🟢 - Stable `(Everything is fast and responsive)`',
                    'not-sure' : '💀 - WHAT?! `(Well, you have 0 of latency,I consider you as discord data center intruder, or we have a problem.)`'

                }
                let restStatus;
                let wsStatus;

                 if (latency)
                {        
                    if(from == 'ws')
                    {
                        if (latency === 0)
                        {
                            wsStatus = status['not-sure'];
                        }else if (latency < 0)
                        {
                            wsStatus = status['ws-none'];
                        }else if (latency < 150)
                        {
                            wsStatus = status['all-stable']
                        }else{
                            wsStatus = status['ws-unstable']
                        }
                        
                    }else if(from == 'rest')
                    {
                        if (latency === 0)
                        {
                            restStatus = status['not-sure'];
                        }else if (latency < 300)
                        {
                            restStatus = status['rest-acceptable']
                        }else{
                            restStatus = status['rest-slow']
                        }
                    }
                
                }else{
                    if (from === 'ws') wsStatus = status['ws-none'];
                    if (from === 'rest')restStatus = status['rest-calculating']
                }
            
                return from === 'ws' ? wsStatus : from === 'rest' ? restStatus : undefined;
            }
            async function getWsPing()
            {
                let ping 
                for (let i = 0; i < 5; i++)
                {
                    ping = interaction.client.ws.ping
                    if (ping || ping >= 0)
                    {
                        return ping
                    }
                    await wait(50)
                }

                return undefined
            }
            async function getRestPing()
            {
                const startTick = Date.now();
                await interaction.user.fetch();
                const restPing = Date.now() - startTick;

                return restPing
            }

            async function UpdateWithRest()
            {
                pingEmbed.setDescription(`🏓 **PONG !**\n\n📶 **Up since:** ${upTime}\n📡 **Websocket Ping:** ${!wsPing || wsPing < 0 ? 'Not ready ❗' : wsPing + 'ms'}\n**RestAPI : **${restPing}ms\n\n**Ping status:**\n**Websocket: **${wsStatus}\n **RestAPI: **${restStatus} `);

                const refreshButton = new ButtonBuilder()
                    .setLabel('refresh')
                    .setCustomId('refresh-ping')
                    .setEmoji('🔁')
                    .setStyle(ButtonStyle.Primary)

                const row = new ActionRowBuilder()
                    .setComponents(
                        refreshButton
                    )

                const editedResponse = await GetContextReply(interaction, false)({embeds : [pingEmbed], components : [row]});
                const collector = editedResponse.createMessageComponentCollector({
                    componentType : ComponentType.Button,
                    time: 15000
                })
                collector.once('collect', async I => {
                    if (!I.user.id === interaction.user.id)
                    {
                        return I.reply({content: '❌ Oof !\n`You cant interact with this button, sorry man.`', ephemeral: true})
                    }

                    if (I.customId === 'refresh-ping')
                    {
                        SendMessage(I)
                    }
                })
                collector.once('end', () => {
                    console.log('')
                })
            }

            const upTime = `<t:${Math.floor(interaction.client.readyTimestamp / 1000)}:F>`;
            const wsPing = await getWsPing()
            let restPing;
     
            const wsStatus = getLatencyStatus('ws', wsPing)
            let restStatus = getLatencyStatus('rest', restPing);

            const pingEmbed = new EmbedBuilder()
            .setTitle('**Bot status**\n\n')
            .setDescription(`🏓 **PONG !**\n\n📶 **Up since:** ${upTime}\n📡 **Websocket Ping :** ${!wsPing || wsPing < 0 ? 'Not ready ❗' : wsPing + 'ms'} \n**RestAPI : **Calculating...\n\n**Ping status:**\n**Websocket: **${wsStatus}\n**RestAPI: **${restStatus} `)

            // RESPONDE COM AS INFORMAÇÕES INICIAIS
            await GetContextReply(interaction, false)({embeds : [pingEmbed]});    

            //ATUALIZAR COM O REST PING

            await wait(500)
            restPing = await getRestPing();
            restStatus = getLatencyStatus('rest', restPing);

            await UpdateWithRest();
        }  

        await SendMessage(interaction)
    }
}
           
            
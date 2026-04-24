const { ActivityType, PresenceUpdateStatus } = require('discord.js');
const StatusesName = {
    0 : 'Playing',
    1 : 'Streaming',
    2 : 'Listening',
    3 : 'Watching',
    4 : 'Custom',
    5: 'Competing',
};
const Statuses = [
    { name: 'Roblox', type: ActivityType.Playing },
    { name: 'Discord events', type : ActivityType.Listening },
    { name: 'You 👀', type: ActivityType.Watching },
    { name: 'Discord with Lorrita 👿', type: ActivityType.Competing },
    { name: 'Fighting against Discord guidelines', type: ActivityType.Custom },
    { name: 'Oof, by @Wenpire <:OOF:1332682754810450010>', type: ActivityType.Custom },
    { name: 'Slash commands', type: ActivityType.Listening },
    { name: 'Crazy ass rock', type: ActivityType.Listening },
];
let status_Queue = Statuses;

/** @param {import('discord.js').Client} client */
function UpdatePresence(client)
{
    if (status_Queue.length > 0)
    {
        status_Queue.pop();
    } else { status_Queue = [...Statuses].sort(() => Math.random() - 0.5); };


    const randStatus = status_Queue[Math.floor(Math.random() * status_Queue.length)];
    const statusName = StatusesName[randStatus.type];

    client.user.setPresence(
        {
            status: PresenceUpdateStatus.Online,
            activities : [
                randStatus,
            ],
        },
    );

    console.log(`❗ Changing bot status To : ${statusName} - ${randStatus.name}`);
};


module.exports = client => {
    client.once('clientReady', () => {
        UpdatePresence(client);
        setInterval(() => UpdatePresence(client), 615000);
    });
};

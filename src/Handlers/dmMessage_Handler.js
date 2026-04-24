const InteractedUsers = {};
const CooldownUsers = {};

/** @param { import('discord.js').User } user */
async function CheckIgnored(user, ignoringMessages)
{
    if (user.bot) return true;

    const coolDownTime = Math.floor(Math.random() * 120000);
    const Patience_limit = Math.floor(Math.random() * 30);
    const Msg = ignoringMessages[Math.floor(Math.random() * ignoringMessages.length)];
    if (CooldownUsers[user.id])
    {
        return true;
    }
    if (user.id in InteractedUsers)
    {
        const InteractedTimes = InteractedUsers[user.id];
        if (InteractedTimes >= Patience_limit)
        {
            CooldownUsers[user.id] = true;
            await user.send({ content: Msg });
            setTimeout(() => {
                InteractedUsers[user.id] = 0;
                CooldownUsers[user.id] = false;
            }, coolDownTime);

            return true;
        } else {
            InteractedUsers[user.id] += 1;
        }
    } else {
        InteractedUsers[user.id] = 0;
    }
    return false;
}

/** @param { import('discord.js').Message } message */
module.exports = async (message) => {
    const bot_Messages = {
        'compliments' : [
            `Hello, <@${message.author}>!`,
            'Hey, how is it going bro?',
            'Are you fine? :D',
        ],
        'not_interest' : [
            'whatever',
            '...',
            `If at least I had a way to block you ${message.author}...`,
            '-_-',
            '*Looking to the other way*',
        ],
        'busy' : [
            'Not now, im busy as you can see.',
            'huh? can you repeat? I was responding some messages guild messages.',
            'Can we talk later? Im playing with some losers rn..',
        ],
        'neutral' : [
            'Oh, ok',
            'fine.',
            'what?',
            'woah....',
            'eww',
            'alright.',
            'interesting.',
            'whats the point?',
            'not freaking way 0_0',
            'tell me more...',
            'potatos are cool',
            'I prefer watching tv',
            'I dont like it.',
            'thats kinda creepy.',
            'its time to touch grass dude...',
            'let me think... meh.',
            'nevermind',
        ],
        'positive' : [
            'yes',
            'yeah, I think..',
            'of course, but not for too long..',
        ],
        'negative' : [
            'no',
            'of course not, are you crazy?',
            'dude, just no.',
            'no way',
            'thats a no',
            'never',
            'not even a little bit',
        ],
        'ignoring': [
            'Im ignoring you btw',
            'heeey bye.',
            'no time for noobs, goodbye.',
            'want to see a magic trick?',
            'See you later.',
            'ok, dude, im out.',
            'im receving alot of messages right now, hold up for a minute.',
            'wait, some creeps are testing my rate limit, bastards !',

        ],
        'other_bot_interacted' : [
            `hey what the frick? You are supposed to interact with me ! no with ${message.author}`,
            "What do you think you're doing ?",
            'Oh lets see... Boring ass interaction, I could do better did you know?',
            'Stop using this bot here, you are runing my chat -_-',
            `Bro, what a shame, even my grandma could do better interactions ${message.author}`,
        ],
    };
    let randMessage;
    let randContextKey;
    if (message.author.id === message.client.user.id) return;

    if (await CheckIgnored(message.author, bot_Messages['ignoring'])) return;

    await message.channel.sendTyping();

    if (message.author.bot)
    {
        randMessage = bot_Messages['other_bot_interacted'][Math.floor(Math.random() * bot_Messages['other_bot_interacted'].length)];
        return await message.channel.send({ content: randMessage });
    }

    randContextKey = Object.keys(bot_Messages).slice(1, -3);
    randContextKey = randContextKey[Math.floor(Math.random() * randContextKey.length)];

    randMessage = bot_Messages[randContextKey][Math.floor(Math.random() * bot_Messages[randContextKey].length)];

    await message.reply({ content: randMessage });
};
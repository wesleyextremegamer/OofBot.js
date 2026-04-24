const DataMaster = require('../DataMaster');
const { GuildMember, Collection } = require('discord.js');
class GuildData extends DataMaster
{
    /** @param {Collection<string, GuildMember>} members */
    constructor(id, members)
    {
        super();

        this.id = id;
        this.members = members;
    }

    getMember(id)
    {
        return id;
    }
}
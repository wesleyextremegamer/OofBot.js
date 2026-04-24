const fs = require('fs/promises');
const { GetPathInCWD } = require('./FileManager');

// PROBLEMA : OS DEFAULTS ESTÃO SUBSTITUINDO OS VALORES JÁ EXISTENTES;

class DataMaster
{
    #dbJsonPath = GetPathInCWD('Configs/db.json');
    #cache = null;
    #saveBusy = false;
    #defaultConfigs = {
        guildDefaults : {
            globalfun : false,
        },
        memberDefaults : {
            oofcoins : 1,
            xp: 0,

        },
    };

    /** @param {String} guild_id  */
    async removeGuild(guild_id)
    {
        const Db = await this.#GetDB();
        if (!Db['guilds'][guild_id])
        {
            console.log('não encontrou guild id');
            return false;
        } else {
            delete Db['guilds'][guild_id];
            console.log('A guilda foi removida do cache');
            await this.#AddDataToCache(Db);
        }

    }
    /** @param {String} guild_id  */
    async getGuild(guild_id)
    {
        try {
            const Db = await this.#GetDB();

            if (!Db) return;

            const Guild = Db.guilds[guild_id];

            return Guild;
        } catch (error) {
            console.log('Error while Obtaining guild from DB : \n', error);
        }
    }
    async InsertGuild(guild_id, members)
    {
        try {
            const Db = await this.#GetDB();
            if (Db)
            {
                Db.guilds ??= {};

                 Db.guilds[guild_id] = {
                        ...this.#defaultConfigs.guildDefaults,
                        members : {},
                };
                for (const [MemberId, Member] of members)
                {

                    if (Member.user.bot) continue;
                    let MemberKey = Db.guilds[guild_id]['members'][MemberId];
                    Db.guilds[guild_id]['members'][MemberId] = { ...this.#defaultConfigs.memberDefaults, ...MemberKey };

                }
                return await this.#AddDataToCache(Db);
            }
        } catch (error) {
            console.error('Error while Inserting new Guild to Db : \n', error);
        }
    }
    async LoadJson(Path)
    {
        try {
            const rawData = await fs.readFile(Path, 'utf-8');
            const JsonData = JSON.parse(rawData);

            return JsonData;
        } catch (err) { throw new Error('Error while loading Json Data : ', err); };
    }
    async #GetDB()
    {
       this.#cache = this.#cache || await this.LoadJson(this.#dbJsonPath);
       return this.#cache;
    }
     #AddDataToCache(data)
    {
        this.#cache = { ...this.#cache, ...data };

        if (!this.#saveBusy)
        {
            this.#SaveCacheData();
            return;
        };

        console.log('Os dados adicionados ao cache serão escritos em breve');
        }
    async #SaveCacheData()
    {
        if (this.#saveBusy) return;

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
        const save = async () => {
             try {
                    await fs.writeFile(this.#dbJsonPath, JSON.stringify(this.#cache, null, 4));
                    console.log('Dados escritos com sucesso');

                } catch (err) {
                    console.log('Erro ao salvar dados no DB, Trying Again \n', err);
                    await this.#SaveCacheData(this.#cache);
                };
        };

        this.#saveBusy = true;

        await delay(5000)
            .then(async () => {
                await save()
                .then(() => this.#saveBusy = false);
            });
    }
}

module.exports = new DataMaster();
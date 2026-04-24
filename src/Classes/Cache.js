class Cache
{
    constructor(max_cache_size, expiration_ms)
    {
        this.CACHE_SIZE = max_cache_size;
        this.MAX_KEY_AGE = expiration_ms;
        this.cache = new Map();
    }
    #AddToCache(key, value, key_age, isfile = false)
    {
        if (!key || !value) return;

        if (this.cache.size >= this.CACHE_SIZE) {
            this.#RemoveOldestKeys();
        }

        if (isfile)
        {
              this.cache.set(key, { value : value, expire_at : Date.now() + this.MAX_KEY_AGE, isFile: isfile });
              return value[1];
        } else {
            this.cache.set(key, { value : value, expire_at : Date.now() + this.MAX_KEY_AGE });
            return value;
        }
    }
    async InsertFileToBufferIfNone(keyName, filePath, max_age)
    {
        const fs = require('fs/promises');
        const crypto = require('crypto');

        try {
            const fileBuffers = await fs.readFile(filePath);
            const hash = crypto.createHash('sha256')
            .update(fileBuffers)
            .digest('hex');

            if (this.#HasValue(hash))
            {
                return fileBuffers;
            };

            // Adds to the file buffer to the Cache
            return this.#AddToCache(keyName, [hash, fileBuffers], max_age, true);
        } catch (err) { console.log('Cache Error : \n', err); };
    }
    InsertIfNone(key, value, max_age)
    {
        if (this.#HasValue(value)) {
            return value;
        }
        // Adds to the file buffer to the Cache
        return this.#AddToCache(key, value, max_age | this.default_Age, false);
    }
    #HasValue(value)
    {
        // ESTE É O SAFADO
        const isItemCached = [...this.cache.values()].some(itemKey => {
            const condition = itemKey.isFile ? itemKey.value[0] === value : itemKey.value === value;
            if (condition) itemKey.expire_at = Date.now() + this.MAX_KEY_AGE;

            return condition;
        });
        if (isItemCached) return true;

        return false;
    }
    #RemoveOldestKeys()
    {
        const now = Date.now();

        // Clear the expired Cached Items
        for (const [k, v] of this.cache)
        {
            if (now > v.expire_at)
            {
                this.cache.delete(k);
            }
        }
        // If the Cache still full try another method (remove the Oldest Item)
        if (this.cache.size >= this.CACHE_SIZE)
        {
            const orderatedEntries = [...this.cache.entries()].sort((a, b) => a[1].expire_at - b[1].expire_at);
            this.cache.delete(orderatedEntries[0][0]);
        }

    }
}

module.exports = new Cache(3, 10000);
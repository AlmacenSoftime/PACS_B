import { caching } from 'cache-manager';

export class cacheWapper {
    private cache: any;

    constructor() {
        caching('memory', {
            max: 256,
            ttl: 7200000 /*2 hora en MS*/,
        }).then(cache => this.cache = cache);
    }

    public async get(key: string) {
        return this.cache.get(key);
    }

    public async set(key: string, value: any) {
        return this.cache.set(key, value);
    }
}

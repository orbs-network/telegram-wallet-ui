import { sleep } from './utils/sleep';

export class TTLCache {
  private SLEEP_INTERVAL = 10000;

  private cache = new Map<
    string,
    {
      value: any;
      expiresAt: number;
    }
  >();

  constructor() {
    (async () => {
      // eslint-disable-next-line no-constant-condition
      while (true) {
        this.cache.forEach((value, key) => {
          if (value.expiresAt < Date.now()) {
            this.cache.delete(key);
          }
        });
        await sleep(this.SLEEP_INTERVAL);
      }
    })();
  }

  execute = async (key: string, fn: () => Promise<any>, ttl: number) => {
    if (this.cache.has(key) && this.cache.get(key)!.expiresAt > Date.now()) {
      return this.cache.get(key)!.value;
    }

    const result = await fn();
    this.cache.set(key, {
      value: result,
      expiresAt: Date.now() + ttl,
    });
    return result;
  };
}

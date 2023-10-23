// TODO cleanup
export class TTLCache {
  cache = new Map<
    string,
    {
      result: any;
      expiresAt: number;
    }
  >();

  execute = async (key: string, fn: () => Promise<any>, ttl: number) => {
    if (this.cache.has(key) && this.cache.get(key)!.expiresAt > Date.now()) {
      return this.cache.get(key)!.result;
    }

    const result = await fn();
    this.cache.set(key, {
      result,
      expiresAt: Date.now() + ttl,
    });
    return result;
  };
}

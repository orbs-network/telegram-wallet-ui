export class LocalStorageProvider {
  private keyPrefix = '';

  setKeyPrefix(prefix: string) {
    this.keyPrefix = prefix;
  }

  private toKey(key: string) {
    return `${this.keyPrefix}:${key}`;
  }

  storeProp(key: string, property: string, value: any) {
    const currValue = this.read(key) as any;
    currValue[property] = value;
    this.storeObject(key, currValue);
  }
  storeObject<T>(key: string, object: T) {
    localStorage.setItem(this.toKey(key), JSON.stringify(object));
  }

  read<T>(key: string): T {
    return JSON.parse(localStorage.getItem(this.toKey(key)) ?? '{}');
  }

  readAll<T>(): Record<string, T> {
    return Object.fromEntries(this.keys().map((k) => [k, this.read<T>(k)]));
  }

  delete(key: string) {
    localStorage.removeItem(this.toKey(key));
  }

  clear() {
    for (const key of this.keys()) {
      this.delete(key);
    }
  }

  keys() {
    const keys = [];

    for (let i = 0; i < localStorage.length; i++) {
      if (localStorage.key(i)?.startsWith(this.keyPrefix + ':')) {
        keys.push(localStorage.key(i)!.replace(this.keyPrefix + ':', ''));
      }
    }

    return keys;
  }
}

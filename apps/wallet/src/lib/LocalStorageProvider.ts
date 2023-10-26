
export class LocalStorageProvider {
  private keyPrefix = '';

  setKeyPrefix(prefix: string) {
    this.keyPrefix = prefix;
  }

  private toKey(key: string) {
    return `${this.keyPrefix}:${key}`;
  }

  storeProp(key: string, property: string, value: any) {
    const currValue = this.read(key);
    currValue[property] = value;
    this.storeObject(key, currValue);
  }
  storeObject(key: string, object: any) {
    localStorage.setItem(this.toKey(key), JSON.stringify(object));
  }

  read(key: string): Record<string, any | undefined> {
    return JSON.parse(localStorage.getItem(this.toKey(key)) ?? '{}');
  }

  delete(key: string) {
    localStorage.removeItem(this.toKey(key));
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

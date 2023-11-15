import { IDBPDatabase, openDB } from 'idb';

export class KeyvalStore {
  dbPromise: Promise<IDBPDatabase<unknown>>;

  STORE_NAME = 'keyval';

  constructor(name: string) {
    const _storeName = this.STORE_NAME;
    this.dbPromise = openDB(name, 1, {
      upgrade(db) {
        db.createObjectStore(_storeName);
      },
    });
  }

  async get(key: string) {
    return (await this.dbPromise).get(this.STORE_NAME, key);
  }
  async set(key: string, val: any) {
    return (await this.dbPromise).put(this.STORE_NAME, val, key);
  }
  async setIfNotExists(key: string, val: any) {
    return (await this.dbPromise).add(this.STORE_NAME, val, key);
  }
  async del(key: string) {
    return (await this.dbPromise).delete(this.STORE_NAME, key);
  }
  async clear() {
    return (await this.dbPromise).clear(this.STORE_NAME);
  }
  async keys() {
    return (await this.dbPromise).getAllKeys(this.STORE_NAME);
  }
}

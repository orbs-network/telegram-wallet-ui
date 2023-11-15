import { Web3Account } from 'web3-eth-accounts';
import Web3 from 'web3';
import { getDebug } from './utils/debug';
import { KeyvalStore } from './KeyValStore';
const debug = getDebug('AccountProvider');

export class AccountProvider {
  account: Promise<Web3Account>;
  keyValStore: KeyvalStore;

  constructor(private web3: Web3) {
    this.keyValStore = new KeyvalStore('account');
    this.account = this.initializeAccount();
  }

  private async __backward__migrateIfNeeded() {
    const privateKey = localStorage.getItem('account');
    if (privateKey) {
      localStorage.setItem('account_migrated_localstorage_bck', privateKey);
      const anotherAccount = await this.keyValStore.get('account');

      // Really shouldn't happen
      if (anotherAccount) {
        localStorage.setItem('account_migrated_from_db_bck', anotherAccount);
        await this.keyValStore.del('account');
      }

      await this.keyValStore.setIfNotExists('account', privateKey);
      localStorage.removeItem('account');
    }
  }

  private async initializeAccount() {
    await this.__backward__migrateIfNeeded();
    let privateKey = await this.keyValStore.get('account');

    if (!privateKey) {
      privateKey = this.web3.eth.accounts.create().privateKey;
      await this.setAccount(privateKey);
    }
    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.add(account);

    debug('Account set to %s', account.address);
    return account;
  }

  async clearAccount() {
    await this.keyValStore.del('account');
  }

  async setAccount(privateKey: string) {
    await this.keyValStore.setIfNotExists('account', privateKey);
  }
}

// 0xd495299a71e08185828398f30395d338b718e0627a605ca28d0db3ba685280ec

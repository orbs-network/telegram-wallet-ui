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
      await this.keyValStore.setIfNotExists('account', privateKey);
      localStorage.removeItem('account');
    }
  }

  private async initializeAccount() {
    await this.__backward__migrateIfNeeded();
    const storedPrivateKey = await this.keyValStore.get('account');
    const account = await this.setAccount(
      storedPrivateKey ?? this.web3.eth.accounts.create().privateKey
    );
    return account;
  }

  async setAccount(privateKey: string, allowOverride = false) {
    if (allowOverride) {
      await this.keyValStore.set('account', privateKey);
    } else {
      await this.keyValStore.setIfNotExists('account', privateKey);
    }

    const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.add(account);

    debug('Account set to %s', account.address);
    debug(this.web3.eth.accounts.create().privateKey);

    return account;
  }
}

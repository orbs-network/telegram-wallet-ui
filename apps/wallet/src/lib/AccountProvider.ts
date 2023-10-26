import { Web3Account } from 'web3-eth-accounts';
import Web3 from 'web3';
import { getDebug } from './utils/debug';
const debug = getDebug('AccountProvider');

export class AccountProvider {
  account: Web3Account | null = null;

  constructor(private web3: Web3) {
    this.initializeAccount();
  }

  private initializeAccount(): void {
    try {
      this.setAccount(
        localStorage.getItem('account') ??
          this.web3.eth.accounts.create().privateKey
      );
    } catch (error) {
      debug('Error initializing the account: %s', error);
    }
  }

  setAccount(privateKey: string): void {
    this.account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
    this.web3.eth.accounts.wallet.clear();
    this.web3.eth.accounts.wallet.add(this.account);
    localStorage.setItem('account', privateKey);
    debug('Account set to %s', this.account.address);
    debug(this.web3.eth.accounts.create().privateKey);
  }
}

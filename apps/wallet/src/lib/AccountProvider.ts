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
      const storedPrivateKey = localStorage.getItem('account');

      if (storedPrivateKey) {
        this.account =
          this.web3.eth.accounts.privateKeyToAccount(storedPrivateKey);
        this.web3.eth.accounts.wallet.add(this.account);
        debug('Using stored account: %s', this.account.address);
      } else {
        // TODO: Account recovery, encrypted storage?
        const newAccount = this.web3.eth.accounts.create();
        localStorage.setItem('account', newAccount.privateKey);
        this.account = newAccount;
        this.web3.eth.accounts.wallet.add(this.account);
        debug('New account created: %s', newAccount.address);
      }
    } catch (error) {
      debug('Error initializing the account: %s', error);
    }
  }
}

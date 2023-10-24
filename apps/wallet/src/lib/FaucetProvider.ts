import { Web3Provider } from './Web3Provider';
import { web3Provider } from '../config';
import { AuthenticatedTelegramFetcher } from '../utils/fetcher';
import { getDebug } from './utils/debug';
import { sleep } from '@defi.org/web3-candies';
import promiseRetry from 'promise-retry';

const debug = getDebug('FaucetProvider');

export class FaucetProvider {
  private POLL_INTERVAL = 3000;
  private currentErc20TokenPolled: string | null = null;

  constructor(private faucetUrl: string, web3Provider: Web3Provider) {
    debug('done');
  }

  private async requestFromFaucet(erc20Token: string) {
    if (!web3Provider.account) throw new Error('No account');

    debug('Requesting from faucet');
    await AuthenticatedTelegramFetcher.post(`${this.faucetUrl}/topUp`, {
      toAddress: web3Provider.account.address,
      erc20Token,
    });
  }

  private async _requestIfNeeded(erc20Token: string) {
    if (!web3Provider.account) throw new Error('No account');

    this.currentErc20TokenPolled = erc20Token;

    debug(
      'Checking native balance for address %s',
      web3Provider.account.address
    );
    if (!(await web3Provider.balance()).isZero()) {
      debug('native balance is non-zero, skipping');
      return false;
    }

    debug(
      'Checking erc20 balance for address %s',
      web3Provider.account.address
    );

    while ((await web3Provider.balanceOf(erc20Token)).isZero()) {
      if (this.currentErc20TokenPolled !== erc20Token) {
        debug('erc20 token changed, skipping');
        return false;
      }
      debug('erc20 balance is zero, sleeping for %d ms', this.POLL_INTERVAL);
      await sleep(this.POLL_INTERVAL);
    }

    await this.requestFromFaucet(erc20Token);
    return true;
  }

  async requestIfNeeded(erc20Token: string) {
    return promiseRetry((retry, number) => {
      if (number > 0) debug('Attempt number %d', number);
      return this._requestIfNeeded(erc20Token).catch((e) => {
        debug('Error: %s', e.message);
        retry(e);
      });
    });
  }
}

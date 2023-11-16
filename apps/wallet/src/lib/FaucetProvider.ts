import { Web3Provider } from './Web3Provider';
import { AuthenticatedTelegramFetcher } from '../utils/fetcher';
import { getDebug } from './utils/debug';
import { sleep } from '@defi.org/web3-candies';
import promiseRetry from 'promise-retry';
import { DepositTransactionEvent, EventsProvider } from './EventsProvider';
import { getBalances } from '../hooks';

const debug = getDebug('FaucetProvider');

export class FaucetProvider {
  private POLL_INTERVAL = 3000;
  private isPolling = false;
  private KEY = 'faucet:proofErc20';

  constructor(
    private faucetUrl: string,
    private web3Provider: Web3Provider,
    private eventsProvider: EventsProvider
  ) {
    // Polls until the current selected erc20 was transferred to this account
    this.requestIfNeeded();
  }

  private async requestFromFaucet(erc20Token: string) {
    debug('Requesting from faucet');
    await AuthenticatedTelegramFetcher.post(`${this.faucetUrl}/topUp`, {
      toAddress: this.web3Provider.account.address,
      erc20Token,
    });
  }

  setProofErc20(erc20: string) {
    localStorage.setItem(this.KEY, erc20);
  }

  private async _requestIfNeeded() {
    if (this.isPolling) return;
    this.isPolling = true;

    debug(
      'Checking native balance for address %s',
      this.web3Provider.account.address
    );
    if (!(await this.web3Provider.balance()).isZero()) {
      debug('native balance is non-zero, skipping');
      return false;
    }

    debug(
      'Checking erc20 balance for address %s',
      this.web3Provider.account.address
    );

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const erc20Token = localStorage.getItem(this.KEY);

      if (erc20Token) {
        const balance = Object.values(await getBalances()).find(
          (t) => t.address === erc20Token
        )!.balanceBN;

        if (balance.isGreaterThan(0)) {
          if (
            !this.eventsProvider
              .events()
              .find(
                (e) =>
                  e.type === 'deposit' &&
                  (e as DepositTransactionEvent).token === erc20Token
              )
          ) {
            this.eventsProvider.deposit({
              token: erc20Token,
              amount: balance.toString(),
            });
          }

          debug('erc20 balance is non-zero, requesting from faucet');
          await this.requestFromFaucet(erc20Token);
          return true;
        } else {
          debug('erc20 balance is zero');
        }
      } else {
        debug('No erc20 token set, skipping');
      }

      debug('sleeping...');
      await sleep(this.POLL_INTERVAL);
    }

    // TODO maybe allow overriding the backend URL from the UI
  }

  async requestIfNeeded() {
    return promiseRetry((retry, number) => {
      if (number > 0) debug('Attempt number %d', number);
      return this._requestIfNeeded().catch((e) => {
        debug('Error: %s', e.message);
        this.isPolling = false;
        retry(e);
      });
    });
  }
}

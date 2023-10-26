import { LocalStorageProvider } from './LocalStorageProvider';
import { Web3Provider } from './Web3Provider';
import { getDebug } from './utils/debug';
import { sleep } from '@defi.org/web3-candies';
import promiseRetry from 'promise-retry';
const debug = getDebug('Permit2Provider');

export class Permit2Provider {
  private POLL_INTERVAL = 3000;
  private isPolling = false;

  constructor(
    private web3Provider: Web3Provider,
    private storage: LocalStorageProvider
  ) {
    this.storage.setKeyPrefix('permit2');
  }

  addErc20(erc20: string) {
    if (!this.isApproved(erc20)) {
      this.storage.storeProp(erc20, 'isApproved', false);
    }
  }

  isApproved(erc20: string) {
    return this.storage.read(erc20).isApproved;
  }

  erc20s() {
    return this.storage.keys();
  }

  private async _pollPermit2Approvals() {
    if (this.isPolling) return;
    this.isPolling = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!(await this.web3Provider.balance()).isZero()) {
        for (const erc20 of this.storage
          .keys()
          .filter((e) => !this.storage.read(e).isApproved)) {
          debug('Checking allowance for %s', erc20);

          const isApproved = (
            await this.web3Provider.getAllowanceFor(erc20)
          ).isGreaterThan(0);

          if (isApproved) {
            debug('Already approved, updating');
            this.storage.storeProp(erc20, 'isApproved', true);
          } else {
            const lastApprovalTxnTime =
              this.storage.read(erc20).lastApprovalTxnTime;
            if (
              lastApprovalTxnTime &&
              Date.now() - lastApprovalTxnTime < 3 * 60 * 1000
            ) {
              debug(
                'Not approved, but last approval was less than 3 minutes ago, skipping'
              );
              continue;
            } else {
              debug('Not approved, approving');
              const txnHash = await this.web3Provider.approvePermit2(erc20);
              this.storage.storeProp(erc20, 'lastApprovalTxnTime', Date.now());
              debug('Approved, txn hash: %s', txnHash);
            }
          }
        }
      } else {
        debug('Native balance is zero, skipping');
      }

      debug('Sleeping');
      await sleep(this.POLL_INTERVAL);
    }
  }

  async pollPermit2Approvals() {
    return promiseRetry((retry, number) => {
      if (number > 0) debug('Attempt number %d', number);
      return this._pollPermit2Approvals().catch((e) => {
        this.isPolling = false;
        debug('Error: %s', e.message);
        retry(e);
      });
    });
  }
}

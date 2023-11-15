import { LocalStorageProvider } from './LocalStorageProvider';
import { Web3Provider } from './Web3Provider';
import { getDebug } from './utils/debug';
import { sleep } from '@defi.org/web3-candies';
import promiseRetry from 'promise-retry';
const debug = getDebug('Permit2Provider');
export class Permit2Provider {
  private POLL_INTERVAL = 3000;
  private isPolling = false;

  approvalState: Record<string, boolean> = {};

  constructor(
    private web3Provider: Web3Provider,
    private storage: LocalStorageProvider
  ) {
    this.storage.setKeyPrefix('permit2');
    this.approvalState = Object.fromEntries(
      this.storage.keys().map((k) => [k, false])
    );
    // Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
    this.pollPermit2Approvals();
  }

  addErc20(erc20: string) {
    if (!this.isApproved(erc20)) {
      this.storage.storeValue(erc20, '');
      this.approvalState[erc20] = false;
    }
  }

  isApproved(erc20: string) {
    return this.approvalState[erc20] ?? false;
  }

  erc20s() {
    return Object.keys(this.approvalState);
  }

  private async _pollPermit2Approvals() {
    if (this.isPolling) return;
    this.isPolling = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      for (const erc20 of Object.keys(this.approvalState).filter(
        (e) => !this.approvalState[e]
      )) {
        debug('Checking allowance for %s', erc20);

        if (
          (await this.web3Provider.getPermit2AllowanceFor(erc20)).isGreaterThan(
            0
          )
        ) {
          debug('Already approved, updating');
          this.approvalState[erc20] = true;
        } else {
          debug('Not approved, approving');
          if ((await this.web3Provider.balance()).isZero()) {
            debug('native balance is zero, skipping');
            continue;
          }
          const txnHash = await this.web3Provider.approvePermit2(erc20);
          const isApproved = await this.web3Provider.waitForTransaction(
            txnHash
          );
          if (isApproved) {
            this.approvalState[erc20] = true;
            debug('Approved, txn hash: %s', txnHash);
          } else {
            debug('Approval failed, txn hash: %s', txnHash);
          }
        }
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

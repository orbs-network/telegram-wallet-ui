import { Web3Provider } from './Web3Provider';
import { getDebug } from './utils/debug';
import { sleep } from '@defi.org/web3-candies';
import { ERC20sDataProvider } from './ERC20sDataProvider';
const debug = getDebug('Permit2Provider');

export class Permit2Provider {
  private POLL_INTERVAL = 3000;
  private isPolling = false;

  constructor(
    private web3Provider: Web3Provider,
    private erc20sDataProvider: ERC20sDataProvider
  ) {}

  async pollPermit2Approvals() {
    if (this.isPolling) return;
    this.isPolling = true;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (!(await this.web3Provider.balance()).isZero()) {
        const erc20sData = this.erc20sDataProvider.readErc20sData();

        for (const erc20 of Object.keys(erc20sData).filter(
          (e) => !erc20sData[e].isApproved
        )) {
          debug('Checking allowance for %s', erc20);
          const isApproved = (
            await this.web3Provider.getAllowanceFor(erc20)
          ).isGreaterThan(0);

          if (isApproved) {
            debug('Already approved, updating');
            this.erc20sDataProvider.setApproved(erc20);
          } else {
            debug('Not approved, approving');
            await this.web3Provider.approvePermit2(erc20);
          }
        }
      } else {
        debug('Native balance is zero, skipping');
      }

      debug('Sleeping');
      await sleep(this.POLL_INTERVAL);
    }
  }
}

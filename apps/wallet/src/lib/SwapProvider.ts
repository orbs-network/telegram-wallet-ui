import { BNComparable, QuoteResponse } from '../types';
import { LiquihubProvider } from './LiquihubProvider';
import { CoinsProvider } from './CoinsProvider';
import { getDebug } from './utils/debug';
import BN from 'bignumber.js';
import { sleep } from './utils/sleep';
import { Permit2Provider } from './Permit2Provider';

const debug = getDebug('SwapProvider');

type QuoteRequest = {
  inToken: string;
  outToken: string;
  inAmount: BNComparable;
};

export class SwapProvider {
  SLEEP_INTERVAL = 3000;

  constructor(
    private coinsProvider: CoinsProvider,
    private liquidityHubProvider: LiquihubProvider,
    private permit2Provider: Permit2Provider
  ) {}

  async quote(quoteRequest: QuoteRequest) {
    // TODO cache
    const fetchCoins = await this.coinsProvider.fetchCoins();

    const minOutAmount = await this.coinsProvider.getMinAmountOut(
      fetchCoins.find((c) => c.address === quoteRequest.inToken)!,
      fetchCoins.find((c) => c.address === quoteRequest.outToken)!,
      quoteRequest.inAmount
    );

    const quoteResp = await this.liquidityHubProvider.quote({
      ...quoteRequest,
      outAmount: minOutAmount,
    });

    const isAboveMin = BN(quoteResp.outAmount).gte(minOutAmount);

    debug(
      `Got quote from LiquidityHub: ${
        quoteResp.outAmount
      }, min amount ${minOutAmount}, delta ${BN(quoteResp.outAmount).dividedBy(
        minOutAmount
      )} isAboveMin: ${isAboveMin} `
    );

    return {
      quote: quoteResp,
      isAboveMin,
    };
  }

  async swap(quote: QuoteResponse) {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.permit2Provider.isApproved(quote.inToken)) break;
      debug(`Token ${quote.inToken} is not approved, sleeping`);
      await sleep(this.SLEEP_INTERVAL);
    }

    await this.liquidityHubProvider.swap(quote);
  }
}

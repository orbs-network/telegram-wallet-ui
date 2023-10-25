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
    const fetchCoins = await this.coinsProvider.fetchCoins();

    const minOutAmount = await this.coinsProvider.getMinAmountOut(
      fetchCoins.find((c) => c.address === quoteRequest.inToken)!,
      fetchCoins.find((c) => c.address === quoteRequest.outToken)!,
      quoteRequest.inAmount
    );

    // TODO - what if this fails? (ui handling)
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

  /*
  TODO: discuss with Sukh and Tal - 
  this would be called by a background process (optimistic)

  1. what happens if the "pending txn" doesn't occur for X seconds?
  2. what happens if swap() fails? (perhaps show this as failed in transaction history, clickable, and then shows up-to-date quote to reapprove)
  3. do we deduct the amountIn from tradeable balance, so that the user doesn't try to swap using it while pending?
  4. do we plan to demo on Polygonscan as well or can we add a backup-path to trade "internally" for demo purposes?

  */
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
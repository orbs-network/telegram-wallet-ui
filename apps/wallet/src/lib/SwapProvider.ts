import { BNComparable, QuoteResponse } from '../types';
import { LiquihubProvider } from './LiquihubProvider';
import { CoinsProvider } from './CoinsProvider';

type Quote = {
  inToken: string;
  outToken: string;
  inAmount: BNComparable;
};

export class SwapProvider {
  constructor(
    private coinsProvider: CoinsProvider,
    private liquidityHubProvider: LiquihubProvider
  ) {}

  async quote(_quote: Quote) {
    // TODO cache
    const fetchCoins = await this.coinsProvider.fetchCoins();

    const price = await this.coinsProvider.getMinAmountOut(
      fetchCoins.find((c) => c.address === _quote.inToken)!,
      fetchCoins.find((c) => c.address === _quote.outToken)!,
      _quote.inAmount
    );

    return this.liquidityHubProvider.quote({ ..._quote, outAmount: price });
  }

  async swap(quote: QuoteResponse) {
    await this.liquidityHubProvider.swap(quote);
  }
}

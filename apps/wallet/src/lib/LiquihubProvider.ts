import { networks } from '@defi.org/web3-candies';
import type {
  LiquihubQuote,
  QuoteResponse,
  SwapError,
  SwapSuccesss,
} from '../types';
import { Web3Provider } from './Web3Provider';
import { Fetcher } from '../utils/fetcher';
import { getDebug } from './utils/debug';
const debug = getDebug('LiquihubProvider');

export class LiquihubProvider {
  BACKEND_URL = 'https://hub.orbs.network';
  CHAIN_ID = networks.poly.id;

  constructor(private web3Provider: Web3Provider) {}

  // TODO: better error handling
  async quote(request: LiquihubQuote, signal?: AbortSignal) {
    debug('Getting quote from LiquidityHub');
    const quote = await Fetcher.post<QuoteResponse>(
      `${this.BACKEND_URL}/quote?chainId=${this.CHAIN_ID}&partner=dwallet`,
      {
        ...request,
        user: this.web3Provider.account.address,
      },
      signal
    );

    if (!quote.permitData) {
      throw new Error('should have permitData');
    }

    debug('Got quote from LiquidityHub');

    return { ...request, ...quote };
  }

  async swap(quote: QuoteResponse): Promise<SwapSuccesss> {
    debug('Trying to swap on LiquidityHub');

    const signature = await this.web3Provider.sign(quote.permitData);

    const res = await Fetcher.post<SwapSuccesss | SwapError>(
      `${this.BACKEND_URL}/swapx?chainId=${this.CHAIN_ID}&partner=dwallet`,
      { ...quote, signature }
    );

    if ('error' in res) {
      throw new Error(res.error.error);
    }

    debug('Executed swap on LiquidityHub');
    return res;
  }
}

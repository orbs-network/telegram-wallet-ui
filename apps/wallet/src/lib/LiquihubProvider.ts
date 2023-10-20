import { networks } from '@defi.org/web3-candies';
import type {
  LiquihubQuote,
  QuoteResponse,
  SwapError,
  SwapSuccesss,
} from '../types';
import { Web3Provider } from './Web3Provider';
import { Fetcher } from '../utils/fetcher';
import { ERC20sDataProvider } from './ERC20sDataProvider';
import { sleep } from './utils/sleep';
import { getDebug } from './utils/debug';
const debug = getDebug('LiquihubProvider');

export class LiquihubProvider {
  BACKEND_URL = 'https://k5q195y9o9.execute-api.us-east-2.amazonaws.com';
  CHAIN_ID = networks.poly.id;
  SLEEP_INTERVAL = 3000;

  constructor(
    private web3Provider: Web3Provider,
    private erc20sDataProvider: ERC20sDataProvider
  ) {}

  // TODO: better error handling
  async quote(request: LiquihubQuote) {
    debug('Getting quote from LiquidityHub');
    const quote = await Fetcher.post<QuoteResponse>(
      `${this.BACKEND_URL}/quote?chainId=${this.CHAIN_ID}`,
      {
        ...request,
        user: this.web3Provider.account.address,
      }
    );

    if (!quote.permitData) {
      throw new Error('should have permitData');
    }

    debug('Got quote from LiquidityHub');

    return { ...request, ...quote };
  }

  async swap(quote: QuoteResponse): Promise<SwapSuccesss | SwapError> {
    debug('Trying to swap on LiquidityHub');
    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.erc20sDataProvider.isApproved(quote.inToken)) break;
      debug(`Token ${quote.inToken} is not approved, sleeping`);
      await sleep(this.SLEEP_INTERVAL);
    }

    const signature = await this.web3Provider.sign(quote.permitData);

    const res = await Fetcher.post<SwapSuccesss | SwapError>(
      `${this.BACKEND_URL}/swapx?chainId=${this.CHAIN_ID}`,
      { ...quote, signature }
    );

    debug('Executed swap on LiquidityHub');
    return res;
  }
}

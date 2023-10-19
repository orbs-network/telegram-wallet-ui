import { networks } from '@defi.org/web3-candies';
import type {
  LiquihubQuote,
  QuoteResponse,
  SwapError,
  SwapSuccesss,
} from '../types';
import { Web3Provider } from './Web3Provider';
import { Fetcher } from '../utils/fetcher';

export class LiquihubProvider {
  BACKEND_URL = 'https://k5q195y9o9.execute-api.us-east-2.amazonaws.com';
  CHAIN_ID = networks.poly.id;

  constructor(private web3Provider: Web3Provider) {}

  // TODO: better error handling
  async quote(request: LiquihubQuote) {
    if (!this.web3Provider.account) {
      throw new Error('LH quote: no account');
    }

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

    return { ...request, ...quote };
  }

  async swap(
    signature: LiquihubQuote & { signature: string }
  ): Promise<SwapSuccesss | SwapError> {
    const res = await Fetcher.post<SwapSuccesss | SwapError>(
      `${this.BACKEND_URL}/swapx?chainId=${this.CHAIN_ID}`,
      signature
    );
    return res;
  }
}

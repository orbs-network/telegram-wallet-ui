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

  async swap(quote: QuoteResponse): Promise<SwapSuccesss | SwapError> {
    const signature = await this.web3Provider.sign(quote.permitData);

    const res = await Fetcher.post<SwapSuccesss | SwapError>(
      `${this.BACKEND_URL}/swapx?chainId=${this.CHAIN_ID}`,
      { ...quote, signature }
    );
    return res;
  }
}

type SwapInput = {
  srcCoin: Token;
  dstCoin: Token;
  quantity: string;
  destinationAmount: BN;
  liqHubProvider: LiquihubProvider;
  web3Provider: Web3Provider;
};

export const handleSwap = async ({
  srcCoin,
  dstCoin,
  quantity,
  destinationAmount,
  liqHubProvider,
  web3Provider,
}: SwapInput): Promise<SwapSuccesss | undefined> => {
  console.log('Attempting swap...');

  let quote: QuoteResponse;

  try {
    quote = await liqHubProvider.quote({
      inAmount: amountBN(srcCoin, quantity),
      inToken: srcCoin?.address || '',
      outAmount: destinationAmount,
      outToken: dstCoin?.address || '',
    });
  } catch (error) {
    console.log(error);
    throw new Error('Failed to get quote');
  }

  console.log('Got quote', quote);

  const shouldProceed = confirm(
    `I can do ${amountUi(srcCoin, BN(quote.inAmount))} ${
      srcCoin.symbol
    } for ${amountUi(dstCoin, BN(quote.outAmount))} ${
      dstCoin.symbol
    }. Shall I proceed?`
  );

  if (!shouldProceed) {
    console.log('User did not accept quote');
    throw new UserCancelledError('User did not accept quote');
  }

  // let allowance = await web3Provider.getAllowanceFor(srcCoin.address);

  // if (allowance.lt(quote.inAmount)) {
  //   await web3Provider.approvePermit2(srcCoin.address);
  //   allowance = await web3Provider.getAllowanceFor(srcCoin.address);
  // }

  // const signature = await web3Provider.sign(quote.permitData);

  // const reqObj = {
  //   ...quote,
  //   signature,
  // };

  const swap = await liqHubProvider.swap(reqObj);

  if ('error' in swap) {
    console.error('Swap failed', swap.error);
    throw new SwapFailedError('Swap failed');
  }

  console.log('Swap successful. Transaction details: ', swap);

  return swap;
};

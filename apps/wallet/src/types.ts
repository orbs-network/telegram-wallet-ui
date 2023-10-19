import { CryptoAsset } from './config';
import type { TokenData as CandiesTokenData } from '@defi.org/web3-candies';
import type { PermitData } from '@uniswap/permit2-sdk/dist/domain';

import { Account } from 'web3-core';
import BN from 'bignumber.js';

export type BNComparable = BN | string | number;

export interface Token extends CandiesTokenData {
  coingeckoId: string;
  logoURI: string;
  name: string;
}

export type TokenData = {
  balance: string;
  permit2Approval: BN;
} & Token;

export type UserData = {
  account: Account;
  balance: BN;
  tokens: Record<string, TokenData>;
};

export type TokenListResponse = {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  chainId: number;
  logoURI: string;
  coingeckoId: string | null;
  listedIn: string[];
}[];

export interface QuoteResponse {
  inAmount: string;
  inToken: string;
  outAmount: string;
  outToken: string;
  user: string;
  exchange: string;
  to: string;
  data: string;
  permitData: PermitData;
  serializedOrder: string;
  raw: unknown;
  elapsed: number;
}

export type LiquihubQuote = {
  inToken: string;
  outToken: string;
  inAmount: BNComparable;
  outAmount: BNComparable;
};

export type SwapSuccesss = {
  txHash: string;
  gasPrice: {
    maxFeePerGas: string;
    maxPriorityFeePerGas: string;
  };
};

export type SwapError = {
  error: {
    error: string;
  };
};

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  address: string;
  telegramId: string;
};

export type TransactionDirection = 'incoming' | 'outgoing';

export type TransactionStatus = 'completed' | 'pending';

export type TransactionType = 'deposit' | 'withdrawal' | 'trade' | 'transfer';

export type Transaction = {
  id: string;
  amount: string;
  date: Date;
  from?: User;
  direction: TransactionDirection;
  to?: User;
  status: TransactionStatus;
  type: TransactionType;
  asset: CryptoAsset;
};

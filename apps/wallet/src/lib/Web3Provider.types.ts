import {
  NonPayableTransactionObject,
  PayableTransactionObject,
} from '@defi.org/web3-candies/dist/abi/types';

import BN from 'bignumber.js';

export interface SignAndSendParamsPayable<T = unknown> {
  txn: PayableTransactionObject<T>;
  to: string;
  value: BN;
}

export interface SignAndSendParamsNonPayable<T = unknown> {
  txn: NonPayableTransactionObject<T>;
  to: string;
  value?: never;
}

export type SignAndSendParams<T = unknown> =
  | SignAndSendParamsPayable<T>
  | SignAndSendParamsNonPayable<T>;

export type EstimateGasCostOptions = {
  buffer?: number;
  gasMode?: 'slow' | 'med' | 'fast';
};

export type EstimateGasCostResult = {
  gas: BN;
  cost: BN;
  maxFeePerGas: BN;
  maxPriorityFeePerGas: BN;
};

export type GetPastEventsOptions = {
  blocks?: { fromBlock: number; toBlock: number };
  filter?: Record<string, number | string>;
};

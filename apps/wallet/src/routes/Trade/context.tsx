import {
  useFormatNumber,
  useGetTokenFromList,
  useOptimizedGetMinAmountOut,
  useQuoteQuery,
  useBalances,
} from '../../hooks';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { StringParam, useQueryParam } from 'use-query-params';
import BN from 'bignumber.js';
import _ from 'lodash';
import { amountUi } from '../../utils/conversion';
import { usePersistedStore } from '../../store/persisted-store';
interface TradeContext {
  inAmount: string;
  setInAmount: (amount: string) => void;
  amountOut: string;
  quotePending: boolean;
  formattedAmount: string;
}

const context = createContext({} as TradeContext);

export const useTradeContext = () => useContext(context);

const useInitialTokens = () => {
  const { data, dataUpdatedAt } = useBalances();
  const [inTokenSymbol] = useQueryParam('inToken', StringParam);
  return useMemo(() => {
    if (!data) {
      return undefined;
    }
    const withoutInToken = _.filter(data, (it) => it.symbol !== inTokenSymbol);
    const tokensWithBalance = _.filter(withoutInToken, (it) =>
      new BN(it.balance).gt(0)
    );
    const sorted = _.sortBy(tokensWithBalance, (it) =>
      Number(it.balance)
    ).reverse();

    return {
      inToken: inTokenSymbol ?? sorted[0]?.symbol ?? 'usdt',
      outToken: inTokenSymbol === 'usdt' ? 'usdc' : 'usdt',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, inTokenSymbol]);
};

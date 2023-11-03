import {
  useFormatNumber,
  useGetTokenFromList,
  useOptimizedGetMinAmountOut,
  useQuoteQuery,
  useUserData,
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
import { TokenData } from '../../types';
interface TradeContext {
  inAmount: string;
  setInAmount: (amount: string) => void;
  amountOut: string;
  quotePending: boolean;
  formattedAmount: string;
  inToken: TokenData | undefined;
  outToken: TokenData | undefined;
  setInToken: (token?: string) => void;
  setOutToken: (token?: string) => void;
}

const context = createContext({} as TradeContext);

export const useTradeContext = () => useContext(context);

const useInitialTokens = () => {
  const { data, dataUpdatedAt } = useUserData();
  const [inTokenSymbol] = useQueryParam('inToken', StringParam);
  return useMemo(() => {
    if (!data) {
      return undefined
    }
      const withoutInToken = _.filter(
        data?.tokens,
        (it) => it.symbol !== inTokenSymbol
      );
    const tokensWithBalance = _.filter(withoutInToken, (it) =>
      new BN(it.balance).gt(0)
    );
    const sorted = _.sortBy(tokensWithBalance, (it) =>
      Number(it.balance)
    ).reverse();

    return {
      inToken: inTokenSymbol || sorted[0]?.symbol || 'usdt',
      outToken: sorted[1]?.symbol || 'usdc',
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, inTokenSymbol]);
};

export const TradeContextProvider = ({ children }: { children: ReactNode }) => {
  const [inAmount, setInAmount] = useState('');
  const initialTokens = useInitialTokens();
  const [inTokenSymbol, setInToken] = useState<string | undefined>('');
  const [outTokenSymbol, setOutToken] = useState<string | undefined>('');

  useEffect(() => {
    if (!inTokenSymbol) {
      setInToken(initialTokens?.inToken);
    }
    if (!outTokenSymbol) {
      setOutToken(initialTokens?.outToken);
    }
  }, [initialTokens, inTokenSymbol, outTokenSymbol]);

  const inToken = useGetTokenFromList(inTokenSymbol);
  const outToken = useGetTokenFromList(outTokenSymbol);

  const { estimatedAmountOut } = useOptimizedGetMinAmountOut(
    inToken,
    outToken,
    inAmount
  );
  const {
    data: quote,
    isLoading,
    isFetching,
  } = useQuoteQuery(inToken, outToken, inAmount);

  const quoteOutAmount = quote?.quote.outAmount;

  const amountOut = useMemo(() => {
    if (!quoteOutAmount) {
      return amountUi(outToken, estimatedAmountOut);
    }

    return amountUi(outToken, new BN(quoteOutAmount));
  }, [quoteOutAmount, outToken, estimatedAmountOut]);

  const formattedAmount = useFormatNumber({ value: amountOut });

  return (
    <context.Provider
      value={{
        inAmount: inAmount ? inAmount : '',
        setInAmount,
        amountOut: amountOut || '',
        quotePending: isLoading || isFetching,
        formattedAmount: formattedAmount || '',
        inToken,
        outToken,
        setInToken,
        setOutToken,
      }}
    >
      {children}
    </context.Provider>
  );
};

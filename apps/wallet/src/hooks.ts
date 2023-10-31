/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { erc20s, zeroAddress, networks, web3 } from '@defi.org/web3-candies';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  LiquihubQuote,
  QuoteResponse,
  Token,
  TokenData,
  TokenListResponse,
  UserData,
} from './types';
import { fetchLatestPrice } from './utils/fetchLatestPrice';
import BN from 'bignumber.js';
import {
  account,
  coinsProvider,
  permit2Provider,
  swapProvider,
  web3Provider,
} from './config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDebug } from './lib/utils/debug';
import { amountUi } from './utils/conversion';
import { matchRoutes, useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import _ from 'lodash';
import { useNumericFormat } from 'react-number-format';

export enum QueryKeys {
  FETCH_LAST_PRICE = 'useFetchLatestPrice',
  COINS_LIST = 'useCoinsList',
  USER_DATA = 'useUserData',
  PORTFOLIO_USD_VALUE = 'usePortfolioUsdValue',
  QUOTE = 'useQuote',
}

const debug = getDebug('hooks');

export const useFetchLatestPrice = (coin?: string) => {
  const { refetch: refetchPortfolioUsdValue } = usePortfolioUsdValue();
  const query = useQuery({
    queryKey: [QueryKeys.FETCH_LAST_PRICE, coin],
    queryFn: () => fetchLatestPrice(coin ?? ''),
    enabled: !!coin,
    refetchInterval: 10_000,
  });

  // we want to calculate the total portfolio value in USD, when price changes
  useEffect(() => {
    refetchPortfolioUsdValue();
  }, [query.dataUpdatedAt]);

  return query;
};

export const useMultiplyPriceByAmount = (
  coin?: string,
  _amount?: number | string
) => {
  const { data: price } = useFetchLatestPrice(coin);

  return useMemo(() => {
    if (!_amount || !price) return '0';

    const amount = new BN(_amount);

    return amount.multipliedBy(price).toString();
  }, [_amount, price]);
};

export const useExchangeRate = (
  inTokenSymbol?: string,
  dstTokenSymbol?: string
) => {
  const inToken = useGetTokenFromList(inTokenSymbol);
  const dstToken = useGetTokenFromList(dstTokenSymbol);

  const { data: inTokenPrice } = useFetchLatestPrice(inToken?.coingeckoId);
  const { data: dstTokenPrice } = useFetchLatestPrice(dstToken?.coingeckoId);

  return useMemo(() => {
    if (!inTokenPrice || !dstTokenPrice) return '';

    const inTokenPriceBN = new BN(inTokenPrice);
    const dstTokenPriceBN = new BN(dstTokenPrice);

    return inTokenPriceBN.dividedBy(dstTokenPriceBN).toString();
  }, [inTokenPrice, dstTokenPrice]);
};

export const useCoinsList = () => {
  return useQuery<Token[]>({
    queryKey: [QueryKeys.COINS_LIST],
    queryFn: async () => {
      return coinsProvider.fetchCoins();
    },
  });
};

export const useGetTokenFromList = (symbol?: string) => {
  const { data, dataUpdatedAt } = useUserData();

  return useMemo(
    () => _.find(data?.tokens, { symbol }),
    [dataUpdatedAt, symbol]
  );
};

export const useInterval = (callback: VoidFunction, delay: number | null) => {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
};

export const usePortfolioUsdValue = () => {
  const { data, dataUpdatedAt } = useUserData();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [QueryKeys.PORTFOLIO_USD_VALUE],
    queryFn: async () => {
      const values = queryClient
        .getQueriesData({
          queryKey: [QueryKeys.FETCH_LAST_PRICE],
        })
        .map((it) => {
          const coingeckoId = it[0][1] as string;
          return {
            coingeckoId,
            price: (it[1] as number) || 0,
          };
        });

      const tokenWithBalance = Object.values(data?.tokens ?? {}).filter(
        (it) => !new BN(it.balance).isZero()
      );
      const dictionary = _.keyBy(values, 'coingeckoId');

      // checking if all tokens usd values are fetched
      // if not - return 0
      const isAllTokensFetched = _.every(tokenWithBalance, (token) => {
        const value = dictionary[token.coingeckoId]?.price;
        return !!value;
      });

      if (!isAllTokensFetched) {
        return '0';
      }
      return tokenWithBalance
        .reduce((acc, token) => {
          const price = dictionary[token.coingeckoId]?.price || 0;
          const amount = new BN(token.balance).multipliedBy(price);
          return acc.plus(amount);
        }, new BN(0))
        .toString();
    },
    enabled: !!data,
  });

  useEffect(() => {
    query.refetch();
  }, [dataUpdatedAt]);

  return query;
};

export const useUserData = () => {
  const { data: coins = [] } = useCoinsList();
  return useQuery({
    queryKey: [QueryKeys.USER_DATA],
    enabled: coins.length > 0,
    refetchInterval: 20_000,
    queryFn: async () => {
      try {
        if (!account) throw new Error('updateBalances: No account');

        console.log('Refreshing balances...');

        const _userData: UserData = {
          account,
          tokens: {},
        };

        if (coins.length === 0) return _userData;

        const balances = await web3Provider.balancesOf(
          coins.map((c) => c.address)
        );

        coins.forEach((token, index) => {
          _userData.tokens[token.symbol] = {
            ...token,
            symbol: token.symbol.toLowerCase(),
            balanceBN: balances[token.address],
            balance: amountUi(token, balances[token.address]) || '0',
          };
        });

        debug(_userData);
        return _userData;
      } catch (e) {
        debug(e);
        // console.error(e);
      }
    },
  });
};

export const useFormatNumber = ({
  value,
  decimalScale = 3,
  prefix,
  suffix,
}: {
  value?: string | number;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator: ',',
    displayType: 'text',
    value: value || '',
    decimalScale,
    prefix,
    suffix,
  });

  return result.value?.toString();
};

const MAP_ROUTES = _.map(ROUTES, (value, key) => {
  return {
    path: value,
  };
});

export const useCurrentPath = () => {
  const location = useLocation();
  const result = matchRoutes(MAP_ROUTES, location);
  if (!result) {
    return '';
  }
  return result[0].route.path;
};

export const useDebounce = (value: string, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState('');
  const timerRef = useRef<any>();

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebouncedValue(value), delay);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useDebouncedCallback = (func: () => void, wait = 300) => {
  const timeout = useRef<any>();

  return useCallback(() => {
    const later = () => {
      clearTimeout(timeout.current);
      func();
    };

    clearTimeout(timeout.current);
    timeout.current = setTimeout(later, wait);
  }, [func, wait]);
};

export const useOptimizedGetMinAmountOut = (
  inToken?: TokenData,
  outToken?: TokenData,
  inAmount?: string
) => {
  const { data: srcTokenUsd } = useFetchLatestPrice(inToken?.coingeckoId);
  const { data: destTokenUsd } = useFetchLatestPrice(outToken?.coingeckoId);

  const getEstimatedAmountOut = useCallback(() => {
    if (!inToken || !outToken || !inAmount || !srcTokenUsd || !destTokenUsd) {
      return new BN(0);
    }
    return coinsProvider.OptimizedGetMinAmountOut(
      inToken,
      outToken,
      srcTokenUsd,
      destTokenUsd,
      coinsProvider.toRawAmount(inToken, inAmount)
    );
  }, [destTokenUsd, inAmount, inToken, outToken, srcTokenUsd]);

  const estimatedAmountOut = useMemo(getEstimatedAmountOut, [
    getEstimatedAmountOut,
  ]);

  return {
    estimatedAmountOut,
    getEstimatedAmountOut,
  };
};

export const useQuoteQuery = (
  inToken?: TokenData,
  outToken?: TokenData,
  inAmount?: string
) => {
  const { estimatedAmountOut } = useOptimizedGetMinAmountOut(
    inToken,
    outToken,
    inAmount
  );
  return useQuery({
    queryKey: [QueryKeys.QUOTE, inToken?.symbol, outToken?.symbol, inAmount],
    queryFn: async ({ signal }) => {
      return swapProvider.optimizedQuote(
        {
          inAmount: coinsProvider.toRawAmount(inToken!, inAmount!),
          inToken: inToken!,
          outToken: outToken!,
          minOutAmount: estimatedAmountOut,
        },
        signal
      );
    },
    enabled: !!inToken && !!outToken && !!inAmount && estimatedAmountOut.gt(0),
  });
};

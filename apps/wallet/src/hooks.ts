/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Token, TokenData, UserData } from './types';
import { fetchLatestPrices } from './utils/fetchLatestPrice';
import BN from 'bignumber.js';
import { account, coinsProvider, swapProvider, web3Provider } from './config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDebug } from './lib/utils/debug';
import { amountUi } from './utils/conversion';
import { matchRoutes, useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import _ from 'lodash';
import { useNumericFormat } from 'react-number-format';
import { create } from 'zustand';
import Twa from '@twa-dev/sdk';
import { queryClient } from './App';

export enum QueryKeys {
  FETCH_LAST_PRICE = 'useFetchLatestPrice',
  COIN_LAST_PRICE = 'useCoinsLastPrice',
  COINS_LIST = 'useCoinsList',
  USER_DATA = 'useUserData',
  PORTFOLIO_USD_VALUE = 'usePortfolioUsdValue',
  QUOTE = 'useQuote',
}

const debug = getDebug('hooks');

export const useCoinsLastPrice = () => {
  const { data } = useCoinsList();

  return useQuery({
    queryKey: [QueryKeys.COIN_LAST_PRICE],
    queryFn: async () => {
      const ids = _.map(data, 'coingeckoId').join(',');
      return fetchLatestPrices(ids);
    },
    enabled: !!data,
    refetchInterval: 10_000,
    staleTime: 5_000,
  });
};

export const useFetchLatestPrice = (coin: string) => {
  const { data: coinsPrice } = useCoinsLastPrice();

  return coinsPrice?.[coin];
};

export const useMultiplyPriceByAmount = (
  coin: string,
  _amount?: number | string
) => {
  const price = useFetchLatestPrice(coin);

  return useMemo(() => {
    if (_amount === undefined || price === undefined) return '-';

    const amount = new BN(_amount);

    console.log(price, coin);

    return amount.multipliedBy(price).toString();
  }, [_amount, price]);
};

export const useExchangeRate = (
  inTokenSymbol?: string,
  dstTokenSymbol?: string
) => {
  const inToken = useGetTokenFromList(inTokenSymbol);
  const dstToken = useGetTokenFromList(dstTokenSymbol);

  const inTokenPrice = useFetchLatestPrice(inToken?.coingeckoId);
  const dstTokenPrice = useFetchLatestPrice(dstToken?.coingeckoId);

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
  const { data, dataUpdatedAt: userDataUpdatedAt, error } = useUserData();
  const { data: usdPrices, dataUpdatedAt: coinsDataUpdatedAt } =
    useCoinsLastPrice();

  return useMemo(() => {
    if (error) {
      return { error };
    }

    if (!data || !usdPrices) {
      return { data: null };
    }

    const getPrice = (coingeckoId: string) =>
      usdPrices![coingeckoId as keyof typeof usdPrices];

    const tokenWithBalance = Object.values(data?.tokens ?? {}).filter(
      (it) => !new BN(it.balance).isZero()
    );

    return {
      data: tokenWithBalance
        .reduce((acc, token) => {
          const price = getPrice(token.coingeckoId);
          const amount = new BN(token.balance).multipliedBy(price);
          return acc.plus(amount);
        }, new BN(0))
        .toString(),
    };
  }, [userDataUpdatedAt, coinsDataUpdatedAt]);
};

export const getBalances = async () => {
  const coins = await coinsProvider.fetchCoins();
  return (
    (
      await queryClient.fetchQuery({
        queryKey: [QueryKeys.USER_DATA],
        queryFn: () => updateCoinBalances(coins),
      })
    )?.tokens ?? {}
  );
};

const updateCoinBalances = async (coins: any[]) => {
  try {
    console.log('Refreshing balances...');

    const _userData: UserData = {
      account,
      tokens: {},
    };

    if (coins.length === 0) return _userData;

    const balances = await web3Provider.balancesOf(coins.map((c) => c.address));

    coins.forEach((token) => {
      if (token.symbol.toUpperCase() === 'MATIC') {
        return;
      }

      let name = token.name
        .split(' ')
        .filter((word: string) => word !== 'Wrapped')
        .join(' ');

      if (name === 'WETH') {
        name = 'Ethereum';
      }

      _userData.tokens[token.symbol] = {
        ...token,
        name,
        symbolDisplay:
          token.symbol.toUpperCase().charAt(0) === 'W'
            ? token.symbol.toUpperCase().slice(1)
            : token.symbol.toUpperCase(),
        symbol: token.symbol.toLowerCase(),
        balanceBN: balances[token.address],
        balance: amountUi(token, balances[token.address]) || '0',
      };
    });

    return _userData;
  } catch (e) {
    debug(e);
    // console.error(e);
  }
};

export const useUserData = () => {
  const { data: coins = [] } = useCoinsList();
  return useQuery({
    queryKey: [QueryKeys.USER_DATA],
    enabled: coins.length > 0,
    refetchInterval: 10_000,
    queryFn: () => updateCoinBalances(coins),
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
  const decimals = useMemo(() => {
    if (!value) return 0;
    const [, decimal] = value.toString().split('.');
    if (!decimal) return 0;
    const arr = decimal.split('');
    let count = 0;

    arr.forEach((item) => {
      if (item === '0') {
        count++;
      } else {
        return;
      }
    });

    return count - 1 + decimalScale;
  }, [value, decimalScale]);

  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator: ',',
    displayType: 'text',
    value: value || '',
    decimalScale: decimals,
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
  const srcTokenUsd = useFetchLatestPrice(inToken?.coingeckoId);
  const destTokenUsd = useFetchLatestPrice(outToken?.coingeckoId);

  const getEstimatedAmountOut = useCallback(() => {
    if (!inToken || !outToken || !inAmount || !srcTokenUsd || !destTokenUsd) {
      return new BN(0);
    }
    return coinsProvider.getMinAmountOut(
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

export const useSwapInProgress = create<any>((set: any) => ({
  inProgress: false,
  setProgress(value: boolean) {
    set({ inProgress: value });
  },
}));

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

  const { inProgress: isSwapInProgress } = useSwapInProgress();
  const client = useQueryClient();

  const queryKey = [
    QueryKeys.QUOTE,
    inToken?.symbol,
    outToken?.symbol,
    inAmount,
  ];

  if (isSwapInProgress) {
    client.cancelQueries({ queryKey: queryKey });
  }

  return useQuery({
    queryKey: queryKey,
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
    enabled:
      !!inToken &&
      !!outToken &&
      !!inAmount &&
      estimatedAmountOut.gt(0) &&
      !isSwapInProgress,
    refetchInterval: 10_000,
    staleTime: 10_000,
  });
};

export function useWebApp() {
  const [resized, setResized] = useState(false);
  const [height, setHeight] = useState(window.innerHeight);
  useEffect(() => {
    const onChange = () => {
      setResized(Twa.isExpanded);
      setHeight(Twa.viewportHeight);
    };
    Twa.onEvent('viewportChanged', onChange);

    return () => {
      Twa.offEvent('viewportChanged', onChange);
    };
  }, []);

  return { isExpanded: resized, height };
}

const getOnLineStatus = () =>
  typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean'
    ? navigator.onLine
    : true;

export const useNavigatorOnLine = () => {
  const [status, setStatus] = useState(getOnLineStatus());

  const setOnline = () => setStatus(true);
  const setOffline = () => setStatus(false);

  useEffect(() => {
    window.addEventListener('online', setOnline);
    window.addEventListener('offline', setOffline);

    return () => {
      window.removeEventListener('online', setOnline);
      window.removeEventListener('offline', setOffline);
    };
  }, []);

  return status;
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { TokenData, UserData } from './types';
import { fetchLatestPrices, getInitialPrices } from './utils/fetchLatestPrice';
import BN from 'bignumber.js';
import { coinsProvider, initialize } from './config';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { getDebug } from './lib/utils/debug';
import { amountUi } from './utils/conversion';
import { matchRoutes, useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import _ from 'lodash';
import { useNumericFormat } from 'react-number-format';
import { create } from 'zustand';
import { queryClient } from './App';
import { Twa } from '@telegram-wallet-ui/twa-ui-kit';
import { Coin } from './lib/CoinsProvider';

export enum QueryKeys {
  FETCH_LAST_PRICE = 'useFetchLatestPrice',
  COIN_LAST_PRICE = 'useCoinsLastPrice',
  COINS_LIST = 'useCoinsList',
  BALANCES = 'useBalances',
  PORTFOLIO_USD_VALUE = 'usePortfolioUsdValue',
  QUOTE = 'useQuote',
}

const debug = getDebug('hooks');

export const useCoinsLastPrice = () => {
  const coins = coinsProvider.coins();

  return useQuery({
    queryKey: [QueryKeys.COIN_LAST_PRICE],
    queryFn: async () => {
      const ids = _.map(coins || {}, 'coingeckoId').join(',');
      return fetchLatestPrices(ids);
    },
    enabled: !!coins,
    refetchInterval: 10_000,
    staleTime: 5_000,
    initialData: getInitialPrices(),
  });
};

export const useFetchLatestPrice = (coin: string | undefined) => {
  const { data: coinsPrice } = useCoinsLastPrice();

  if (!coin) return;

  return coinsPrice?.[coin];
};

export const useMultiplyPriceByAmount = (
  coin?: string,
  _amount?: number | string
) => {
  const price = useFetchLatestPrice(coin);

  return useMemo(() => {
    if (_amount === undefined || price === undefined) return '-';

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
  return useQuery({
    queryKey: [QueryKeys.COINS_LIST],
    queryFn: async () => {
      return coinsProvider.coins();
    },
  });
};

export const useGetTokenFromList = (symbol?: string) => {
  const { data, dataUpdatedAt } = useBalances();

  return useMemo(() => _.find(data, { symbol }), [dataUpdatedAt, symbol]);
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
  const { data, dataUpdatedAt: userDataUpdatedAt, error } = useBalances();
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

    const tokenWithBalance = Object.values(data ?? {}).filter(
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
  const coins = coinsProvider.coins();
  return (
    (await queryClient.fetchQuery({
      queryKey: [QueryKeys.BALANCES],
      queryFn: () => updateCoinBalances(coins),
    })) ?? {}
  );
};

const transformBalances = (coins: Coin[], balances: Record<string, string>) => {
  return Object.fromEntries(
    coins.map((token: Coin) => {
      const balance = new BN(balances[token.address] ?? 0);
      return [
        token.symbol.toUpperCase(),
        {
          ...token,
          name: token.name,
          symbolDisplay: token.symbol.toUpperCase(),
          symbol: token.symbol.toLowerCase(),
          balanceBN: balance,
          balance: amountUi(token, balance) || '0',
        },
      ];
    })
  );
};

const initialCoinBalances = (coins: Coin[]): UserData | undefined => {
  let balances;
  if (localStorage.getItem('balances')) {
    balances = JSON.parse(localStorage.getItem('balances')!);
  } else {
    balances = Object.fromEntries(coins.map((token) => [token.address, '0']));
  }

  return transformBalances(coins, balances);
};

const updateCoinBalances = async (coins: Coin[]) => {
  try {
    debug('Refreshing balances...');

    const _userData: UserData = {};

    if (coins.length === 0) return _userData;
    const { web3Provider } = await initialize();

    const balances = await web3Provider.balancesOf(
      coins.filter((c) => c.address !== '').map((c) => c.address)
    );

    coins
      .filter((c) => c.address === '')
      .forEach((c) => {
        balances[c.address] = '0';
      });

    localStorage.setItem('balances', JSON.stringify(balances));

    return transformBalances(coins, balances);
  } catch (e) {
    debug(e);
  }
};

export const useBalances = () => {
  const coins = coinsProvider.coins();
  return useQuery({
    queryKey: [QueryKeys.BALANCES],
    enabled: coins.length > 0,
    refetchInterval: 10_000,
    staleTime: 5_000,
    queryFn: () => updateCoinBalances(coins),
    initialData: initialCoinBalances(coins),
  });
};

export const useFormatNumber = ({
  value,
  decimalScale = 4,
  prefix,
  suffix,
  thousandSeparator = ',',
}: {
  value?: string | number;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
  thousandSeparator?: string;
}) => {
  const decimals = useMemo(() => {
    if (!value) return 0;
    const [, decimal] = value.toString().split('.');
    if (!decimal) return 0;
    const arr = decimal.split('');
    let count = 0;

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === '0') {
        count++;
      } else {
        break;
      }
    }

    return !count ? decimalScale : count + decimalScale;
  }, [value, decimalScale]);

  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator,
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
      const { swapProvider } = await initialize();
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

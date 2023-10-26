/* eslint-disable react-hooks/exhaustive-deps */
import { erc20s, zeroAddress, networks } from '@defi.org/web3-candies';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Token, TokenListResponse, UserData } from './types';
import { fetchLatestPrice } from './utils/fetchLatestPrice';
import BN from 'bignumber.js';
import { account, coinsProvider, isMumbai, web3Provider } from './config';
import { useEffect, useMemo, useRef } from 'react';
import { getDebug } from './lib/utils/debug';
import { amountUi } from './utils/conversion';
import { matchRoutes, useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import _ from 'lodash';
import { useNumericFormat } from 'react-number-format';

enum QueryKeys {
  FETCH_LAST_PRICE = 'useFetchLatestPrice',
  COINS_LIST = 'useCoinsList',
  USER_DATA = 'useUserData',
  PORTFOLIO_USD_VALUE = 'usePortfolioUsdValue',
}

const debug = getDebug('hooks');

export const useFetchLatestPrice = (coin?: string) => {
  const { refetch: refetchPortfolioUsdValue } = usePortfolioUsdValue();
  const query = useQuery({
    queryKey: [QueryKeys.FETCH_LAST_PRICE, coin],
    queryFn: () => fetchLatestPrice(coin ?? ''),
    enabled: !!coin,
    staleTime: 20_000,
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
      _.forEach(tokenWithBalance, (token) => {
        if (!dictionary[token.coingeckoId]) {
          return '0';
        }
      });

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
    staleTime: 20_000,
    queryFn: async () => {
      try {
        if (!account) throw new Error('updateBalances: No account');

        console.log('Refreshing balances...');

        // const nativeTokenBalance = await web3Provider.balance();

        const _userData: UserData = {
          account,
          tokens: {},
        };

        if (coins.length === 0) return _userData;

        const balancePromises = coins
          .filter((token) => token.symbol !== networks.poly.native.symbol)
          .map(async (token) => {
            const balance = await web3Provider.balanceOf(token.address);
            const permit2Approval = await web3Provider.getAllowanceFor(
              token.address
            );
            return {
              ...token,
              symbol: token.symbol.toLowerCase(),
              balanceBN: balance,
              balance: amountUi(token, balance) || '0',
              permit2Approval,
            };
          });

        const tokens = await Promise.all(balancePromises);

        tokens.forEach((token) => {
          _userData.tokens[token.symbol] = {
            ...token,
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

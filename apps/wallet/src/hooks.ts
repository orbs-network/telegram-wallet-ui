/* eslint-disable react-hooks/exhaustive-deps */
import { erc20s, zeroAddress, networks } from '@defi.org/web3-candies';
import { useQuery } from '@tanstack/react-query';
import { Token, TokenListResponse, UserData } from './types';
import { fetchLatestPrice } from './utils/fetchLatestPrice';

import { account, isMumbai, web3Provider } from './config';
import { useEffect, useMemo, useRef } from 'react';
import { Fetcher } from './utils/fetcher';
import { getDebug } from './lib/utils/debug';
import { amountUi } from './utils/conversion';
import { matchRoutes, useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import _ from 'lodash';
import { useNumericFormat } from 'react-number-format';

const debug = getDebug('hooks');

export const useFetchLatestPrice = (coin?: string, vsCurrencies?: string) => {
  return useQuery({
    queryKey: ['useFetchLatestPrice', coin],
    queryFn: () => fetchLatestPrice(coin ?? ''),
    enabled: !!coin,
    staleTime: 10000,
  });
};

export const useMultiplyPriceByAmount = (coin?: string, amount?: number) => {
  const { data: price } = useFetchLatestPrice(coin);

  return useMemo(() => {
    if (!amount || !price) return '0';

    return amount * price;
  }, [amount, price]);
};

export const useCoinsList = () => {
  return useQuery<Token[]>({
    queryKey: ['useCoinsList'],
    queryFn: async () => {
      const data = await Fetcher.get<TokenListResponse>(
        isMumbai
          ? 'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/mumbai.json'
          : 'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json'
      );

      const parsed = data.map((coin): Token => {
        return {
          symbol: coin.symbol,
          address: coin.address,
          decimals: coin.decimals,
          coingeckoId: coin.coingeckoId ?? '',
          logoURI: coin.logoURI,
          name: coin.name,
        };
      });

      const candiesAddresses = [
        zeroAddress,
        ...Object.values(erc20s.poly).map((t) => t().address),
      ];

      return parsed
        .sort((a, b) => {
          const indexA = candiesAddresses.indexOf(a.address);
          const indexB = candiesAddresses.indexOf(b.address);
          return indexA >= 0 && indexB >= 0
            ? indexA - indexB
            : indexA >= 0
            ? -1
            : indexB >= 0
            ? 1
            : 0;
        })
        .slice(0, 10);
    },
  });
};

export const useTokenBalanceQuery = (tokenAddress?: string) => {
  const token = useGetTokenFromList(tokenAddress);
  const query = useQuery({
    queryKey: ['useTokenBalanceQuery', tokenAddress],
    queryFn: async () => {
       const result = await web3Provider.balanceOf(tokenAddress!);
       return amountUi(token, result) || '0';
    },

    enabled: !!tokenAddress && !!token,
    // refetchInterval: 20_000,
  });

  return query;
};

export const useGetTokenFromList = (tokenAddress?: string) => {
  const { data: tokens, dataUpdatedAt } = useCoinsList();

  return useMemo(
    () => tokens?.find((it) => it.address === tokenAddress),
    [dataUpdatedAt, tokenAddress]
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

export const useUserData = () => {
  const { data: coins = [] } = useCoinsList();

  return useQuery({
    queryKey: ['useUserData'],
    enabled: coins.length > 0,
    queryFn: async () => {
      try {
        if (!account) throw new Error('updateBalances: No account');

        console.log('Refreshing balances...');

        const _userData: UserData = {
          account,
          balance: await web3Provider.balance(),
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
              balance,
              permit2Approval,
            };
          });

        const tokens = await Promise.all(balancePromises);

        tokens.forEach((token) => {
          _userData.tokens[token.symbol] = {
            ...token,
            balance: token.balance.toString(),
            permit2Approval: token.permit2Approval,
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

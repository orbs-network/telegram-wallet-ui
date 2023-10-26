import { erc20s, zeroAddress, networks } from '@defi.org/web3-candies';
import { useQuery } from '@tanstack/react-query';
import { Token, TokenListResponse, UserData } from './types';
import { fetchLatestPrice } from './utils/fetchLatestPrice';

import { account, coinsProvider, isMumbai, web3Provider } from './config';
import { useEffect, useRef } from 'react';
import { Fetcher } from './utils/fetcher';
import { getDebug } from './lib/utils/debug';

const debug = getDebug('hooks');

export const useFetchLatestPrice = (coin?: string, vsCurrencies?: string) => {
  return useQuery({
    queryKey: [coin],
    queryFn: () => fetchLatestPrice(coin ?? '', vsCurrencies),
    enabled: !!coin,
    staleTime: 10000,
  });
};

export const useCoinsList = () => {
  return useQuery<Token[]>({
    queryKey: ['useCoinsList'],
    queryFn: async () => {
      return coinsProvider.fetchCoins();
    },
  });
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

import { erc20s, zeroAddress, networks } from '@defi.org/web3-candies';
import { useQuery } from '@tanstack/react-query';
import { Token, TokenListResponse, UserData } from './types';
import { fetchLatestPrice } from './utils/fetchLatestPrice';

import { account, web3Provider } from './config';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Fetcher } from './utils/fetcher';

export const useFetchLatestPrice = (coin?: string) => {
  return useQuery({
    queryKey: [coin],
    queryFn: () => fetchLatestPrice(coin ?? ''),
    enabled: !!coin,
  });
};

export const useCoinsList = () => {
  return useQuery<Token[]>({
    queryKey: ['useCoinsList'],
    queryFn: async () => {
      const data = await Fetcher.get<TokenListResponse>(
        'https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/polygon.json'
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
  const [userData, setUserData] = useState<UserData | null>(null);

  const { data: coins = [] } = useCoinsList();

  const updateBalances = useCallback(async () => {
    console.log('Refreshing balances...');
    const _userData: UserData = {
      account,
      balance: await web3Provider.balance(),
      tokens: {},
    };

    if (coins.length === 0) return;

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
        balance: token.balance,
        permit2Approval: token.permit2Approval,
      };
    });

    setUserData(_userData);
  }, [coins]);

  useInterval(updateBalances, 30000);

  useEffect(() => {
    // Initial fetch
    updateBalances();
  }, [updateBalances]);

  return userData;
};
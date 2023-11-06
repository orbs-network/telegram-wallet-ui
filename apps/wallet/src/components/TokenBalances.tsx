import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { TokensList } from './TokensList';
import { useNavigation } from '../router/hooks';
import { VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

const TON_TOKEN = {
  coingeckoId: 'ton-coin',
  name: 'Toncoin',
  symbol: 'TON',
  logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
  balance: '0',
  balanceBN: new BN(0),
  symbolDisplay: 'TON',
  address: '',
  decimals: 9,
};

export function TokenBalances() {
  const { asset } = useNavigation();
  const { data: userData, dataUpdatedAt } = useUserData();

  // filter out zero balances and at least show usdt
  const tokens = useMemo(() => {
    const tokensWithBalances = Object.values(userData?.tokens ?? {}).filter(
      (t) => BN(t.balance).gt(0)
    );

    if (tokensWithBalances?.length === 0 && userData) {
      tokensWithBalances.push(userData.tokens.USDT);
    }
    return [...tokensWithBalances, TON_TOKEN];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt]);

  return (
    <VStack spacing="6px" alignItems="stretch">
      <TokensList
        mode="display"
        tokens={tokens}
        onSelect={(token) => asset(token.symbol)}
        disabledTokens={['TON']}
        css={{
          '.token-list-item-disabled': {
            pointerEvents: 'none',
          },
        }}
      />
    </VStack>
  );
}

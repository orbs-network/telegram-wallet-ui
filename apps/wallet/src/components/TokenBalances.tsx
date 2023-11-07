import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { TokensList } from './TokensList';
import { useNavigation } from '../router/hooks';
import { VStack } from '@chakra-ui/react';
import { useMemo } from 'react';

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
    return [...tokensWithBalances];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt]);

  return (
    <VStack spacing="6px" alignItems="stretch">
      <TokensList
        mode="display"
        tokens={tokens}
        onSelect={(token) => asset(token.symbol)}
        disabledTokens={['TON']}
      />
    </VStack>
  );
}

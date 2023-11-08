import { useBalances } from '../hooks';
import BN from 'bignumber.js';
import { TokensList } from './TokensList';
import { useNavigation } from '../router/hooks';
import { VStack } from '@chakra-ui/react';
import { useMemo } from 'react';
import { disabledTokens } from '../config';

export function TokenBalances() {
  const { asset } = useNavigation();
  const { data: userData, dataUpdatedAt } = useBalances();

  // filter out zero balances and at least show usdt
  const tokens = useMemo(() => {
    const tokensWithBalances = Object.values(userData ?? {}).filter(
      (t) => BN(t.balance).gt(0)
    );

    if (userData) {
      if (tokensWithBalances?.length === 0) {
        tokensWithBalances.push(userData.USDT);
      }
      tokensWithBalances.push(userData.TON);
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
        disabledTokens={disabledTokens}
      />
    </VStack>
  );
}

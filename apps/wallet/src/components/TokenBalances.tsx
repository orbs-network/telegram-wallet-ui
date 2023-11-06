import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { TokensList } from './TokensList';
import { useNavigation } from '../router/hooks';
import styled from '@emotion/styled';
import { VStack } from '@chakra-ui/react';

export function TokenBalances() {
  const { asset } = useNavigation();
  const { data: userData } = useUserData();

  const tokensWithBalances = Object.values(userData?.tokens ?? {}).filter((t) =>
    BN(t.balance).gt(0)
  );

  if (tokensWithBalances?.length === 0 && userData) {
    tokensWithBalances.push(userData.tokens.USDT);
  }

  return (
    <VStack spacing="6px" alignItems="stretch">
      <StyledTokensList
        tokens={tokensWithBalances}
        onSelect={(token) => asset(token.symbol)}
      />
      <StyledTokensList
        tokens={[
          {
            coingeckoId: 'ton-coin',
            name: 'Toncoin',
            symbol: 'TON',
            logoURI:
              'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
            balance: '0',
            balanceBN: new BN(0),
            symbolDisplay: 'TON',
            address: '',
            decimals: 9,
          },
        ]}
        onSelect={() => {
          // none
        }}
      />
    </VStack>
  );
}

const StyledTokensList = styled(TokensList)`
  gap: 6px;
`;

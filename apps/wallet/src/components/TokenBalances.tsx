import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { Link } from 'react-router-dom';
import { Heading, Box, Text, Avatar, Spinner } from '@chakra-ui/react';
import { DataDisplayItem, Card } from '@telegram-wallet-ui/twa-ui-kit';

export function TokenBalances() {
  const userData = useUserData();

  if (!userData?.tokens) {
    return <Spinner />;
  }

  // filter out zero balances and at least show usdt
  const tokenBalances = Object.values(userData.tokens).filter(
    (token) => token.symbol === 'usdt' || !BN(token.balance).eq(0)
  );

  return tokenBalances.map((token) => (
    <Link key={token.symbol} to={`/asset/${token.symbol}`}>
      <Card>
        <DataDisplayItem
          StartIconSlot={
            // TODO: replace with real asset icon
            <Avatar name={token.symbol} />
          }
          StartTextSlot={
            <Box>
              <Heading as="h3" variant="bodyTitle">
                {token.name}
              </Heading>
              <Text variant="hint">
                {token.balance} {token.symbol.toUpperCase()}
              </Text>
            </Box>
          }
        />
      </Card>
    </Link>
  ));
}

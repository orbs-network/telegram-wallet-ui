import {
  Avatar,
  Container,
  VStack,
  Text,
  HStack,
  Heading,
  Divider,
  Box,
} from '@chakra-ui/react';
import { Page, WalletSpinner } from '../components';
import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  WithdrawalTransactionEvent,
  useEventsProvider,
} from '../lib/EventsProvider';
import { useUserData } from '../hooks';
import { amountUi } from '../utils/conversion';
import BN from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { Card } from '@telegram-wallet-ui/twa-ui-kit';

export function Transaction() {
  const { txId } = useParams<{ txId: string }>();

  const events = useEventsProvider();

  const tx = events.find((tx) => tx.id === txId);

  const { data: userData } = useUserData();

  if (!txId || !tx || !userData) {
    return (
      <Container size="sm" pt={4}>
        <WalletSpinner />
      </Container>
    );
  }

  let txToken = null;
  let txDescription = '';
  let txAmount = '';
  let TxDetails = null;

  switch (tx.type) {
    case 'deposit': {
      const dTx = tx as DepositTransactionEvent;
      txToken = Object.values(userData?.tokens || []).find(
        (token) => token.address === dTx.token
      );
      txDescription = 'Deposit';
      txAmount = `+${amountUi(txToken, BN(dTx.amount), 5)}`;

      break;
    }
    case 'withdrawal': {
      const wTx = tx as WithdrawalTransactionEvent;
      txToken = Object.values(userData?.tokens || []).find(
        (token) => token.address === wTx.token
      );

      txDescription = `Withdrawal to ${wTx.toAddress.slice(0, 8)}...`;
      txAmount = `-${amountUi(txToken, BN(wTx.amount), 5)}`;
      TxDetails = (
        <Card>
          <Text variant="hint">To</Text>
          <Text>{wTx.toAddress}</Text>
        </Card>
      );
      break;
    }
    case 'trade': {
      const tTx = tx as TradeTransactionEvent;
      const inToken = Object.values(userData?.tokens || []).find(
        (token) => token.address === tTx.inToken
      );
      const outToken = Object.values(userData?.tokens || []).find(
        (token) => token.address === tTx.outToken
      );
      txToken = outToken;
      txDescription = `Trade ${inToken?.symbol.toUpperCase()} to ${outToken?.symbol.toUpperCase()}`;
      txAmount = `+${amountUi(txToken, BN(tTx.amountOut), 5)}`;
      TxDetails = (
        <Card>
          <VStack alignItems="flex-start">
            <Box>
              <Text variant="hint">Paid</Text>
              <Text>
                {amountUi(inToken, BN(tTx.amountIn))}{' '}
                {inToken?.symbol.toUpperCase()}
              </Text>
            </Box>
            <Divider />
            <Box>
              <Text variant="hint">Exchange Rate</Text>
              <Text>
                1 {inToken?.symbol.toUpperCase()} ≈ {tTx.exchangeRate}{' '}
                {outToken?.symbol.toUpperCase()}
              </Text>
            </Box>
          </VStack>
        </Card>
      );
      break;
    }
  }

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch" height="100%">
          <HStack>
            <Avatar width={30} height={30} src={txToken?.logoURI} />
            <Text size="sm">{txDescription}</Text>
          </HStack>
          <Heading
            as="h2"
            size="2xl"
            color={tx.direction === 'incoming' ? 'green' : 'inherit'}
          >
            {txAmount}{' '}
            <Text
              as="span"
              fontSize="2rem"
              color={tx.direction === 'incoming' ? 'green.500' : 'inherit'}
            >
              {txToken?.symbol.toUpperCase()}
            </Text>
          </Heading>
          <Text variant="hint">{tx.date.toLocaleString()}</Text>
          <Card>
            <Text variant="hint">Status</Text>
            <Text>{tx.status.toUpperCase()}</Text>
          </Card>
          {TxDetails}
        </VStack>
      </Container>
    </Page>
  );
}

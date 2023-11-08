import {
  Avatar,
  Container,
  VStack,
  Text,
  HStack,
  Heading,
  Divider,
  Box,
  SkeletonText,
  SkeletonCircle,
} from '@chakra-ui/react';
import { Page } from '../components';
import {
  DepositTransactionEvent,
  TradeTransactionEvent,
  WithdrawalTransactionEvent,
  useEventsProvider,
} from '../lib/EventsProvider';
import { useBalances } from '../hooks';
import { amountUi, toUiDisplay } from '../utils/conversion';
import BN from 'bignumber.js';
import { useParams } from 'react-router-dom';
import { Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { formatDateTime } from '../utils/utils';
import { css } from '@emotion/react';

const styles = {
  mainText: css`
    font-size: 1.125rem;
  `,
};

export function Transaction() {
  const { txId } = useParams<{ txId: string }>();

  const events = useEventsProvider();

  const tx = events.find((tx) => tx.id === txId);

  const { data: userData } = useBalances();

  let txToken = null;
  let txDescription: React.ReactNode = '';
  let txAmount = '';
  let TxDetails = null;

  switch (tx?.type) {
    case 'deposit': {
      const dTx = tx as DepositTransactionEvent;
      txToken = Object.values(userData ?? {}).find(
        (token) => token.address === dTx.token
      );
      txDescription = 'Deposit';
      txAmount = `+${amountUi(txToken, BN(dTx.amount), 5)}`;

      break;
    }
    case 'withdrawal': {
      const wTx = tx as WithdrawalTransactionEvent;
      txToken = Object.values(userData ?? {}).find(
        (token) => token.address === wTx.token
      );

      txDescription = (
        <>
          Withdrawal to{' '}
          <Text as="span" fontWeight={500}>
            {wTx.toAddress.slice(0, 8)}...
          </Text>
        </>
      );
      txAmount = `-${amountUi(txToken, BN(wTx.amount), 5)}`;
      TxDetails = (
        <Card>
          <Text variant="hint">To</Text>
          <Text css={styles.mainText}>{wTx.toAddress}</Text>
        </Card>
      );
      break;
    }
    case 'trade': {
      const tTx = tx as TradeTransactionEvent;
      const inToken = Object.values(userData ?? {}).find(
        (token) => token.address === tTx.inToken
      );
      const outToken = Object.values(userData ?? {}).find(
        (token) => token.address === tTx.outToken
      );
      txToken = outToken;
      txDescription = (
        <>
          Buy{' '}
          <Text as="span" fontWeight={500}>
            {outToken?.symbolDisplay}
          </Text>{' '}
          with{' '}
          <Text as="span" fontWeight={500}>
            {inToken?.symbolDisplay}
          </Text>
        </>
      );
      txAmount = `+${amountUi(txToken, BN(tTx.amountOut), 5)}`;
      TxDetails = (
        <Card>
          <VStack alignItems="flex-start">
            <Box>
              <Text variant="hint">Paid</Text>
              <Text css={styles.mainText}>
                {amountUi(inToken, BN(tTx.amountIn))} {inToken?.symbolDisplay}
              </Text>
            </Box>
            <Divider />
            <Box>
              <Text variant="hint">Exchange Rate</Text>
              <Text css={styles.mainText}>
                1 {inToken?.symbolDisplay} ≈ {toUiDisplay(tTx.exchangeRate)}{' '}
                {outToken?.symbolDisplay}
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
            {txToken ? (
              <Avatar width={30} height={30} src={txToken.logoURI} />
            ) : (
              <SkeletonCircle />
            )}

            {txDescription === '' ? (
              <SkeletonText />
            ) : (
              <Text>{txDescription}</Text>
            )}
          </HStack>
          {txAmount !== '' && txToken && tx ? (
            <Heading
              as="h2"
              size="3xl"
              color={tx.direction === 'incoming' ? colors.success : 'inherit'}
            >
              {txAmount}{' '}
              <Text as="span" fontSize="2rem">
                {txToken?.symbolDisplay}
              </Text>
            </Heading>
          ) : (
            <SkeletonText />
          )}
          {tx ? (
            <Text variant="hint" css={styles.mainText}>
              {formatDateTime(tx.date)}
            </Text>
          ) : (
            <SkeletonText />
          )}
          {TxDetails}
        </VStack>
      </Container>
    </Page>
  );
}

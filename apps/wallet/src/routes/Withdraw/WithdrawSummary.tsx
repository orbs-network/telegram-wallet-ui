import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { useParams } from 'react-router-dom';
import { Page } from '../../components';
import { eventsProvider, web3Provider } from '../../config';
import { useGetTokenFromList } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { URLParams } from '../../types';
import { Recipient } from './Components';
import { amountBN, amountUi } from '../../utils/conversion';
import { useUpdateMainButton } from '../../store/main-button-store';
import BN from 'bignumber.js';

const useTransferTx = () => {
  const { recipient, amount, assetId } = useParams<URLParams>();
  const { withdrawSuccess } = useNavigation();

  const token = useGetTokenFromList(assetId);

  return useMutation({
    mutationFn: async () => {
      if (!token) {
        throw new Error('Token not found');
      }
      if (!recipient) {
        throw new Error('Recipient not found');
      }
      if (!amount) {
        throw new Error('Amount not found');
      }

      eventsProvider.withdrawal({
        amount: amountBN(token, amount).toString(),
        token: token.address,
        toAddress: recipient,
      });

      return web3Provider.transfer(
        token.address,
        recipient,
        amountBN(token, amount).toString()
      );
    },
    onSuccess: () => {
      withdrawSuccess(assetId!, recipient!, amount!);
    },
    onError: (error) => {
      console.log(error);
    },
  });
};

export function WithdrawSummary() {
  const { recipient, amount, assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const { mutateAsync, isPending } = useTransferTx();
  const symbol = token?.symbolDisplay || '';
  const balanceAfter = BN(amountUi(token, token?.balanceBN || BN(0)))
    .minus(amount || 0)
    .toFormat();

  useUpdateMainButton({
    text: 'CONFIRM AND SEND',
    onClick: mutateAsync,
    progress: isPending,
  });

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={8} alignItems="stretch" height="100%">
          <Recipient />
          <Heading as="h2" size="3xl">
            {amount}{' '}
            <Text as="span" variant="hint" fontSize="3xl">
              {symbol}
            </Text>
          </Heading>
          <Box>
            <Card>
              <VStack alignItems="flex-start" style={{ width: '100%' }}>
                <Section title="Recipient address" value={recipient!} />
                <Section title="Total amount" value={`${amount!} ${symbol}`} />
                <Section title="Network" value="Polygon" />
              </VStack>
            </Card>
            <Text variant="hint" mt={2}>
              Your funds may be lost if sent to the wrong network
            </Text>
          </Box>
          <Card>
            <VStack alignItems="flex-start" style={{ width: '100%' }}>
              <Section
                title="Balance after"
                value={`${balanceAfter} ${symbol}`}
              />
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Page>
  );
}

const styles = {
  container: css`
    border-bottom: 1px solid ${colors.border_color};
    width: 100%;
    padding-bottom: 5px;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0px;
    }
  `,

  sectionValue: css`
    word-break: break-all;
  `,
};

const Section = ({ title, value }: { title: string; value: string }) => {
  return (
    <VStack css={styles.container} gap="2px" alignItems="stretch">
      <Text variant="hint">{title}</Text>
      <Text css={styles.sectionValue}>{value}</Text>
    </VStack>
  );
};

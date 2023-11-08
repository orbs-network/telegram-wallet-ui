import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { Page, ReviewTx } from '../../components';
import { eventsProvider, web3Provider } from '../../config';
import { useFormatNumber, useGetTokenFromList } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { URLParams } from '../../types';
import { Recipient } from './Components';
import { amountBN } from '../../utils/conversion';
import { useUpdateMainButton } from '../../store/main-button-store';
import BN from 'bignumber.js';

const useTransferTx = () => {
  const { recipient, amount, assetId } = useParams<URLParams>();
  const { withdrawSuccess } = useNavigation();
  const toast = useToast();
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

      const txHash = await web3Provider.transfer(
        token.address,
        recipient,
        amountBN(token, amount).toString()
      );

      eventsProvider.withdrawal({
        amount: amountBN(token, amount).toString(),
        token: token.address,
        toAddress: recipient,
      });

      return txHash;
    },
    onSuccess: () => {
      withdrawSuccess(assetId!, recipient!, amount!);
    },
    onError: (error) => {
      console.log(error);
      let errorMsg = String(error);
      if ('reason' in error) {
        errorMsg = error.reason as string;
      } else if ('message' in error) {
        errorMsg = error.message as string;
      }

      toast({
        title: 'Error',
        description: errorMsg,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    },
  });
};

export function WithdrawSummary() {
  const { recipient, amount, assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const { mutateAsync, isPending } = useTransferTx();
  const symbol = token?.symbolDisplay || '';

  const balanceAfter = useFormatNumber({
    value: !token?.balance
      ? ''
      : BN(token?.balance || 0)
          .minus(amount || 0)
          .toString(),
  });

  useUpdateMainButton({
    text: 'CONFIRM AND SEND',
    onClick: mutateAsync,
    progress: isPending,
  });

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={6} alignItems="stretch" height="100%">
          <Box>
            <Recipient />
            <Heading as="h2" size="3xl">
              {amount}{' '}
              <Text as="span" variant="hint" fontSize="3xl">
                {symbol}
              </Text>
            </Heading>
          </Box>
          <ReviewTx>
            <ReviewTx.Category bottomText="Your funds may be lost if sent to the wrong network">
              <ReviewTx.Section title="Recipient address" value={recipient!} />
              <ReviewTx.Section
                title="Total amount"
                value={`${amount!} ${symbol}`}
              />
              <ReviewTx.Section title="Network" value="Polygon" />
            </ReviewTx.Category>

            <ReviewTx.Category>
              <ReviewTx.Section
                title="Balance after"
                value={`${balanceAfter} ${symbol}`}
              />
            </ReviewTx.Category>
          </ReviewTx>
        </VStack>
      </Container>
    </Page>
  );
}

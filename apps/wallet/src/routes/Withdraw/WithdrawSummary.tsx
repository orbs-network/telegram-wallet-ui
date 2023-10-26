import { Container, Text, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { useMutation } from '@tanstack/react-query';
import { Card } from '@telegram-wallet-ui/twa-ui-kit';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../../components';
import { web3Provider } from '../../config';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { useGetTokenFromList } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { URLParams } from '../../types';
import { Recipient } from './Components';

const useTransferTx = () => {
  return useMutation({
    mutationFn: async (params: {
      assetId: string;
      recipient: string;
      amount: string;
      onSuccess?: () => void;
    }) => {
      return web3Provider.transfer(
        params.assetId,
        params.recipient,
        params.amount
      );
    },
    onSuccess: (data, args) => {
      args.onSuccess?.();
    },
    onError: (error) => {
        console.log(error);
        }
  });
};

export function WithdrawSummary() {
  const { onSetButton } = useMainButtonContext();
  const { recipient, amount, assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const { mutate, isPending } = useTransferTx();
  const { withdrawSuccess } = useNavigation();
  const symbol = token?.symbol || '';

  useEffect(() => {
    onSetButton({
      text: 'CONFIRM AND SEND',
      progress: isPending,
      onClick: () =>
        mutate({
          assetId: assetId!,
          recipient: recipient!,
          amount: amount!,
          onSuccess: () => withdrawSuccess(assetId!, recipient!, amount!),
        }),
    });
  }, [
    onSetButton,
    assetId,
    mutate,
    recipient,
    amount,
    isPending,
    withdrawSuccess,
  ]);

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch" height="100%">
          <Recipient />
          <Card>
            <VStack alignItems="flex-start" style={{ width: '100%' }}>
              <Section title="Recipient address" value={recipient!} />
              <Section title="Total amount" value={`${amount!} ${symbol}`} />
              <Section title="Network" value="Polygon" />
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Page>
  );
}

const styles = {
  container: css`
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
    padding-bottom: 5px;
    &:last-child {
      border-bottom: none;
      padding-bottom: 0px;
    }
  `,
  sectionTitle: css`
    font-size: 14px;
    color: #9d9d9d;
  `,
  sectionValue: css`
    font-size: 14px;
    word-break: break-all;
  `,
};

const Section = ({ title, value }: { title: string; value: string }) => {
  return (
    <VStack css={styles.container} gap="2px" alignItems="stretch">
      <Text css={styles.sectionTitle}>{title}</Text>
      <Text css={styles.sectionValue}>{value}</Text>
    </VStack>
  );
};

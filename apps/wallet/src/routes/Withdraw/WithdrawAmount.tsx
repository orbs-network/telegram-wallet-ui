import { VStack, Text, Flex, Avatar, Container } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { css } from '@emotion/react';
import { useFormatNumber, useGetTokenFromList } from '../../hooks';
import { CryptoAmountInput, Page } from '../../components';
import styled from '@emotion/styled';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { Recipient } from './Components';
import { useNavigation } from '../../router/hooks';
import BN from 'bignumber.js';
import { twaMode } from '@telegram-wallet-ui/twa-ui-kit';

const styles = {
  mainContainer: css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  tokenAvatar: css`
    width: 40px;
    height: 40px;
  `,
  balanceTitle: css`
    color: #a1a1a1;
    font-size: 14px;
  `,
  balanceValue: css`
    font-size: 16px;
    font-weight: 500;
  `,
  balanceContainer: css`
    margin-top: auto;
    position: relative;
    padding-top: 15px;
    padding-bottom: 15px;
    &::after {
      content: '';
      position: absolute;
      top: 0px;
      left: 50%;
      transform: translateX(-50%);
      background: ${twaMode('#d9d9d9', '#2d2d2d')};
      height: 1px;
      width: calc(100% + 32px);
    }
  `,
};

export function WithdrawAmount() {
  const [amount, setAmount] = useState('');
  const { assetId, recipient } = useParams<URLParams>();

  const { onSetButton } = useMainButtonContext();
  const { withdrawSummary: navigateToWithdrawSummary } = useNavigation();
  const formattedAmount = useFormatNumber({ value: amount, decimalScale: 2 });
  const token = useGetTokenFromList(assetId);

  const formattedBalance = useFormatNumber({
    value: token?.balance,
    decimalScale: 2,
  });

  const isValidAmount = useMemo(() => {
    const amountBN = new BN(amount);
    const balanceBN = new BN(token?.balance || '0');

    return balanceBN.gte(amountBN) && !amountBN.isZero();
  }, [amount, token?.balance]);

  useEffect(() => {
    onSetButton({
      text: !isValidAmount
        ? 'Send'
        : `Send ${formattedAmount} ${token?.symbol.toUpperCase()}`,
      disabled: !isValidAmount,
      onClick: () => navigateToWithdrawSummary(assetId!, recipient!, amount),
    });
  }, [
    onSetButton,
    isValidAmount,
    formattedAmount,
    token?.symbol,
    navigateToWithdrawSummary,
    assetId,
    recipient,
    amount,
  ]);

  return (
    <StyledPage>
      <Container size="sm" pt={4} css={styles.mainContainer}>
        <VStack spacing={4} alignItems="stretch" style={{ flex: 1 }}>
          <Recipient />
          {/* TODO: handle undefined assetId better */}
          <CryptoAmountInput
            name="withdrawalAmount"
            value={amount}
            onChange={setAmount}
            tokenSymbol={assetId || ''}
          />
          <Balance balance={formattedBalance} />
        </VStack>
      </Container>
    </StyledPage>
  );
}

const Balance = ({ balance }: { balance?: string }) => {
  const { assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);

  return (
    <Flex gap="15px" alignItems="center" css={styles.balanceContainer}>
      <Avatar css={styles.tokenAvatar} src={token?.logoURI} />
      <VStack gap="0px" alignItems="flex-start">
        <Text css={styles.balanceTitle}>Balance</Text>
        <Text css={styles.balanceValue}>
          {balance} {token?.symbol.toUpperCase()}
        </Text>
      </VStack>
    </Flex>
  );
};

const StyledPage = styled(Page)({
  background: 'white',
});

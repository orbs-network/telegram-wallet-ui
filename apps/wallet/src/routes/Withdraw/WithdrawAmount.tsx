import { VStack, Text, Flex, Avatar, Container } from '@chakra-ui/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { getTextSizeInPixels } from '../../utils/utils';
import { css } from '@emotion/react';
import {
  useFormatNumber,
  useGetTokenFromList,
  useMultiplyPriceByAmount,
  useTokenBalanceQuery,
} from '../../hooks';
import { Page } from '../../components';
import styled from '@emotion/styled';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { NumericFormat } from 'react-number-format';
import { Recipient } from './Components';
import { useNavigation } from '../../router/hooks';
import BN from 'bignumber.js';

const styles = {
  mainContainer: css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
  inputContainer: css`
    position: relative;
  `,
  inputSymbol: css`
    font-size: 32px;
    font-weight: 700;
    color: #9d9d9d;
    position: absolute;
    bottom: 10px;
    pointer-events: none;
  `,
  usd: css`
    color: #b8b8b8;
    font-size: 18px;
    font-weight: 400;
    padding-left: 7px;
    position: relative;
    top: -5px;
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
      background: #d9d9d9;
      height: 1px;
      width: calc(100% + 32px);
    }
  `,
};

export function WithdrawAmount() {
  const [amount, setAmount] = useState('');
  const { assetId, recipient } = useParams<URLParams>();
  const balance = useTokenBalanceQuery(assetId).data;
  const { onSetButton } = useMainButtonContext();
  const { withdrawSummary: navigateToWithdrawSummary } = useNavigation();
  const formattedAmount = useFormatNumber({ value: amount, decimalScale: 2 });
  const symbol = useGetTokenFromList(assetId)?.symbol;

  const formattedBalance = useFormatNumber({ value: balance, decimalScale: 2 });

  const isValidAmount = useMemo(() => {
    const amountBN = new BN(amount);
    const balanceBN = new BN(balance || '0');

    return balanceBN.gte(amountBN) && !amountBN.isZero();
  }, [amount, balance]);

  useEffect(() => {
    onSetButton({
      text: !isValidAmount ? 'Send' : `Send ${formattedAmount} ${symbol}`,
      disabled: !isValidAmount,
      onClick: () => navigateToWithdrawSummary(assetId!, recipient!, amount),
    });
  }, [
    onSetButton,
    isValidAmount,
    formattedAmount,
    symbol,
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
          <AmountInput setAmount={setAmount} amount={amount} />
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
          {balance} {token?.symbol}
        </Text>
      </VStack>
    </Flex>
  );
};

const AmountInput = ({
  setAmount,
  amount,
}: {
  amount: string;
  setAmount: (value: string) => void;
}) => {
  const { assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const usdPrice = useMultiplyPriceByAmount(
    token?.coingeckoId || 'ethereum',
    Number(amount)
  );

  const formattedAmount = useFormatNumber({ value: amount, decimalScale: 18 });

  const textSizePX = useMemo(() => {
    const size = getTextSizeInPixels({
      text: formattedAmount || '',
      fontSize: 60,
      fontWeight: 700,
    });
    return size < window.innerWidth ? size : window.innerWidth;
  }, [formattedAmount]);

  const formattedUsdPrice = useFormatNumber({ value: usdPrice });

  return (
    <VStack alignItems="flex-start" gap="0px">
      <Flex
        css={styles.inputContainer}
        alignItems="flex-end"
        justifyContent="flex-start"
      >
        <StyledNumericFormat
          placeholder="0"
          thousandSeparator={true}
          value={amount}
          onValueChange={({ value }) => setAmount(value)}
        />
        <Text
          style={{
            left: !amount ? 50 : textSizePX + 12,
          }}
          css={styles.inputSymbol}
        >
          {token?.symbol}
        </Text>
      </Flex>
      <Text css={styles.usd}>≈ $ {formattedUsdPrice}</Text>
    </VStack>
  );
};

const StyledNumericFormat = styled(NumericFormat)({
  fontSize: '60px',
  fontWeight: 700,
  outline: 'none',
  caretColor: '#417fc6',
  width: '100%',
  overflow: 'hidden',
});

const StyledPage = styled(Page)({
  background: 'white',
});

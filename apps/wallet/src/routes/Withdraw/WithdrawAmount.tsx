import { VStack, Text, Flex, Avatar, Container } from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { css } from '@emotion/react';
import { useFormatNumber, useGetTokenFromList } from '../../hooks';
import { CryptoAmountInput, Page } from '../../components';
import styled from '@emotion/styled';
import { Recipient } from './Components';
import { useNavigation } from '../../router/hooks';
import BN from 'bignumber.js';
import { colors, tgColors, twaMode } from '@telegram-wallet-ui/twa-ui-kit';
import { useUpdateMainButton } from '../../store/main-button-store';
import { useAnimate } from 'framer-motion';

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
    color: ${colors.hint_color};
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
      background: ${colors.border_color};
      height: 1px;
      width: calc(100% + 32px);
    }
  `,
};

export function WithdrawAmount() {
  const [amount, setAmount] = useState('');
  const { assetId, recipient } = useParams<URLParams>();
  const { withdrawSummary: navigateToWithdrawSummary } = useNavigation();
  const formattedAmount = useFormatNumber({ value: amount });
  const token = useGetTokenFromList(assetId);

  const formattedBalance = useFormatNumber({
    value: token?.balance,
  });

  const isValidAmount = useMemo(() => {
    if (amount === '') return true;

    const amountBN = new BN(amount);
    const balanceBN = new BN(token?.balance || '0');

    return balanceBN.gte(amountBN);
  }, [amount, token?.balance]);

  const onSubmit = useCallback(() => {
    navigateToWithdrawSummary(assetId!, recipient!, amount);
  }, [navigateToWithdrawSummary, assetId, recipient, amount]);

  useUpdateMainButton({
    text: !isValidAmount
      ? 'Send'
      : `Send ${formattedAmount} ${token?.symbol.toUpperCase()}`,
    disabled: !isValidAmount || amount === '' || BN(amount).isZero(),
    onClick: onSubmit,
  });

  const [scope, animate] = useAnimate();
  useEffect(() => {
    if (!isValidAmount) {
      animate(
        '#withdrawalAmount',
        { x: 3 },
        { duration: 0.05, repeat: 1, repeatType: 'mirror' }
      );
    }
  }, [animate, isValidAmount]);

  return (
    <StyledPage>
      <Container size="sm" pt={4} css={styles.mainContainer}>
        <VStack alignItems="stretch" style={{ flex: 1 }}>
          <Recipient />
          {/* TODO: handle undefined assetId better */}
          <div ref={scope}>
            <CryptoAmountInput
              name="withdrawalAmount"
              value={amount}
              onChange={setAmount}
              tokenSymbol={assetId || ''}
              error={isValidAmount ? undefined : 'Not enough coins'}
            />
          </div>
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
  background: twaMode(
    tgColors.light.bg_color,
    tgColors.dark.secondary_bg_color
  ),
});

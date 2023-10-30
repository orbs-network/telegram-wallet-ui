import { Box, Container, Flex, useToast, VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Page } from '../../../components';
import { useDebouncedCallback } from '../../../hooks';
import { TokenPanel } from './TokenPanel';
import BN from 'bignumber.js';
import { useMainButtonContext } from '../../../context/MainButtonContext';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import { css } from '@emotion/react';
import { TradeContextProvider, useTradeContext } from './context';
import { useNavigation } from '../../../router/hooks';

const styles = {
  switchTokensContainer: css`
    justify-content: flex-end;
    width: 100%;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      width: calc(100% + 32px);
      height: 1px;
      background-color: #e5e5e5;
      top: 50%;
      transform: translate(-50%);
      left: 50%;
    }
  `,
  switchTokensButton: css`
    position: relative;
    z-index: 1;
    padding: 10px;
    background-color: #417fc6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    svg {
      color: white;
      width: 30px;
      height: 30px;
    }
  `,
};

export function OptimizedTrade() {
  return (
    <TradeContextProvider>
      <StyledPage>
        <Container size="sm" pt={4}>
          <TradeForm />
        </Container>
      </StyledPage>
    </TradeContextProvider>
  );
}

const useSubmitButton = () => {
  const { onSetButton } = useMainButtonContext();
  const { validate } = useValidations();
  const { outToken, inAmount, inToken, amountOut, quotePending } =
    useTradeContext();
  const toast = useToast();
  const tradeReview = useNavigation().tradeReview;

  useEffect(() => {
    onSetButton({
      text: 'Review trade',
      disabled:
        !inAmount || !inToken || !outToken || !amountOut || quotePending,
      onClick: () => {
        const error = validate();
        if (!inToken || !outToken) {
          return;
        }
        if (error) {
          toast({
            status: 'error',
            title: error,
            position: 'top',
            duration: 4_000,
          });
          return;
        }
        tradeReview(inToken.symbol, outToken.symbol, inAmount);
      },
    });
  }, [
    onSetButton,
    validate,
    tradeReview,
    inToken?.symbol,
    outToken?.symbol,
    inAmount,
    toast,
    inToken,
    outToken,
    amountOut,
    quotePending,
  ]);
};

const TradeForm = () => {
  useSubmitButton();

  return (
    <VStack>
      <SrcTokenPanel />
      <SwitchTokens />
      <DstTokenPanel />
    </VStack>
  );
};

const SwitchTokens = () => {
  const { inToken, outToken, setInToken, setOutToken } = useTradeContext();

  const onClick = useCallback(() => {
    setInToken(outToken?.symbol);
    setOutToken(inToken?.symbol);
  }, [inToken, outToken, setInToken, setOutToken]);

  return (
    <Flex css={styles.switchTokensContainer}>
      <Box css={styles.switchTokensButton} onClick={onClick}>
        <HiOutlineSwitchVertical />
      </Box>
    </Flex>
  );
};

const useValidations = () => {
  const { inAmount, inToken } = useTradeContext();

  const _inAmount = useCallback(
    (inAmount: string) => {
      return inAmount && inToken && new BN(inAmount).gt(inToken?.balance)
        ? 'Insufficient balance'
        : undefined;
    },
    [inToken]
  );

  const validate = useCallback(() => {
    const isInAmountInValid = _inAmount(inAmount);

    return isInAmountInValid;
  }, [_inAmount, inAmount]);

  return {
    inAmount: _inAmount,
    validate,
  };
};

const SrcTokenPanel = () => {
  const { setInAmount } = useTradeContext();
  const { inToken, setInToken, outToken } = useTradeContext();
  const [value, setValue] = useState('');
  const validations = useValidations();

  const onUpdateInAmount = useDebouncedCallback(() => setInAmount(value));

  const error = useMemo(() => {
    return validations.inAmount(value);
  }, [validations, value]);

  useEffect(() => {
    onUpdateInAmount();
  }, [onUpdateInAmount]);

  return (
    <TokenPanel
      onTokenSelect={(token) => setInToken(token.symbol)}
      token={inToken}
      value={value}
      onChange={setValue}
      isInToken={true}
      error={error}
      otherTokenSymbol={outToken?.symbol}
    />
  );
};

const DstTokenPanel = () => {
  const { formattedAmount, quotePending, outToken, setOutToken } =
    useTradeContext();

  return (
    <TokenPanel
      quotePending={quotePending}
      onTokenSelect={(token) => setOutToken(token.symbol)}
      token={outToken}
      value={formattedAmount}
    />
  );
};

const StyledPage = styled(Page)({
  background: 'white',
});

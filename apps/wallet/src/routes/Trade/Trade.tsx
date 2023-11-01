import { Box, calc, Container, Flex, useToast, VStack } from '@chakra-ui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { useDebouncedCallback, useMultiplyPriceByAmount } from '../../hooks';
import { TokenPanel } from './TokenPanel';
import BN from 'bignumber.js';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import { TradeContextProvider, useTradeContext } from './context';
import { useNavigation } from '../..//router/hooks';
import { styles } from './styles';
import { useUpdateMainButton } from '../../store/main-button-store';
import { Page } from '../../components';
import { setTwaHeader } from '@telegram-wallet-ui/twa-ui-kit';

// TODO consider changing value
const MIN_USD_VALUE_TO_SWAP = 0.5;

const useValidations = () => {
  const { inAmount, inToken } = useTradeContext();

  const _calculatedPriceUsd = useMultiplyPriceByAmount(
    inToken?.coingeckoId || 'ethereum',
    Number(inAmount ?? '0')
  );

  const _inAmount = useCallback(
    (inAmount: string) => {
      if (inAmount && inToken && new BN(inAmount).gt(inToken?.balance))
        return 'Insufficient balance';

      const calculatedPriceUsd = BN(_calculatedPriceUsd);
      if (
        BN(calculatedPriceUsd).lt(MIN_USD_VALUE_TO_SWAP) &&
        BN(calculatedPriceUsd).gt(0)
      )
        return `Minimum value to swap is $${MIN_USD_VALUE_TO_SWAP}`;
    },
    [inToken, _calculatedPriceUsd]
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

const useSubmitButton = () => {
  const { validate } = useValidations();
  const { outToken, inAmount, inToken, amountOut, quotePending } =
    useTradeContext();
  const toast = useToast();
  const tradeReview = useNavigation().tradeReview;

  const onSubmit = useCallback(() => {
    if (!inToken?.symbol || !outToken?.symbol) {
      return;
    }
    const error = validate();
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
  }, [
    validate,
    toast,
    tradeReview,
    inToken?.symbol,
    outToken?.symbol,
    inAmount,
  ]);

  useUpdateMainButton({
    text: 'Review trade',
    disabled: !inAmount || !inToken || !outToken || !amountOut || quotePending,
    onClick: onSubmit,
  });
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

const SrcTokenPanel = () => {
  const { setInAmount } = useTradeContext();
  const { inToken, setInToken, outToken } = useTradeContext();
  const [value, setValue] = useState('');
  const validations = useValidations();

  const onUpdateInAmount = useDebouncedCallback(() => setInAmount(value));

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
      error={validations.inAmount(value)}
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

export function Trade() {
  useEffect(() => {
    setTwaHeader(true);

    return () => {
      setTwaHeader(false);
    };
  }, []);

  return (
    <TradeContextProvider>
      <Page secondaryBackground>
        <Container size="sm" pt={4}>
          <TradeForm />
        </Container>
      </Page>
    </TradeContextProvider>
  );
}

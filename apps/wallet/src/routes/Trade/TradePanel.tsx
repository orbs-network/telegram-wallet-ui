import { Box, Container, Flex, useToast, VStack } from '@chakra-ui/react';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  useDebouncedCallback,
  useFormatNumber,
  useGetTokenFromList,
  useMultiplyPriceByAmount,
  useOptimizedGetMinAmountOut,
  useQuoteQuery,
  useBalances,
} from '../../hooks';
import { TokenPanel } from './TokenPanel';
import BN from 'bignumber.js';
import { HiOutlineSwitchVertical } from 'react-icons/hi';
import { useNavigation } from '../../router/hooks';
import { styles } from './styles';
import { useUpdateMainButton } from '../../store/main-button-store';
import { Page } from '../../components';
import { INSUFFICIENT_FUNDS_ERROR } from '../../consts';
import { StringParam, useQueryParam } from 'use-query-params';
import { useTradeStore } from './store';
import { amountUi } from '../../utils/conversion';
import _ from 'lodash';
import { TradeContext, useTradeContext } from './context';

// TODO consider changing value
const MIN_USD_VALUE_TO_SWAP = 0.5;

const useInitialTokens = () => {
  const { data, dataUpdatedAt } = useBalances();
  const [inTokenSymbol] = useQueryParam('inToken', StringParam);
  const store = useTradeStore();
  return useEffect(() => {
    if (!data) {
      return undefined;
    }
    const withoutInToken = _.filter(
      data,
      (it) => it.symbol !== inTokenSymbol
    );
    const tokensWithBalance = _.filter(withoutInToken, (it) =>
      new BN(it.balance).gt(0)
    );

    const sorted = _.sortBy(tokensWithBalance, (it) =>
      parseFloat(it.balance)
    ).reverse();

    const _inToken = inTokenSymbol || sorted[0]?.symbol || 'usdt';

    if (!store.inToken) store.setInToken(_inToken);
    const _outToken = sorted[1]?.symbol || 'usdc';

    if (!store.outToken)
      store.setOutToken(_outToken === _inToken ? 'btc' : _outToken);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUpdatedAt, inTokenSymbol]);
};

const useTokens = () => {
  const store = useTradeStore();

  const inToken = useGetTokenFromList(store.inToken);
  const outToken = useGetTokenFromList(store.outToken);

  return {
    inToken,
    outToken,
  };
};

const useTradeQuote = () => {
  const { inToken, outToken } = useTokens();
  const inAmount = useTradeStore().inAmount;
  const {
    data: quote,
    isLoading,
    isFetching,
  } = useQuoteQuery(inToken, outToken, inAmount);

  return {
    quote,
    isLoading,
    isFetching,
  };
};

const useOutAmount = () => {
  const quoteData = useTradeQuote();
  const { inAmount } = useTradeStore();
  const { outToken, inToken } = useTokens();

  const { estimatedAmountOut } = useOptimizedGetMinAmountOut(
    inToken,
    outToken,
    inAmount
  );

  const quoteOutAmount = quoteData.quote?.quote.outAmount;

  return useMemo(() => {
    if (!inAmount) {
      return '';
    }
    if (!quoteOutAmount) {
      return amountUi(outToken, estimatedAmountOut);
    }

    return amountUi(outToken, new BN(quoteOutAmount));
  }, [quoteOutAmount, outToken, estimatedAmountOut, inAmount]);
};

const useValidations = () => {
  const { inAmount } = useTradeStore();
  const inToken = useTokens().inToken;
  const _calculatedPriceUsd = useMultiplyPriceByAmount(
    inToken?.coingeckoId || 'ethereum',
    Number(inAmount ?? '0')
  );

  const _inAmount = useCallback(
    (inAmount: string) => {
      if (inAmount && inToken && new BN(inAmount).gt(inToken?.balance))
        return INSUFFICIENT_FUNDS_ERROR;

      const calculatedPriceUsd = BN(_calculatedPriceUsd);
      if (
        BN(calculatedPriceUsd).lt(MIN_USD_VALUE_TO_SWAP) &&
        BN(calculatedPriceUsd).gt(0)
      ) {
        return `Minimum value to swap is $${MIN_USD_VALUE_TO_SWAP}`;
      }
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
  const amountOut = useOutAmount();
  const { isFetching, isLoading } = useTradeQuote();
  const inAmount = useTradeStore().inAmount;
  const { disableMainButtonUpdate } = useTradeContext();

  const { inToken, outToken } = useTokens();
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
    disabled:
      !inAmount ||
      !inToken ||
      !outToken ||
      !Number(amountOut) ||
      isLoading ||
      isFetching,
    onClick: disableMainButtonUpdate ? undefined : onSubmit,
  });
};

const SwitchTokens = () => {
  const store = useTradeStore();
  const { inToken, outToken } = useTokens();

  const onClick = useCallback(() => {
    store.setInToken(outToken?.symbol);
    store.setOutToken(inToken?.symbol);
  }, [store, outToken?.symbol, inToken?.symbol]);

  return (
    <Flex css={styles.switchTokensContainer}>
      <Box css={styles.switchTokensButton} onClick={onClick}>
        <HiOutlineSwitchVertical />
      </Box>
    </Flex>
  );
};

const SrcTokenPanel = () => {
  const { setInAmount, inAmount } = useTradeStore();
  const store = useTradeStore();
  const { inToken, outToken } = useTokens();
  const [value, setValue] = useState(inAmount);
  const validations = useValidations();
  const timeoutRef = useRef<any>();

  const onChange = (value: string) => {
    setValue(value);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setInAmount(value);
    }, 300);
  };

  return (
    <TokenPanel
      onTokenSelect={(token) => store.setInToken(token.symbol)}
      token={inToken}
      value={value}
      onChange={onChange}
      isInToken={true}
      error={validations.inAmount(value)}
      otherTokenSymbol={outToken?.symbol}
      name="inAmountInput"
    />
  );
};

const DstTokenPanel = () => {
  const amountOut = useOutAmount();
  const { isLoading, isFetching } = useTradeQuote();
  const formattedAmount = useFormatNumber({ value: amountOut });

  const store = useTradeStore();
  const { inToken, outToken } = useTokens();
  const quotePending = isLoading || isFetching;
  return (
    <TokenPanel
      quotePending={quotePending}
      onTokenSelect={(token) => store.setOutToken(token.symbol)}
      token={outToken}
      value={formattedAmount || ''}
      filterTokenSymbol={inToken?.symbol}
      name="outAmountInput"
    />
  );
};

export function TradePanel() {
  useInitialTokens();
  const [disableMainButtonUpdate, setDisableMainButtonUpdate] = useState(false);

  return (
    <TradeContext.Provider
      value={{
        disableMainButtonUpdate,
        setDisableMainButtonUpdate: () => setDisableMainButtonUpdate(true),
      }}
    >
      <Page secondaryBackground>
        <Container size="sm" pt={4}>
          <TradeForm />
        </Container>
      </Page>
    </TradeContext.Provider>
  );
}

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

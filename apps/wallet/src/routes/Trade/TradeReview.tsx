import { Container, useToast } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Page, ReviewTx } from '../../components';
import {
  QueryKeys,
  useExchangeRate,
  useFormatNumber,
  useGetTokenFromList,
  useQuoteQuery,
  useSwapInProgress,
} from '../../hooks';
import { URLParams } from '../../types';
import { amountUi } from '../../utils/conversion';
import BN from 'bignumber.js';
import { useNavigation } from '../../router/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permit2Provider, swapProvider } from '../../config';
import { useUpdateMainButton } from '../../store/main-button-store';
import { useTradeStore } from './store';

const useSwap = () => {
  const tradeSuccess = useNavigation().tradeSuccess;
  const { outToken: outTokenSymbol } = useParams<URLParams>();

  const queryClient = useQueryClient();
  const { setProgress } = useSwapInProgress();
  const toast = useToast();

  const { quote, amountOut } = useQuote();
  return useMutation({
    mutationFn: async () => {
      setProgress(true);
      return swapProvider.swap({
        ...quote!.quote,
      });
    },
    onSuccess: (txHash) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.BALANCES] });
      tradeSuccess(outTokenSymbol!, amountOut, txHash);
    },
    onSettled: () => {
      setProgress(false);
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : error,
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    },
  });
};

const useMainButton = () => {
  const params = useParams<URLParams>();
  const inToken = useGetTokenFromList(params.inToken);
  const { mutateAsync, isPending } = useSwap();
  const { amountOut, isFetching } = useQuote();

  useEffect(() => {
    if (inToken) {
      permit2Provider.addErc20(inToken.address);
    }
  }, [inToken]);

  useUpdateMainButton({
    text: 'CONFIRM AND TRADE',
    disabled: !amountOut || !inToken || isFetching || isPending,
    onClick: mutateAsync,
  });
};

export function TradeReview() {
  useMainButton();
  const setInAmount = useTradeStore().setInAmount;

  useEffect(() => {
  setTimeout(() => {
     setInAmount('');
  }, 300);
  }, [setInAmount]);
  

  return (
    <Page>
      <Container size="sm" pt={4}>
        <ReviewTx>
          <ReviewTx.TokensDisplayContainer>
            <InTokenDisplay />
            <OutTokenDisplay />
          </ReviewTx.TokensDisplayContainer>
          <ReviewTx.Category title="Exchange Details">
            <ExchangeRate />
          </ReviewTx.Category>
          <ReviewTx.Category>
            <InTokenBalanceAfter />
            <OutTokenBalanceAfter />
          </ReviewTx.Category>
        </ReviewTx>
      </Container>
    </Page>
  );
}

const InTokenBalanceAfter = () => {
  const params = useParams<URLParams>();
  const token = useGetTokenFromList(params.inToken);

  const newBalance = useMemo(() => {
    if (!token) {
      return '';
    }
    return BN.max(
      new BN(token.balance).minus(params.inAmount ?? '0'),
      0
    ).toString();
  }, [token, params.inAmount]);

  const formattedNewBalance = useFormatNumber({ value: newBalance });
  const symbol = token?.symbolDisplay;

  return (
    <ReviewTx.Section
      title={`${symbol} Balance after`}
      value={formattedNewBalance && `${formattedNewBalance} ${symbol}`}
    />
  );
};

const OutTokenBalanceAfter = () => {
  const { amountOut } = useQuote();
  const params = useParams<URLParams>();
  const token = useGetTokenFromList(params.outToken);

  const newBalance = useMemo(() => {
    if (!token) {
      return '';
    }
    return new BN(token.balance).plus(new BN(amountOut || '')).toString();
  }, [token, amountOut]);

  const formattedNewBalance = useFormatNumber({ value: newBalance });

  const symbol = token?.symbolDisplay;

  return (
    <ReviewTx.Section
      title={`${symbol} Balance after`}
      value={formattedNewBalance && `${formattedNewBalance} ${symbol}`}
    />
  );
};

const ExchangeRate = () => {
  const params = useParams<URLParams>();
  const inToken = useGetTokenFromList(params.inToken);
  const outToken = useGetTokenFromList(params.outToken);

  const rate = useExchangeRate(params.inToken, params.outToken);
  const formattedValue = useFormatNumber({ value: rate });

  const value = `1 ${inToken?.symbolDisplay} ≈ ${formattedValue} ${outToken?.symbolDisplay}`;

  return (
    <ReviewTx.Section title="Exchange Rate" value={formattedValue && value} />
  );
};

const InTokenDisplay = () => {
  const { inToken: inTokenSymbol, inAmount } = useParams<URLParams>();

  return (
    <ReviewTx.TokenDisplay symbol={inTokenSymbol} amount={inAmount} isInToken />
  );
};

const useQuote = () => {
  const params = useParams<URLParams>();
  const inToken = useGetTokenFromList(params.inToken);
  const outToken = useGetTokenFromList(params.outToken);

  const { data: quote, isFetching } = useQuoteQuery(
    inToken,
    outToken,
    params.inAmount
  );
  const amountOut = useMemo(() => {
    if (!outToken || !quote?.quote.outAmount) {
      return '';
    }
    return amountUi(outToken, new BN(quote?.quote.outAmount || ''));
  }, [outToken, quote?.quote.outAmount]);

  return {
    quote,
    amountOut,
    isFetching,
  };
};

const OutTokenDisplay = () => {
  const { outToken: outTokenSymbol } = useParams<URLParams>();
  const { amountOut, isFetching } = useQuote();

  return (
    <ReviewTx.TokenDisplay
      isRefetching={isFetching}
      symbol={outTokenSymbol}
      amount={amountOut}
    />
  );
};

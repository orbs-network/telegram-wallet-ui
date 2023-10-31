import { Container } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Page, ReviewTx } from '../../components';
import {
  QueryKeys,
  useExchangeRate,
  useFormatNumber,
  useGetTokenFromList,
  useQuoteQuery,
} from '../../hooks';
import { URLParams, SwapSuccesss } from '../../types';
import { amountUi } from '../../utils/conversion';
import BN from 'bignumber.js';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { useNavigation } from '../../router/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { permit2Provider, swapProvider } from '../../config';

const useSwap = () => {
  const tradeSuccess = useNavigation().tradeSuccess;
  const { outToken: outTokenSymbol } = useParams<URLParams>();

  const queryClient = useQueryClient();

  const { quote, amountOut } = useQuote();
  return useMutation({
    mutationFn: async () => {
      const result = await swapProvider.swap({
        ...quote!.quote,
      });

      if ('error' in result) {
        throw new Error(result.error.error);
      }

      return (result as SwapSuccesss).txHash;
    },
    onSuccess: (txHash) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeys.USER_DATA] });
      tradeSuccess(outTokenSymbol!, amountOut, txHash);
    },
  });
};

const useMainButton = () => {
  const { onSetButton, resetButton } = useMainButtonContext();
  const { amountOut } = useQuote();
  const params = useParams<URLParams>();
  const { mutate, isPending } = useSwap();
  const inToken = useGetTokenFromList(params.inToken);

  useEffect(() => {
    if (inToken) {
      permit2Provider.addErc20(inToken.address);
    }
  }, [inToken]);

  useEffect(() => {
    onSetButton({
      text: 'Confirm and swap',
      progress: isPending,
      disabled: !amountOut || !inToken,
      onClick: () => mutate(),
    });
  }, [onSetButton, mutate, isPending, inToken, amountOut, resetButton]);
};

export function TradeReview() {
  useMainButton();
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
    return new BN(token.balance)
      .minus(new BN(params.inAmount || ''))
      .toString();
  }, [token, params.inAmount]);

  const formattedNewBalance = useFormatNumber({ value: newBalance });
  const symbol = token?.symbol.toUpperCase();

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

  const symbol = token?.symbol.toUpperCase();

  return (
    <ReviewTx.Section
      title={`${symbol} Balance after`}
      value={formattedNewBalance && `${formattedNewBalance} ${symbol}`}
    />
  );
};

const ExchangeRate = () => {
  const params = useParams<URLParams>();

  const rate = useExchangeRate(params.inToken, params.outToken);
  const formattedValue = useFormatNumber({ value: rate });

  const value = `1 ${params.inToken?.toUpperCase()} ≈ ${formattedValue} ${params.outToken?.toUpperCase()}`;

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

  const { data: quote } = useQuoteQuery(inToken, outToken, params.inAmount);
  const amountOut = useMemo(() => {
    if (!outToken || !quote?.quote.outAmount) {
      return '';
    }
    return amountUi(outToken, new BN(quote?.quote.outAmount || ''));
  }, [outToken, quote?.quote.outAmount]);

  return {
    quote,
    amountOut,
  };
};

const OutTokenDisplay = () => {
  const { outToken: outTokenSymbol } = useParams<URLParams>();
  const { amountOut } = useQuote();

  return <ReviewTx.TokenDisplay symbol={outTokenSymbol} amount={amountOut} />;
};

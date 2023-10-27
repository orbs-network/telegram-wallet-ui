import { QuoteResponse, TokenData } from '../../types';
import { swapProvider, coinsProvider } from '../../config';
import { debounceAsync } from '../../lib/hooks/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';

const debouncedQuote = debounceAsync(
  async (inAmount: string, inToken: TokenData, outToken: TokenData) => {
    try {
      const resp = await swapProvider.quote({
        inAmount: coinsProvider.toRawAmount(inToken, inAmount),
        inToken: inToken.address,
        outToken: outToken.address,
      });
      return resp;
    } catch (err) {
      console.error('Quote Error:', err);
    }
  },
  600
);

type FetchLHQuote = {
  key: string;
  srcAmount: string;
  srcToken: TokenData | undefined;
  dstToken: TokenData | undefined;
  enabled?: boolean;
};

export function useFetchLHQuote({
  key,
  srcAmount,
  srcToken,
  dstToken,
  enabled = true,
}: FetchLHQuote) {
  return useQuery({
    queryKey: [key],
    queryFn: async () => {
      try {
        if (srcAmount === '' || !srcToken || !dstToken) {
          return;
        }

        // Then fetch LH quote
        const resp = await debouncedQuote(srcAmount, srcToken, dstToken);

        if (!resp) {
          throw new Error('No quote');
        }

        return resp;
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
    enabled,
    refetchInterval: 10000,
  });
}

type Swap = {
  key: string;
};

export function useSwap({ key }: Swap) {
  return useMutation({
    mutationKey: [key],
    mutationFn: async (quote: QuoteResponse | undefined) => {
      try {
        if (!quote) {
          return;
        }

        await swapProvider.swap(quote);
      } catch (err) {
        console.error(err);
        throw err;
      }
    },
  });
}

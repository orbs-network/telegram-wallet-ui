import { useQuery } from '@tanstack/react-query';
import { LiquihubQuote, QuoteResponse, TokenData } from '../../types';
import { bn6 } from '@defi.org/web3-candies';
import { swapProvider } from '../../config';

export const QUOTE_REFETCH_INTERVAL = 15 * 1000;

type QuoteQueryProps = {
  inAmount: string;
  inToken: TokenData | undefined;
  outToken: TokenData | undefined;
  enabled?: boolean;
};

export function useQuoteQuery({
  inAmount,
  inToken,
  outToken,
  enabled,
}: QuoteQueryProps) {
  return useQuery<
    { quote: LiquihubQuote & QuoteResponse } & { isAboveMin: boolean }
  >({
    queryKey: ['quote'],
    queryFn: async (): Promise<
      { quote: LiquihubQuote & QuoteResponse } & { isAboveMin: boolean }
    > => {
      try {
        if (!inToken || !outToken) {
          throw new Error('Invalid token');
        }

        const resp = await swapProvider.quote({
          inAmount: bn6(inAmount),
          inToken: inToken.address,
          outToken: outToken.address,
        });
        return resp;
      } catch (err) {
        console.error('Quote Error:', err);
        throw err;
      }
    },
    enabled,
    refetchInterval: QUOTE_REFETCH_INTERVAL,
  });
}

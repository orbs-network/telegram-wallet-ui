import { forwardRef, useMemo } from 'react';
import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { Select, SelectProps } from '@chakra-ui/react';

type TokenSelectProps = SelectProps & {
  filterTokens?: string[];
};

export const TokenSelect = forwardRef<HTMLSelectElement, TokenSelectProps>(
  ({ filterTokens, ...props }, ref) => {
    const { data: userData } = useUserData();

    const tokens = useMemo(() => {
      if (!userData?.tokens) {
        return [];
      }

      return Object.values(userData?.tokens)
        .filter((token) =>
          filterTokens ? !filterTokens?.includes(token.symbol) : true
        )
        .sort((a, b) => {
          if (BN(a.balance).gt(b.balance)) {
            return -1;
          }
          if (BN(b.balance).gt(a.balance)) {
            return 1;
          }
          return 0;
        });
    }, [filterTokens, userData?.tokens]);

    return (
      <Select {...props} ref={ref}>
        {tokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbolDisplay}
          </option>
        ))}
      </Select>
    );
  }
);

import { forwardRef, useMemo } from 'react';
import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { Select, SelectProps } from '@chakra-ui/react';

export const TokenSelect = forwardRef<HTMLSelectElement, SelectProps>(
  (props, ref) => {
    const userData = useUserData();

    const tokens = useMemo(() => {
      if (!userData?.data?.tokens) {
        return [];
      }

      return Object.values(userData?.data?.tokens).sort((a, b) => {
        if (BN(a.balance).gt(b.balance)) {
          return -1;
        }
        if (BN(b.balance).gt(a.balance)) {
          return 1;
        }
        return 0;
      });
    }, [userData?.data?.tokens]);

    return (
      <Select {...props} ref={ref}>
        {tokens.map((token) => (
          <option key={token.symbol} value={token.symbol}>
            {token.symbol.toUpperCase()}
          </option>
        ))}
      </Select>
    );
  }
);

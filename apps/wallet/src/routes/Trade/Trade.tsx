import { Container } from '@chakra-ui/react';
import { BackButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks';
import BN from 'bignumber.js';
import { useMemo } from 'react';
import { TradeForm } from './TradeForm';

export function Trade() {
  const navigate = useNavigate();
  const { data: userData } = useUserData();

  const defaultValues = useMemo(() => {
    if (!userData?.tokens) {
      return {
        inAmount: '',
        outAmount: '',
        inToken: '',
        outToken: '',
      };
    }

    const tokens = Object.values(userData?.tokens)
      .filter((token) => BN(token.balance).gt(0))
      .sort((a, b) => {
        if (BN(a.balance).gt(b.balance)) {
          return -1;
        }
        if (BN(b.balance).gt(a.balance)) {
          return 1;
        }
        return 0;
      })
      .slice(0, 2);

    if (tokens.length < 2) {
      tokens.push(userData?.tokens.usdc);
      tokens.push(userData?.tokens.weth);
    }

    return {
      inAmount: '',
      outAmount: '',
      inToken: tokens[0].symbol,
      outToken: tokens[1].symbol,
    };
  }, [userData?.tokens]);

  return (
    <Container size="sm" pt={4}>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <TradeForm defaultValues={defaultValues} tokens={userData?.tokens} />
    </Container>
  );
}

import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { TokensList } from './TokensList';
import { useNavigation } from '../router/hooks';
import styled from '@emotion/styled';

export function TokenBalances() {
  const {asset} = useNavigation()
  const { data: userData } = useUserData();
  // filter out zero balances and at least show usdt
  const tokenBalances = !userData?.tokens ? undefined :  Object.values(userData.tokens).filter(
    (token) => token.symbol === 'usdc' || !BN(token.balance).eq(0)
  );

  return (
    <StyledTokensList
      tokens={tokenBalances}
      onSelect={(token) => asset(token.symbol)}
    />
  );
}



const StyledTokensList = styled(TokensList)`
  gap: 15px;
  `
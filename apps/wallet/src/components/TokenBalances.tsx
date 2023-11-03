import { useUserData } from '../hooks';
import BN from 'bignumber.js';
import { TokensList } from './TokensList';
import { useNavigation } from '../router/hooks';
import styled from '@emotion/styled';

export function TokenBalances() {
  const { asset } = useNavigation();
  const { data: userData } = useUserData();
  // filter out zero balances and at least show usdt
  const tokenBalances = !userData?.tokens
    ? undefined
    : Object.values(userData.tokens).filter(
        (token) => token.symbol === 'usdt' || !BN(token.balance).eq(0)
      );

  return (
    <>
      <StyledTokensList
        tokens={tokenBalances}
        onSelect={(token) => asset(token.symbol)}
      />
      <StyledTokensList
        tokens={[
          {
            coingeckoId: 'ton-coin',
            name: 'Toncoin',
            symbol: 'TON',
            logoURI:
              'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
            balance: '0',
            balanceBN: new BN(0),
            symbolDisplay: 'TON',
            address: '',
            decimals: 9,
          },
        ]}
        onSelect={() => {
          // none
        }}
      />
    </>
  );
}

// coingeckoId: string;
//   logoURI: string;
//   name: string;
// }

// export type TokenData = {
//   balance: string;
//   balanceBN: BN;
//   symbolDisplay: string;

const StyledTokensList = styled(TokensList)`
  gap: 15px;
`;

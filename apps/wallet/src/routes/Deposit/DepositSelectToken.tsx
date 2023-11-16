import { Container } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Page, PageHeading, TokensList } from '../../components';
import { useBalances } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { TokenData } from '../../types';
import { disabledTokens, useInitialize } from '../../config';
import { useParams } from 'react-router-dom';
import { balancesAsList } from '../../utils/utils';

export function DepositSelectToken() {
  const { data } = useBalances();
  const { method } = useParams<{ method: string }>();
  const { depositBuy, depositCrypto } = useNavigation();
  const config = useInitialize();

  const onSelect = (token: TokenData) => {
    config!.faucetProvider.setProofErc20(token.address);
    config!.permit2Provider.addErc20(token.address);

    if (method === 'buy') {
      depositBuy(token.symbol);
    } else {
      depositCrypto(token.symbol);
    }
  };
  const { resetButton } = useMainButtonStore();

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  return (
    <Page>
      <Container size="sm" pt={4}>
        <PageHeading>Choose asset to deposit</PageHeading>
        <TokensList
          showMoreBtn={true}
          onSelect={onSelect}
          tokens={balancesAsList(data || {})}
          mode="select"
          disabledTokens={disabledTokens}
        />
      </Container>
    </Page>
  );
}

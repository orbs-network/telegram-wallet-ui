import { Container, Heading, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Page, SelectToken } from '../../components';
import { useUserData } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { TokenData } from '../../types';
import { faucetProvider, permit2Provider } from '../../config';
import { useParams } from 'react-router-dom';

export function DepositSelectToken() {
  const { data } = useUserData();
  const { method } = useParams<{ method: string }>();
  const { depositBuy, depositCrypto } = useNavigation();

  const onSelect = (token: TokenData) => {
    faucetProvider.setProofErc20(token.address);
    permit2Provider.addErc20(token.address);

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
        <VStack spacing={6} alignItems="stretch">
          <Heading as="h1" size="md" textAlign="center">
            Choose asset to deposit
          </Heading>
          <SelectToken
            onSelect={onSelect}
            tokens={Object.values(data?.tokens || {})}
          />
        </VStack>
      </Container>
    </Page>
  );
}

import { Container, Heading, VStack } from '@chakra-ui/react';
import { Page, SelectToken } from '../../components';
import { faucetProvider } from '../../config';
import { useUserData } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { TokenData } from '../../types';

export function DepositSelectToken() {
  const { data } = useUserData();
  const { depositSelectMethod } = useNavigation();

  const onSelect = (token: TokenData) => {
    faucetProvider.setProofErc20(token.address);
    depositSelectMethod(token.symbol);
  };

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

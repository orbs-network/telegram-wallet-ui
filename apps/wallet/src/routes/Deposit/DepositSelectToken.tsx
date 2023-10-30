import { Container, Heading, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Page, SelectToken } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { useUserData } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { TokenData } from '../../types';

export function DepositSelectToken() {
  const { data } = useUserData();
  const { depositSelectMethod } = useNavigation();
  const { resetButton } = useMainButtonContext();

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  const onSelect = (token: TokenData) => depositSelectMethod(token.symbol);

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

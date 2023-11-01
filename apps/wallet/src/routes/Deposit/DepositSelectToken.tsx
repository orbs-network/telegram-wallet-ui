import { Container, Heading, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { Page, SelectToken } from '../../components';
import { useUserData } from '../../hooks';
import { useNavigation } from '../../router/hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { TokenData } from '../../types';

export function DepositSelectToken() {
  const { data } = useUserData();
  const { depositSelectMethod } = useNavigation();

  const onSelect = (token: TokenData) => depositSelectMethod(token.symbol);
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

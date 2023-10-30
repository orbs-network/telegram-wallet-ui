import { Container, Heading, VStack } from '@chakra-ui/react';
import { Page, SelectToken } from '../../components';
import { useNavigation } from '../../router/hooks';
import { useUserData } from '../../hooks';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { useEffect } from 'react';

export function Withdraw() {
  const { withdrawAddress } = useNavigation();
  const { data } = useUserData();
  const { resetButton } = useMainButtonContext();


  useEffect(() => {
    resetButton();
  }, [resetButton]);


  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={6} alignItems="stretch">
          <Heading as="h1" size="md" textAlign="center">
            Choose asset to withdraw
          </Heading>
          <SelectToken
            tokens={Object.values(data?.tokens || {})}
            onSelect={(token) => withdrawAddress(token.symbol)}
          />
        </VStack>
      </Container>
    </Page>
  );
}

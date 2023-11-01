import { Container, Heading, VStack } from '@chakra-ui/react';
import { Page, SelectToken } from '../../components';
import { useNavigation } from '../../router/hooks';
import { useUserData } from '../../hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { useEffect } from 'react';
export function Withdraw() {
  const { withdrawAddress } = useNavigation();
  const { data } = useUserData();

  const { resetButton } = useMainButtonStore();

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
            tokens={Object.values(data?.tokens || {}).filter((t) =>
              t.balanceBN.gt(0)
            )}
            onSelect={(token) => withdrawAddress(token.symbol)}
          />
        </VStack>
      </Container>
    </Page>
  );
}

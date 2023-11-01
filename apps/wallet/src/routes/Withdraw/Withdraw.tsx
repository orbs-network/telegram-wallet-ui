import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import { Page, SelectToken } from '../../components';
import { useNavigation } from '../../router/hooks';
import { useUserData } from '../../hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { useEffect, useMemo } from 'react';

export function Withdraw() {
  const { withdrawAddress, deposit } = useNavigation();
  const { data } = useUserData();

  const { resetButton, setButton } = useMainButtonStore();

  const tokens = useMemo(() => {
    return Object.values(data?.tokens || {}).filter((t) => t.balanceBN.gt(0));
  }, [data?.tokens]);

  useEffect(() => {
    if (tokens.length === 0) {
      setButton({
        text: 'Deposit',
        onClick: () => {
          deposit();
        },
      });
    } else {
      resetButton();
    }
  }, [deposit, resetButton, setButton, tokens.length]);

  return (
    <Page>
      <Container size="sm" pt={4}>
        {tokens.length === 0 ? (
          <VStack>
            <Heading as="h1" size="md" textAlign="center">
              You have no funds to withdraw
            </Heading>
            <Text>Deposit now to trade and withdraw</Text>
          </VStack>
        ) : (
          <VStack spacing={6} alignItems="stretch">
            <Heading as="h1" size="md" textAlign="center">
              Choose asset to withdraw
            </Heading>
            <SelectToken
              tokens={tokens}
              onSelect={(token) => withdrawAddress(token.symbol)}
            />
          </VStack>
        )}
      </Container>
    </Page>
  );
}

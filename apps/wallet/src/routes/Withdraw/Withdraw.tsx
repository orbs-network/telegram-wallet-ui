import { Container, Heading, Text, VStack } from '@chakra-ui/react';
import { Page, PageHeading, TokensList } from '../../components';
import { useNavigation } from '../../router/hooks';
import { useBalances } from '../../hooks';
import { useMainButtonStore } from '../../store/main-button-store';
import { useEffect, useMemo } from 'react';

export function Withdraw() {
  const { withdrawAddress, deposit } = useNavigation();
  const { data } = useBalances();

  const { resetButton, setButton } = useMainButtonStore();

  const tokens = useMemo(() => {
    return Object.values(data || {}).filter((t) => t.balanceBN.gt(0));
  }, [data]);

  useEffect(() => {
    if (tokens.length === 0) {
      setButton({
        text: 'Deposit',
        onClick: () => {
          resetButton();
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
            <PageHeading>You have no funds to withdraw</PageHeading>
            <Text>Deposit now to trade and withdraw</Text>
          </VStack>
        ) : (
          <VStack spacing={6} alignItems="stretch">
            <PageHeading>Choose asset to withdraw</PageHeading>
            <TokensList
              tokens={tokens}
              onSelect={(token) => withdrawAddress(token.symbol)}
              mode="select"
            />
          </VStack>
        )}
      </Container>
    </Page>
  );
}

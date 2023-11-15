import { VStack, Box, Container } from '@chakra-ui/react';
import { TotalBalance, setTwaBg } from '@telegram-wallet-ui/twa-ui-kit';
import { MainActionMenu, Page, TokenBalances } from '../components';
import { useFormatNumber, usePortfolioUsdValue } from '../hooks';
import { TransactionHistory } from '../components/TransactionHistory';
import { useMainButtonStore } from '../store/main-button-store';
import { useEffect } from 'react';
import { ErrorPage } from '../ErrorPage';
import { useEventsProvider } from '../lib/EventsProvider';
import { DepositOptions } from '../components/DepositOptions';

export function Home() {
  const { resetButton } = useMainButtonStore();

  const events = useEventsProvider();

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  useEffect(() => {
    setTwaBg(false);
  }, []);

  const { data: usdValue, error } = usePortfolioUsdValue();

  const primaryAmount = useFormatNumber({
    value: usdValue || 0,
  });

  if (error) {
    return <ErrorPage message={error.message} />;
  }

  return (
    <Page>
      <Container pt={8}>
        <VStack spacing={4} alignItems="stretch">
          <VStack spacing={3.5}>
            <TotalBalance
              currencySymbol="$"
              amount={primaryAmount}
              label="Total balance"
            />
            <MainActionMenu />
          </VStack>
          <TokenBalances />
        </VStack>
      </Container>
      <Box mt={4}>
        {events.length > 0 && <TransactionHistory />}
        {events.length === 0 && <DepositOptions />}
      </Box>
    </Page>
  );
}

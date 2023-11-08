import { Container, VStack, Box } from '@chakra-ui/react';
import { TotalBalance, setTwaBg } from '@telegram-wallet-ui/twa-ui-kit';
import {
  MainActionMenu,
  Page,
  TokenBalances,
  WalletSpinner,
} from '../components';
import { useFormatNumber, usePortfolioUsdValue } from '../hooks';
import { faucetProvider, permit2Provider } from '../config';
import { TransactionHistory } from '../components/TransactionHistory';
import { useMainButtonStore } from '../store/main-button-store';
import { useEffect } from 'react';
import { ErrorPage } from '../ErrorPage';
import { useEventsProvider } from '../lib/EventsProvider';
import { DepositOptions } from '../components/DepositOptions';

// Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
permit2Provider.pollPermit2Approvals();

// Polls until the current selected erc20 was transferred to this account
faucetProvider.requestIfNeeded();

export function Home() {
  const { resetButton } = useMainButtonStore();

  const events = useEventsProvider();

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  useEffect(() => {
    const staticLoader = document.querySelector('.loader-container');
    staticLoader?.parentNode?.removeChild(staticLoader);
    setTwaBg(false);
  }, []);

  const { data: usdValue, error } = usePortfolioUsdValue();

  const primaryAmount = useFormatNumber({
    value: usdValue || 0,
  });

  if (usdValue === null && error === null) {
    return (
      <Container
        size="sm"
        style={{
          height: '100%',
          position: 'relative',
        }}
      >
        <WalletSpinner />
      </Container>
    );
  }

  if (error) {
    <ErrorPage message={error.message} />;
  }

  return (
    <Page>
      <Container size="sm" pt={8}>
        <VStack spacing={4} alignItems="stretch">
          <VStack spacing={4}>
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

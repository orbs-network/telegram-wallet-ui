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
import { Transactions } from '../components/Transactions';
import { useMainButtonStore } from '../store/main-button-store';
import { useEffect } from 'react';
import Twa from '@twa-dev/sdk';
import { ErrorPage } from '../ErrorPage';

// Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
permit2Provider.pollPermit2Approvals();

// Polls until the current selected erc20 was transferred to this account
faucetProvider.requestIfNeeded();

export function Home() {
  const { resetButton } = useMainButtonStore();

  useEffect(() => {
    setTwaBg(false);
  }, []);

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  const { data: usdValue, error } = usePortfolioUsdValue();

  const primaryAmount = useFormatNumber({
    value: usdValue || 0,
  });

  if (usdValue === null && error === null) {
    return (
      <Container
        size="sm"
        style={{
          height: Twa.viewportStableHeight || window.innerHeight,
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
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch">
          <VStack spacing={3}>
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
        <Transactions />
      </Box>
    </Page>
  );
}

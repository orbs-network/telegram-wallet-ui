import { Container, HStack, VStack, Box } from '@chakra-ui/react';
import {
  IconButtonWithLabel,
  TotalBalance,
  setTwaBg,
} from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { Page, TokenBalances, WalletSpinner } from '../components';
import { useFormatNumber, usePortfolioUsdValue } from '../hooks';
import { faucetProvider, permit2Provider } from '../config';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Transactions } from '../components/Transactions';
import { useMainButtonStore } from '../store/main-button-store';
import { useEffect } from 'react';
import Twa from '@twa-dev/sdk';

// Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
permit2Provider.pollPermit2Approvals();

// Polls until the current selected erc20 was transferred to this account
faucetProvider.requestIfNeeded();

function handleClick() {
  if (!Twa.isExpanded) {
    Twa.expand();
  }

  Twa.HapticFeedback.impactOccurred('heavy');
}

export function Home() {
  const { resetButton } = useMainButtonStore();

  useEffect(() => {
    setTwaBg(false);
  }, []);

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  const usdValue = usePortfolioUsdValue();

  const primaryAmount = useFormatNumber({
    value: usdValue || 0,
  });

  if (usdValue === null) {
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

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch">
          <Box>
            <TotalBalance
              currencySymbol="$"
              amount={primaryAmount}
              label="Total balance"
            />
            <HStack
              justifyContent="center"
              alignItems="center"
              spacing={2}
              pt={2}
            >
              <Link to="/deposit" onClick={handleClick}>
                <IconButtonWithLabel
                  Icon={BiSolidDownArrowCircle}
                  label="Deposit"
                />
              </Link>
              <Link to="/withdraw" onClick={handleClick}>
                <IconButtonWithLabel
                  Icon={BiSolidUpArrowCircle}
                  label="Withdraw"
                />
              </Link>
              <Link to="/trade" onClick={handleClick}>
                <IconButtonWithLabel
                  Icon={MdSwapHorizontalCircle}
                  label="Trade"
                />
              </Link>
            </HStack>
          </Box>
          <TokenBalances />
        </VStack>
      </Container>
      <Box mt={4}>
        <Transactions />
      </Box>
    </Page>
  );
}

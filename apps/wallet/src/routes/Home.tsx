import { Container, HStack, VStack } from '@chakra-ui/react';
import {
  Balance,
  IconButtonWithLabel,
  setTwaHeader,
} from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { Page, TokenBalances } from '../components';
import { useFormatNumber, usePortfolioUsdValue } from '../hooks';
import { faucetProvider, permit2Provider } from '../config';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Transactions } from '../components/Transactions';
import { useMainButtonStore } from '../store/main-button-store';
import { useEffect } from 'react';

// Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
permit2Provider.pollPermit2Approvals();

// Polls until the current selected erc20 was transferred to this account
faucetProvider.requestIfNeeded();

const TotalUSDAmount = () => {
  const usdValue = usePortfolioUsdValue();

  const primaryAmount = useFormatNumber({
    value: usdValue,
  });

  return (
    <Balance
      primaryCurrencySymbol="$"
      primaryAmount={primaryAmount || '0'}
      label="Total balance"
    />
  );
};

export function Home() {
  const { resetButton } = useMainButtonStore();

  useEffect(() => {
    setTwaHeader(false);
  }, []);

  useEffect(() => {
    resetButton();
  }, [resetButton]);

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch">
          <TotalUSDAmount />
          <HStack justifyContent="center" alignItems="center" spacing={2}>
            <Link to="/deposit">
              <IconButtonWithLabel
                Icon={BiSolidDownArrowCircle}
                label="Deposit"
              />
            </Link>
            <Link to="/withdraw">
              <IconButtonWithLabel
                Icon={BiSolidUpArrowCircle}
                label="Withdraw"
              />
            </Link>
            <Link to="/trade">
              <IconButtonWithLabel
                Icon={MdSwapHorizontalCircle}
                label="Trade"
              />
            </Link>
          </HStack>
          <TokenBalances />
          <Transactions />
        </VStack>
      </Container>
    </Page>
  );
}

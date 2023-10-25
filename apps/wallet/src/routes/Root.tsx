import { Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { TokenBalances } from '../components';
import { useUserData } from '../hooks';
import { networks } from '@defi.org/web3-candies';
import { amountUi } from '../utils/conversion';
import BN from 'bignumber.js';
import { faucetProvider, isMumbai, web3Provider } from '../config';
import { useEffect } from 'react';
import { Permit2Provider } from '../lib/Permit2Provider';
import { LocalStorageProvider } from '../lib/LocalStorageProvider';

// Temp - USDC
const TODO_TEMP_ERC20_REPLACE = isMumbai
  ? '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23'
  : '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';

const permit2Provider = new Permit2Provider(
  web3Provider,
  new LocalStorageProvider()
);

permit2Provider.addErc20(TODO_TEMP_ERC20_REPLACE);

export function Root() {
  const { data: userData } = useUserData();

  useEffect(() => {
    // Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
    permit2Provider.pollPermit2Approvals();

    // Polls until the current selected erc20 was transferred to this account
    faucetProvider.requestIfNeeded(TODO_TEMP_ERC20_REPLACE);
  }, []);

  return (
    <Container size="sm" pt={4}>
      <VStack spacing={4} alignItems="stretch">
        {/* TODO: convert total assets amounts to USD and display */}
        <Balance
          primaryCurrencySymbol={networks.poly.native.symbol}
          primaryAmount={Number(
            amountUi(networks.poly.native, BN(userData?.balance || '0'))
          ).toFixed(3)}
          label="Total balance"
          isPrimaryCrypto
        />
        <HStack justifyContent="center" alignItems="center" spacing={2}>
          <Link to="/deposit">
            <IconButtonWithLabel
              Icon={BiSolidDownArrowCircle}
              label="Deposit"
            />
          </Link>
          <Link to="/withdraw">
            <IconButtonWithLabel Icon={BiSolidUpArrowCircle} label="Withdraw" />
          </Link>
          <Link to="/trade">
            <IconButtonWithLabel Icon={MdSwapHorizontalCircle} label="Trade" />
          </Link>
        </HStack>
        <TokenBalances />
      </VStack>
    </Container>
  );
}

import { Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { Page, TokenBalances } from '../components';
import { useUserData } from '../hooks';
import { networks } from '@defi.org/web3-candies';
import { amountUi } from '../utils/conversion';
import BN from 'bignumber.js';
import { faucetProvider, isMumbai, permit2Provider } from '../config';
import { MdSwapVerticalCircle } from 'react-icons/md';

// Temp - USDC
const TODO_TEMP_ERC20_REPLACE = isMumbai
  ? '0x0FA8781a83E46826621b3BC094Ea2A0212e71B23'
  : '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';

permit2Provider.addErc20(TODO_TEMP_ERC20_REPLACE);

// Checks periodically for non-permit2-approved erc20s and issues TXNs for approval as needed
permit2Provider.pollPermit2Approvals();

// Polls until the current selected erc20 was transferred to this account
faucetProvider.requestIfNeeded();

// TODO(sukh) - set this whenever the user selects on the deposit flow
faucetProvider.setProofErc20(TODO_TEMP_ERC20_REPLACE);

export function Home() {
  const { data: userData } = useUserData();

  return (
    <Page>
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
              <IconButtonWithLabel
                Icon={BiSolidUpArrowCircle}
                label="Withdraw"
              />
            </Link>
            <Link to="/trade">
              <IconButtonWithLabel Icon={MdSwapVerticalCircle} label="Trade" />
            </Link>
          </HStack>
          <TokenBalances />
        </VStack>
      </Container>
    </Page>
  );
}

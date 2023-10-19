import {
  Box,
  Container,
  HStack,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import {
  Balance,
  Card,
  DataDisplayItem,
  IconButtonWithLabel,
} from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { CryptoAssetIcon } from '../components';
import { useUserData } from '../hooks';
import { networks } from '@defi.org/web3-candies';
import { amountUi } from '../utils/conversion';
import BN from 'bignumber.js';

export function Root() {
  const userData = useUserData();

  return (
    <Container size="sm" pt={4}>
      <VStack spacing={4}>
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
        <Link to="/asset/matic" style={{ width: '100%' }}>
          <Card>
            <DataDisplayItem
              StartIconSlot={
                // TODO: replace with real asset icon - create asset icons in ui kit
                <CryptoAssetIcon asset="MATIC" />
              }
              StartTextSlot={
                <Box>
                  <Heading as="h3" variant="bodyTitle">
                    Polygon
                  </Heading>
                  <Text variant="hint">8.86888 MATIC</Text>
                </Box>
              }
              EndTextSlot={
                <Heading as="h3" variant="bodyTitle">
                  <Text as="span" fontWeight="normal" color="gray.500">
                    $
                  </Text>
                  4.63
                </Heading>
              }
            />
          </Card>
        </Link>
      </VStack>
    </Container>
  );
}

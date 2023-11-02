import { Avatar, Box, Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { Page, WalletSpinner } from '../components';
import { CryptoAsset } from '../config';
import {
  useFormatNumber,
  useMultiplyPriceByAmount,
  useUserData,
} from '../hooks';
import { ROUTES } from '../router/routes';
import { Transactions } from '../components/Transactions';

function Loader() {
  return (
    <Container size="sm" height="100vh" position="relative">
      <WalletSpinner />
    </Container>
  );
}

export function Asset() {
  const { assetId } = useParams<{ assetId: CryptoAsset }>();

  const { data: userData } = useUserData();
  const tokenData = assetId && userData?.tokens[assetId.toUpperCase()];
  const price = useMultiplyPriceByAmount(
    tokenData?.coingeckoId,
    tokenData?.balance
  );

  const fiatAmount = useFormatNumber({
    value: price || '0',
    decimalScale: 2,
  });

  const balance = useFormatNumber({
    value: tokenData?.balance,
    decimalScale: 5,
  });

  if (!assetId) {
    return <Loader />;
  }

  if (!tokenData) {
    return <Loader />;
  }

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={2}>
          <Avatar
            name={tokenData.symbol}
            src={tokenData.logoURI}
            colorScheme="telegram"
          />

          <Balance
            secondaryCurrencyCode={tokenData?.symbolDisplay}
            secondaryAmount={balance || '0'}
            primaryCurrencySymbol="$"
            primaryAmount={fiatAmount || '0'}
            label={`${tokenData.name} balance`}
          />
          <HStack justifyContent="center" alignItems="center" spacing={2}>
            <Link
              to={`${ROUTES.depositSelectMethod.replace(
                ':assetId',
                tokenData.symbol
              )}`}
            >
              <IconButtonWithLabel
                Icon={BiSolidDownArrowCircle}
                label="Deposit"
              />
            </Link>
            <Link
              to={ROUTES.withdrawAddress.replace(':assetId', tokenData.symbol)}
            >
              <IconButtonWithLabel
                Icon={BiSolidUpArrowCircle}
                label="Withdraw"
              />
            </Link>
            <Link to={`/trade?inToken=${tokenData.symbol}`}>
              <IconButtonWithLabel
                Icon={MdSwapHorizontalCircle}
                label="Trade"
              />
            </Link>
          </HStack>
        </VStack>
      </Container>
      <Box mt={4}>
        <Transactions tokenFilter={tokenData.symbol} />
      </Box>
    </Page>
  );
}

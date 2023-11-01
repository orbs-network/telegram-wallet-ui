import { Avatar, Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { Page, WalletSpinner } from '../components';
import { CryptoAsset } from '../config';
import { useFormatNumber, useUserData } from '../hooks';
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
        <VStack spacing={4}>
          <Avatar
            name={tokenData.symbol}
            src={tokenData.logoURI}
            colorScheme="telegram"
          />

          <Balance
            primaryCurrencySymbol={tokenData?.symbol.toUpperCase()}
            primaryAmount={balance || '0'}
            label={`${tokenData.name} balance`}
            isPrimaryCrypto
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
          <Transactions tokenFilter={tokenData.symbol} />
        </VStack>
      </Container>
    </Page>
  );
}

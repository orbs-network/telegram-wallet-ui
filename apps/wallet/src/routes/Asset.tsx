import { Avatar, Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Page, Transactions, WalletSpinner } from '../components';
import { mockTransactions } from '../mocks/transactions';
import { CryptoAsset } from '../config';
import { useFormatNumber, useUserData } from '../hooks';

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
  const tokenData = assetId &&  userData?.tokens[assetId];

  const balance = useFormatNumber({ value: tokenData?.balance, decimalScale: 5 });

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
          <Transactions transactions={mockTransactions} cryptoAsset={assetId} />
        </VStack>
      </Container>
    </Page>
  );
}

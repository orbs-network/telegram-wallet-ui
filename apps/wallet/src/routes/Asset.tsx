import { Avatar, Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Page, Transactions, WalletSpinner } from '../components';
import { mockTransactions } from '../mocks/transactions';
import { CryptoAsset } from '../config';
import { useUserData } from '../hooks';

function Loader() {
  return (
    <Container size="sm" height="100vh" position="relative">
      <WalletSpinner />
    </Container>
  );
}

export function Asset() {
  const { assetId } = useParams<{ assetId: CryptoAsset }>();

  const userData = useUserData();

  if (!assetId) {
    return <Loader />;
  }

  const tokenData = userData?.tokens[assetId];

  if (!tokenData) {
    return <Loader />;
  }

  return (
    <Page>
      <VStack spacing={4}>
        {assetId && <Avatar name={assetId} />}
        <Balance
          primaryCurrencySymbol={tokenData?.symbol.toUpperCase()}
          primaryAmount={tokenData.balance}
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
            <IconButtonWithLabel Icon={BiSolidUpArrowCircle} label="Withdraw" />
          </Link>
          <Link to="/trade">
            <IconButtonWithLabel Icon={MdSwapHorizontalCircle} label="Trade" />
          </Link>
        </HStack>
        <Transactions transactions={mockTransactions} cryptoAsset={assetId} />
      </VStack>
    </Page>
  );
}

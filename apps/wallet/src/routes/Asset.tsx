import { Container, HStack, VStack } from '@chakra-ui/react';
import { Balance, IconButtonWithLabel } from '@telegram-wallet-ui/twa-ui-kit';
import { BiSolidDownArrowCircle, BiSolidUpArrowCircle } from 'react-icons/bi';
import { MdSwapHorizontalCircle } from 'react-icons/md';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BackButton } from '@twa-dev/sdk/react';
import { CryptoAssetIcon, Transactions } from '../components';
import { mockTransactions } from '../mocks/transactions';
import { CryptoAsset } from '../config';

export function Asset() {
  const navigate = useNavigate();
  const { assetId } = useParams<{ assetId: CryptoAsset }>();
  const cryptoAsset = assetId
    ? (assetId.toUpperCase() as CryptoAsset)
    : 'MATIC';

  return (
    <Container size="sm" pt={4}>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <VStack spacing={4}>
        {assetId && <CryptoAssetIcon asset={cryptoAsset} />}
        <Balance
          primaryCurrencySymbol="$"
          primaryAmount="4.63"
          label="MATIC balance"
          secondaryAmount="8.86888"
          secondaryCurrencyCode="MATIC"
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
        <Transactions
          transactions={mockTransactions}
          cryptoAsset={cryptoAsset}
        />
      </VStack>
    </Container>
  );
}

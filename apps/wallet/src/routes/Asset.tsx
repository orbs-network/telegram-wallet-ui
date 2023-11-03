import { Avatar, Box, Container, VStack } from '@chakra-ui/react';
import { Balance } from '@telegram-wallet-ui/twa-ui-kit';
import { useParams } from 'react-router-dom';
import { CoinActionMenu, Page, WalletSpinner } from '../components';
import {
  useFormatNumber,
  useMultiplyPriceByAmount,
  useUserData,
} from '../hooks';
import { Transactions } from '../components/Transactions';

function Loader() {
  return (
    <Container size="sm" height="100vh" position="relative">
      <WalletSpinner />
    </Container>
  );
}

export function Asset() {
  const { assetId } = useParams<{ assetId: string }>();

  const { data: userData } = useUserData();
  const tokenData = assetId ? userData?.tokens[assetId.toUpperCase()] : null;
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
          <CoinActionMenu tokenSymbol={assetId} />
        </VStack>
      </Container>
      <Box mt={4}>
        <Transactions tokenFilter={tokenData.symbol} />
      </Box>
    </Page>
  );
}

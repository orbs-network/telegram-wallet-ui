import { Avatar, Box, Container, VStack } from '@chakra-ui/react';
import { Balance } from '@telegram-wallet-ui/twa-ui-kit';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Transactions } from '../components/Transactions';
import { CoinActionMenu, Page, WalletSpinner } from '../components';
import {
  useFormatNumber,
  useMultiplyPriceByAmount,
  useUserData,
} from '../hooks';
import { useMainButtonStore } from '../store/main-button-store';
import { motion } from 'framer-motion';

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

  // Ensure bottom button is not shown on asset page
  const { resetButton } = useMainButtonStore();
  useEffect(() => {
    resetButton();
  }, [resetButton]);

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
          <motion.div
            style={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              delay: 0.5,
              bounce: 0.6,
            }}
          >
            <Avatar
              name={tokenData.symbol}
              src={tokenData.logoURI}
              colorScheme="telegram"
            />
          </motion.div>

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

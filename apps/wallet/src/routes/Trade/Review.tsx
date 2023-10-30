import {
  Avatar,
  Box,
  Button,
  Container,
  Heading,
  VStack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { BackButton, MainButton } from '@twa-dev/sdk/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Page } from '../../components';
import { TradeFormSchema } from './schema';
import Twa from '@twa-dev/sdk';
import { ListItem, Card } from '@telegram-wallet-ui/twa-ui-kit';
import { useMultiplyPriceByAmount, useUserData } from '../../hooks';
import { useCallback, useEffect, useState } from 'react';
import { useFetchLHQuote, useSwap } from './hooks';
import { css, keyframes } from '@emotion/react';
import { amountUi } from '../../utils/conversion';
import BN from 'bignumber.js';
import { ROUTES } from '../../router/routes';

const flash = keyframes`
  0% {
    opacity: 0.1;
  }

  100% {
    opacity: 1;
  }
`;

const outAmountStyles = css`
  animation: ${flash} 1s linear;
`;

export function Review() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data: userData } = useUserData();
  const {
    inAmount,
    inToken,
    outToken,
    outAmount: initOutAmount,
  } = state as TradeFormSchema;
  const [outAmount, setOutAmount] = useState(initOutAmount);
  const [newOutAmount, setNewOutAmount] = useState(false);

  const srcToken = userData?.tokens[inToken];
  const dstToken = userData?.tokens[outToken];

  const { data: quoteData, isFetching } = useFetchLHQuote({
    key: ['fetchTradeQuote', inAmount],
    srcAmount: inAmount,
    srcToken,
    dstToken,
  });
  const { mutateAsync } = useSwap({
    key: 'swap',
  });

  const toast = useToast();

  const executeSwap = useCallback(() => {
    try {
      if (quoteData?.quote) {
        mutateAsync(quoteData.quote, {
          onSuccess: () => {
            navigate(ROUTES.tradeSuccess);
          },
        });
      }
    } catch (err) {
      console.error(err);
      let message = 'Something went wrong';

      if (err instanceof Error) {
        message = err.message;
      }

      toast({
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [mutateAsync, navigate, quoteData?.quote, toast]);

  useEffect(() => {
    if (isFetching) {
      setNewOutAmount(false);
    }
  }, [isFetching]);

  useEffect(() => {
    if (quoteData?.quote.outAmount) {
      setNewOutAmount(true);
      setOutAmount(amountUi(dstToken, BN(quoteData?.quote.outAmount)));
    }
  }, [dstToken, quoteData?.quote.outAmount]);

  const usdPrice = useMultiplyPriceByAmount(
    srcToken?.coingeckoId || 'ethereum',
    Number(inAmount)
  );

  const exchangeRate = BN(outAmount).div(inAmount).toString();

  return (
    <Page>
      <Container size="sm" pt={4}>
        <BackButton
          onClick={() => {
            navigate(-1);
          }}
        />
        <VStack alignItems="stretch" spacing={8}>
          <Card>
            <VStack alignItems="flex-start" style={{ width: '100%' }}>
              <ListItem
                StartIconSlot={<Avatar src={srcToken?.logoURI} />}
                StartTextSlot={
                  <Box>
                    <Text variant="hint">You pay</Text>
                    <Heading as="h3" variant="bodyTitle">
                      {inAmount} {inToken.toUpperCase()}
                    </Heading>
                  </Box>
                }
              />
              <ListItem
                StartIconSlot={<Avatar src={dstToken?.logoURI} />}
                StartTextSlot={
                  <Box>
                    <Text variant="hint">You receive</Text>

                    <Heading
                      css={newOutAmount ? outAmountStyles : undefined}
                      as="h3"
                      variant="bodyTitle"
                    >
                      {outAmount} {outToken.toUpperCase()}
                    </Heading>
                  </Box>
                }
              />
            </VStack>
          </Card>

          <Box>
            <Text variant="hint">EXCHANGE DETAILS</Text>
            <Card>
              <VStack alignItems="flex-start" style={{ width: '100%' }}>
                <ListItem
                  StartTextSlot={
                    <Box>
                      <Text variant="hint">Exchange Rate</Text>
                      <Heading
                        css={newOutAmount ? outAmountStyles : undefined}
                        as="h3"
                        variant="bodyTitle"
                      >
                        1 {inToken.toUpperCase()} ≈ {exchangeRate}{' '}
                        {outToken.toUpperCase()}
                      </Heading>
                    </Box>
                  }
                />
                <ListItem
                  StartTextSlot={
                    <Box>
                      <Text variant="hint">Fiat Equivalent</Text>

                      <Heading as="h3" variant="bodyTitle">
                        ≈ ${BN(usdPrice).toFixed(2)}
                      </Heading>
                    </Box>
                  }
                />
              </VStack>
            </Card>
          </Box>

          <Card>
            <VStack alignItems="flex-start" style={{ width: '100%' }}>
              <ListItem
                StartTextSlot={
                  <Box>
                    <Text variant="hint">
                      {inToken.toUpperCase()} Balance After
                    </Text>
                    <Heading as="h3" variant="bodyTitle">
                      {BN(srcToken?.balance || 0)
                        .minus(inAmount)
                        .toString()}{' '}
                      {inToken.toUpperCase()}
                    </Heading>
                  </Box>
                }
              />
              <ListItem
                StartTextSlot={
                  <Box>
                    <Text variant="hint">
                      {outToken.toUpperCase()} Balance After
                    </Text>

                    <Heading
                      css={newOutAmount ? outAmountStyles : undefined}
                      as="h3"
                      variant="bodyTitle"
                    >
                      {BN(dstToken?.balance || 0)
                        .plus(outAmount)
                        .toString()}{' '}
                      {outToken.toUpperCase()}
                    </Heading>
                  </Box>
                }
              />
            </VStack>
          </Card>

          {!Twa.isVersionAtLeast('6.0.1') && (
            <Button
              variant="primary"
              isDisabled={isFetching}
              isLoading={isFetching}
              onClick={executeSwap}
            >
              Confirm and Trade
            </Button>
          )}
        </VStack>

        <MainButton
          text="Confirm and Trade"
          onClick={executeSwap}
          progress={isFetching}
          disabled={isFetching}
        />
      </Container>
    </Page>
  );
}

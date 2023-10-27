import {
  VStack,
  HStack,
  IconButton,
  Icon,
  Text,
  Container,
  Box,
  Avatar,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { MdSwapVerticalCircle } from 'react-icons/md';
import { TradeFormSchema } from './schema';
import { TokenData } from '../../types';
import BN from 'bignumber.js';
import {
  CryptoAmountInput,
  TokenSelect,
  WalletSpinner,
} from '../../components';
import { useEffect, useState } from 'react';
import { MainButton } from '@twa-dev/sdk/react';
import { Button, colors } from '@telegram-wallet-ui/twa-ui-kit';
import Twa from '@twa-dev/sdk';
import { css, keyframes } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useFetchLHQuote } from './hooks';
import { amountUi } from '../../utils/conversion';

export const QUOTE_REFETCH_INTERVAL = 10 * 1000;

const flash = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.1;
  }

  100% {
    opacity: 1;
  }
`;

const outAmountStyles = css`
  animation: ${flash} 1s linear;
`;

type TradeFormProps = {
  defaultValues: TradeFormSchema;
  tokens: Record<string, TokenData> | undefined;
};

export function TradeForm({ defaultValues, tokens }: TradeFormProps) {
  const [inToken, setInToken] = useState(defaultValues.inToken);
  const [outToken, setOutToken] = useState(defaultValues.outToken);
  const [inAmount, setInAmount] = useState(defaultValues.inAmount);
  const [outAmount, setOutAmount] = useState(defaultValues.outAmount);
  const [inError, setInError] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!tokens) {
      return;
    }

    const value = BN(inAmount);

    if (value.lte(0)) {
      setInError('Please enter a positive amount');
      return;
    }

    if (value.gt(tokens[inToken].balance)) {
      setInError('Insufficient funds');
      return;
    }

    setInError(undefined);
  }, [inAmount, inToken, tokens]);

  const navigate = useNavigate();
  const onSubmit = () => {
    navigate(ROUTES.tradeReview, {
      state: {
        inAmount,
        inToken,
        outAmount,
        outToken,
      },
    });
  };

  const { data: quoteData, isFetching: fetchingQuote } = useFetchLHQuote({
    key: ['fetchQuote', inAmount],
    srcAmount: inAmount,
    srcToken: tokens && tokens[inToken],
    dstToken: tokens && tokens[outToken],
    enabled: inAmount !== '' && BN(inAmount).gt(0),
    refetchInterval: QUOTE_REFETCH_INTERVAL,
  });

  useEffect(() => {
    if (quoteData?.quote && tokens) {
      setOutAmount(amountUi(tokens[outToken], BN(quoteData.quote.outAmount)));
    }
  }, [quoteData?.quote, tokens, outToken]);

  const toast = useToast();

  if (!tokens) {
    return (
      <Container size="sm" height="100vh" position="relative">
        <WalletSpinner />
      </Container>
    );
  }

  return (
    <VStack alignItems="stretch" spacing={8}>
      <VStack alignItems="stretch">
        <HStack justifyContent="space-between">
          <HStack>
            <Avatar
              src={tokens[inToken] && tokens[inToken].logoURI}
              size="sm"
            />
            <Text>You pay</Text>
          </HStack>
          <Text size="sm">
            Max: {tokens[inToken] ? tokens[inToken].balance : '0.00'}{' '}
            <Text as="span" variant="hint">
              {tokens[inToken] && tokens[inToken].symbol.toUpperCase()}
            </Text>
          </Text>
        </HStack>
        <HStack>
          <Box>
            <CryptoAmountInput
              hideSymbol
              name="inAmount"
              value={inAmount}
              tokenSymbol={inToken}
              onChange={(value) => {
                const quote = async () => {
                  try {
                    if (!tokens) {
                      throw new Error('No tokens');
                    }

                    setInAmount(value);
                  } catch (err) {
                    console.error(err);
                    toast({
                      description: 'Failed to get quote',
                      status: 'error',
                      duration: 3000,
                    });
                  }
                };
                quote();
              }}
            />
            {inError && <Text color="red">{inError}</Text>}
          </Box>

          <TokenSelect
            name="inToken"
            value={inToken}
            onChange={(e) => {
              setInToken(e.target.value);
            }}
          />
        </HStack>
        {/* <Text>
          {inPrice && inAmount !== ''
            ? `≈ $${BN(inPrice).multipliedBy(inAmount).toFixed(2)}`
            : `1 ${
                tokens[inToken] && tokens[inToken].symbol.toUpperCase()
              } ≈ $${inPrice?.toFixed(2)}`}
        </Text> */}
      </VStack>

      <HStack justifyContent="flex-end">
        <Divider variant="thick" />
        <IconButton
          aria-label="Switch"
          width="auto"
          backgroundColor="transparent"
          isRound
          icon={
            <Icon
              as={MdSwapVerticalCircle}
              fontSize="5xl"
              color={colors.button_color}
            />
          }
          onClick={() => {
            setInToken(outToken);
            setOutToken(inToken);
          }}
        />
      </HStack>

      <VStack alignItems="stretch">
        <HStack>
          <Avatar
            src={tokens[outToken] && tokens[outToken].logoURI}
            size="sm"
          />
          <Text>You receive</Text>
        </HStack>
        <HStack>
          <Box css={fetchingQuote ? outAmountStyles : undefined}>
            <CryptoAmountInput
              hideSymbol
              name="outAmount"
              value={outAmount}
              editable={false}
              tokenSymbol={outToken}
            />
          </Box>
          <TokenSelect
            name="outToken"
            value={outToken}
            filterTokens={[inToken]}
            onChange={(e) => {
              setOutToken(e.target.value);
            }}
          />
        </HStack>

        {/* <Text>
          {outPrice && outAmount !== ''
            ? `≈ $${BN(outPrice).multipliedBy(outAmount).toFixed(2)}`
            : `1 ${
                tokens[outToken] && tokens[outToken].symbol.toUpperCase()
              } ≈ $${outPrice?.toFixed(2)}`}
        </Text> */}
      </VStack>
      {!Twa.isVersionAtLeast('6.0.1') && (
        <Button
          variant="primary"
          isDisabled={fetchingQuote || Boolean(inError)}
          isLoading={fetchingQuote}
          loadingText="Updating Quote"
          onClick={onSubmit}
        >
          Review Trade
        </Button>
      )}
      <MainButton
        text={fetchingQuote ? 'Updating Quote' : 'Review Trade'}
        disabled={fetchingQuote || Boolean(inError)}
        onClick={onSubmit}
        progress={fetchingQuote}
      />
    </VStack>
  );
}

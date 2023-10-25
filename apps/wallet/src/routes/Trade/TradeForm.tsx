import {
  VStack,
  HStack,
  Input,
  IconButton,
  Icon,
  Text,
  Container,
  FormControl,
  FormErrorMessage,
  Spinner,
  Box,
} from '@chakra-ui/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { MdSwapVerticalCircle } from 'react-icons/md';
import { useFetchLatestPrice } from '../../hooks';
import { TradeFormSchema } from './schema';
import { TokenData } from '../../types';
import BN from 'bignumber.js';
import { Countdown, TokenSelect, WalletSpinner } from '../../components';
import { useCallback, useEffect, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MainButton } from '@twa-dev/sdk/react';
import { Button } from '@telegram-wallet-ui/twa-ui-kit';
import Twa from '@twa-dev/sdk';
import { debounceAsync } from '../../lib/hooks/useDebounce';
import { coinsProvider, swapProvider } from '../../config';
import { bn6 } from '@defi.org/web3-candies';
import { QUOTE_REFETCH_INTERVAL } from './queries';

const debouncedQuote = debounceAsync(
  async (inAmount: string, inToken: TokenData, outToken: TokenData) => {
    try {
      const resp = await swapProvider.quote({
        inAmount: bn6(inAmount),
        inToken: inToken.address,
        outToken: outToken.address,
      });
      return resp;
    } catch (err) {
      console.error('Quote Error:', err);
    }
  },
  300
);

type TradeFormProps = {
  defaultValues: TradeFormSchema;
  tokens: Record<string, TokenData> | undefined;
};

export function TradeForm({ defaultValues, tokens }: TradeFormProps) {
  const schema = yup.object().shape({
    inAmount: yup
      .string()
      .required('Amount is required')
      .test((value, ctx) => {
        if (!value || !tokens) {
          return false;
        }

        const inAmount = BN(value);

        if (inAmount.eq(0)) {
          return ctx.createError({
            message: 'Please enter a positive amount',
          });
        }

        if (inAmount.gt(tokens[ctx.parent.inToken].balance)) {
          return ctx.createError({
            message: 'Insufficient balance',
          });
        }

        return true;
      }),
    outAmount: yup
      .string()
      .required('Amount is required')
      .test((value, ctx) => {
        if (!value || !tokens) {
          return false;
        }

        const outAmount = BN(value);

        if (outAmount.eq(0)) {
          return ctx.createError({
            message: 'Please enter a positive amount',
          });
        }

        return true;
      }),
    inToken: yup.string().required('Token is required'),
    outToken: yup.string().required('Token is required'),
  });

  const form = useForm<TradeFormSchema>({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    // if defaultValues change, reset the form
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const { register, handleSubmit, watch, formState } = form;
  const inToken = watch('inToken');
  const outToken = watch('outToken');
  const inAmount = watch('inAmount');
  const outAmount = watch('outAmount');

  const onSubmit: SubmitHandler<TradeFormSchema> = (data) => console.log(data);

  const { data: inPrice } = useFetchLatestPrice(
    tokens && tokens[inToken] ? tokens[inToken].coingeckoId : undefined
  );
  const { data: outPrice } = useFetchLatestPrice(
    tokens && tokens[outToken] ? tokens[outToken].coingeckoId : undefined
  );

  const [fetchingQuote, setFetchingQuote] = useState(false);
  const [shouldFetchQuoteInterval, setShouldFetchQuoteInterval] =
    useState(false);

  // console.log('shouldFetchQuoteInterval', shouldFetchQuoteInterval);

  // const { data: quoteIntervalData, isFetching } = useQuoteQuery({
  //   inAmount: inAmount,
  //   inToken: tokens ? tokens[inToken] : undefined,
  //   outToken: tokens ? tokens[outToken] : undefined,
  //   enabled: shouldFetchQuoteInterval,
  // });

  // useEffect(() => {
  //   if (quoteIntervalData && tokens) {
  //     form.setValue(
  //       'outAmount',
  //       BN(quoteIntervalData.quote.outAmount)
  //         .dividedBy(Math.pow(10, tokens[outToken].decimals))
  //         .toString(),
  //       {
  //         shouldDirty: true,
  //         shouldTouch: true,
  //       }
  //     );
  //   }
  // }, [quoteIntervalData, form, tokens, outToken]);

  const fetchLHQuote = useCallback(
    async (inValue: string) => {
      try {
        if (!tokens) {
          throw new Error('No tokens');
        }

        setFetchingQuote(true);

        // Then fetch LH quote
        const resp = await debouncedQuote(
          inValue,
          tokens[inToken],
          tokens[outToken]
        );

        if (!resp) {
          throw new Error('No quote');
        }

        form.setValue(
          'outAmount',
          BN(resp.quote.outAmount)
            .dividedBy(Math.pow(10, tokens[outToken].decimals))
            .toString()
        );
      } catch (err) {
        console.error(err);
      } finally {
        setFetchingQuote(false);
      }
    },
    [form, inToken, outToken, tokens]
  );

  if (!tokens) {
    return (
      <Container size="sm" height="100vh" position="relative">
        <WalletSpinner />
      </Container>
    );
  }

  console.log('disabled', !formState.isValid);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="stretch">
        <HStack justifyContent="space-between">
          <div>
            You pay {tokens[inToken] && tokens[inToken].symbol.toUpperCase()}
          </div>
          <Text size="sm">
            Max: {tokens[inToken] ? tokens[inToken].balance : '0.00'}{' '}
            <Text as="span" variant="hint">
              {tokens[inToken] && tokens[inToken].symbol.toUpperCase()}
            </Text>
          </Text>
        </HStack>
        <HStack>
          <FormControl isInvalid={Boolean(formState.errors.inAmount)}>
            <Input
              id="inAmount"
              {...register('inAmount')}
              onChange={(e) => {
                const quote = async () => {
                  try {
                    if (!tokens) {
                      throw new Error('No tokens');
                    }

                    // Get estimated out amount first
                    const estimatedOutAmount =
                      await coinsProvider.getMinAmountOut(
                        tokens[inToken],
                        tokens[outToken],
                        bn6(e.target.value)
                      );
                    form.setValue(
                      'outAmount',
                      estimatedOutAmount
                        .dividedBy(Math.pow(10, tokens[outToken].decimals))
                        .toString(),
                      { shouldDirty: true, shouldTouch: true }
                    );

                    // Then fetch LH quote
                    fetchLHQuote(e.target.value);
                    setShouldFetchQuoteInterval(true);
                  } catch (err) {
                    console.error(err);
                  }
                };
                quote();
              }}
              placeholder="0.00"
              type="number"
            />
            <FormErrorMessage>
              {formState.errors.inAmount?.message}
            </FormErrorMessage>
          </FormControl>
          <Controller
            control={form.control}
            name="inToken"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={Boolean(fieldState.error)}>
                <TokenSelect
                  {...field}
                  onChange={(e) => {
                    form.resetField('inAmount');
                    form.resetField('outAmount');
                    form.setValue('inToken', e.target.value);
                    setShouldFetchQuoteInterval(false);
                  }}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
        </HStack>
        <Text>
          {inPrice && inAmount !== ''
            ? `≈ $${BN(inPrice).multipliedBy(inAmount).toFixed(2)}`
            : `1 ${
                tokens[inToken] && tokens[inToken].symbol.toUpperCase()
              } ≈ $${inPrice?.toFixed(2)}`}
        </Text>

        <IconButton
          aria-label="Switch"
          icon={<Icon as={MdSwapVerticalCircle} />}
          onClick={() => {
            const values = form.getValues();

            form.reset(
              {
                inToken: values.outToken,
                inAmount: values.outAmount,
                outToken: values.inToken,
                outAmount: values.inAmount,
              },
              { keepDirty: true, keepTouched: true }
            );
          }}
        />
        <HStack>
          <Text size="2xl">
            You receive{' '}
            {tokens[outToken] && tokens[outToken].symbol.toUpperCase()}
          </Text>
        </HStack>
        <HStack>
          {shouldFetchQuoteInterval && (
            <Countdown
              seconds={QUOTE_REFETCH_INTERVAL / 1000}
              onAsyncComplete={async () => {
                await fetchLHQuote(inAmount);
              }}
            />
          )}

          {fetchingQuote && (
            <Box>
              <Spinner />
            </Box>
          )}

          <Input
            id="outAmount"
            {...register('outAmount')}
            contentEditable={false}
            // onChange={(e) => {
            //   if (outPrice) {
            //     const outAmountInUsd = BN(outPrice).multipliedBy(
            //       e.target.value
            //     );

            //     form.setValue(
            //       'inAmount',
            //       BN(outAmountInUsd)
            //         .dividedBy(inPrice || 0)
            //         .toString(),
            //       { shouldDirty: true, shouldTouch: true }
            //     );
            //   }
            // }}
            placeholder="0.00"
            type="number"
          />
          <Controller
            control={form.control}
            name="outToken"
            render={({ field, fieldState }) => (
              <FormControl isInvalid={Boolean(fieldState.error)}>
                <TokenSelect
                  {...field}
                  filterTokens={[inToken]}
                  onChange={(e) => {
                    form.resetField('inAmount');
                    form.resetField('outAmount');
                    form.setValue('outToken', e.target.value);
                    setShouldFetchQuoteInterval(false);
                  }}
                />
                <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
              </FormControl>
            )}
          />
        </HStack>

        <Text>
          {outPrice && outAmount !== ''
            ? `≈ $${BN(outPrice).multipliedBy(outAmount).toFixed(2)}`
            : `1 ${
                tokens[outToken] && tokens[outToken].symbol.toUpperCase()
              } ≈ $${outPrice?.toFixed(2)}`}
        </Text>

        {!Twa.isVersionAtLeast('6.0.1') && (
          <Button
            variant="primary"
            isDisabled={!formState.isValid}
            type="submit"
            isLoading={formState.isSubmitting}
          >
            Review Trade
          </Button>
        )}

        <MainButton
          text="Review Trade"
          disabled={!formState.isValid}
          onClick={handleSubmit(onSubmit)}
          progress={formState.isSubmitting}
        />
      </VStack>
    </form>
  );
}

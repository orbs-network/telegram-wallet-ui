import {
  VStack,
  HStack,
  IconButton,
  Icon,
  Text,
  Container,
  FormControl,
  FormErrorMessage,
  Box,
  Avatar,
  Divider,
  useToast,
  Drawer,
  Flex,
  DrawerContent,
  DrawerOverlay,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { MdSwapVerticalCircle } from 'react-icons/md';
import { TradeFormSchema } from './schema';
import { TokenData } from '../../types';
import BN from 'bignumber.js';
import { BiSolidChevronRight } from 'react-icons/bi';


import {
  CryptoAmountInput,
  SelectToken,
  TokenSelect,
  WalletSpinner,
} from '../../components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MainButton } from '@twa-dev/sdk/react';
import { Button, colors } from '@telegram-wallet-ui/twa-ui-kit';
import Twa from '@twa-dev/sdk';
import { debounceAsync } from '../../lib/hooks/useDebounce';
import { coinsProvider, swapProvider } from '../../config';
import { useCountdown } from '../../lib/hooks/useCountdown';
import { css, keyframes } from '@emotion/react';
import { useUserData } from '../../hooks';
import styled from '@emotion/styled';

export const QUOTE_REFETCH_INTERVAL = 15 * 1000;

const debouncedEstimate = debounceAsync(
  async (inAmount: string, inToken: TokenData, outToken: TokenData) => {
    return await coinsProvider.getMinAmountOut(
      inToken,
      outToken,
      coinsProvider.toRawAmount(inToken, inAmount)
    );
  },
  600
);

const debouncedQuote = debounceAsync(
  async (inAmount: string, inToken: TokenData, outToken: TokenData) => {
    try {
      const resp = await swapProvider.quote({
        inAmount: coinsProvider.toRawAmount(inToken, inAmount),
        inToken: inToken.address,
        outToken: outToken.address,
      });
      return resp;
    } catch (err) {
      console.error('Quote Error:', err);
    }
  },
  600
);

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

  const quote = async (value: string) => {
    try {
      if (!tokens) {
        throw new Error('No tokens');
      }

      form.setValue('inAmount', value, {
        shouldDirty: true,
        shouldTouch: true,
        shouldValidate: true,
      });

      // Get estimated out amount first
      const estimatedOutAmount = await debouncedEstimate(
        value,
        tokens[inToken],
        tokens[outToken]
      );

      if (estimatedOutAmount.eq(0)) {
        throw new Error('Estimated out amount is 0');
      }

      form.setValue(
        'outAmount',
        estimatedOutAmount
          .dividedBy(Math.pow(10, tokens[outToken].decimals))
          .toString(),
        { shouldDirty: true, shouldTouch: true }
      );

      // Then fetch LH quote
      await fetchLHQuote(value, tokens[inToken], tokens[outToken]);
      reset();
      start();
    } catch (err) {
      console.error(err);
      // TODO: show toast
      toast({
        description: 'Failed to get quote',
        status: 'error',
        duration: 5000,
      });
    }
  };

  useEffect(() => {
    // if defaultValues change, reset the form
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const { handleSubmit, watch, formState } = form;
  const inToken = watch('inToken');
  const outToken = watch('outToken');
  const inAmount = watch('inAmount');
  const outAmount = watch('outAmount');

  const onSubmit: SubmitHandler<TradeFormSchema> = (data) => console.log(data);

  const [fetchingQuote, setFetchingQuote] = useState(false);

  const fetchLHQuote = useCallback(
    async (srcAmount: string, srcToken: TokenData, dstToken: TokenData) => {
      try {
        if (srcAmount === '') {
          return;
        }

        setFetchingQuote(true);

        // Then fetch LH quote
        const resp = await debouncedQuote(srcAmount, srcToken, dstToken);

        if (!resp) {
          throw new Error('No quote');
        }

        form.setValue(
          'outAmount',
          BN(resp.quote.outAmount)
            .dividedBy(Math.pow(10, dstToken.decimals))
            .toString()
        );
      } catch (err) {
        console.error(err);
        throw err;
      } finally {
        setFetchingQuote(false);
      }
    },
    [form]
  );

  const { reset, start, stop } = useCountdown({
    seconds: QUOTE_REFETCH_INTERVAL / 1000,
    onAsyncComplete: async () => {
      if (!tokens) {
        return;
      }

      await fetchLHQuote(inAmount, tokens[inToken], tokens[outToken]);
    },
  });

  const toast = useToast();

  if (!tokens) {
    return (
      <Container size="sm" height="100vh" position="relative">
        <WalletSpinner />
      </Container>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
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
            <TokenPanel
              name="inAmount"
              value={inAmount}
              symbol={inToken}
              filterToken={outToken}
              onChange={(value) => {
                quote(value);
              }}
              onTokenSelect={(token) => {
                form.resetField('inAmount');
                form.resetField('outAmount');
                form.setValue('inToken', token.symbol);
                stop();
              }}
            />
            {/* <FormControl isInvalid={Boolean(formState.errors.inAmount)}>
              <FormErrorMessage>
                {formState.errors.inAmount?.message}
              </FormErrorMessage>
            </FormControl> */}
            {/* <Controller
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
                      stop();
                    }}
                  />
                  <FormErrorMessage>
                    {fieldState.error?.message}
                  </FormErrorMessage>
                </FormControl>
              )}
            /> */}
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
              const values = form.getValues();
              stop();

              form.reset(
                {
                  inToken: values.outToken,
                  inAmount: values.outAmount,
                  outToken: values.inToken,
                  outAmount: values.inAmount,
                },
                { keepDirty: true, keepTouched: true }
              );
              fetchLHQuote(
                values.outAmount,
                tokens[values.outToken],
                tokens[values.inToken]
              );
              reset();
              start();
            }}
          />
        </HStack>

        <VStack alignItems="stretch">
          <HStack>
            <Avatar
              src={tokens[outToken] && tokens[outToken].logoURI}
              size="sm"
            />
            <Text>You pay</Text>
          </HStack>
          <HStack>
            <Box css={fetchingQuote ? outAmountStyles : undefined}>
              <TokenPanel
                symbol={outToken}
                editable={false}
                name="outAmount"
                value={outAmount}
                filterToken={inToken}
                onTokenSelect={(token) => {
                  form.resetField('inAmount');
                  form.resetField('outAmount');
                  form.setValue('outToken', token.symbol);
                  stop();
                }}
              />
            </Box>
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

const TokenPanel = ({
  value,
  symbol,
  name,
  onChange,
  onTokenSelect,
  editable = false,
  filterToken
}: {
  value: string;
  symbol: string;
  name: string;
  onChange?: (value: string) => void;
  onTokenSelect: (token: TokenData) => void;
  editable?: boolean;
  filterToken?: string;
}) => {
  return (
    <Flex>
      <CryptoAmountInput
        hideSymbol
        name={name}
        value={value}
        tokenSymbol={symbol}
        onChange={onChange}
        editable={editable}
      />
      <TokenSelectDrawer
        filterToken={filterToken}
        onSelect={onTokenSelect}
        selected={symbol}
      />
    </Flex>
  );
};

const TokenSelectDrawer = ({
  onSelect,
  selected,
  filterToken,
}: {
  onSelect: (token: TokenData) => void;
  selected?: string;
  filterToken?: string;
}) => {
  const { data , dataUpdatedAt} = useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<any>();

  const tokens = useMemo(() => {
    if (!data) return []
      return Object.values(data.tokens).filter(
        (token) => token.symbol !== filterToken
      );
      
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterToken, dataUpdatedAt]); 

  return (
    <Flex alignItems="center">
      <TokenSelectButton ref={btnRef.current} onClick={() => setIsOpen(true)}>
        <Text>{selected ? selected?.toUpperCase() : 'Select Token'}</Text>
        <BiSolidChevronRight />
      </TokenSelectButton>
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnOverlayClick={true}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <StyledTokenList
            onSelect={(token) => {
              onSelect(token);
              setIsOpen(false);
            }}
            tokens={tokens}
          />
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};


const TokenSelectButton = styled(Box)({
  height:'auto',
  display:'flex',
  alignItems:'center',
  "& p" :{
    color:'#9D9D9D',
    fontSize:'26px',
    fontWeight: 700
  },
  svg: {
    color:'#9D9D9D',
    fontSize:'26px',
  }
})


const StyledTokenList = styled(SelectToken)({
  overflowY: 'auto',
});
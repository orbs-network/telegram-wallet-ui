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
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MdSwapVerticalCircle } from 'react-icons/md';
import { useFetchLatestPrice } from '../../hooks';
import { TradeFormSchema } from './schema';
import { TokenData } from '../../types';
import BN from 'bignumber.js';
import { WalletSpinner } from '../../components';
import { useEffect } from 'react';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { MainButton } from '@twa-dev/sdk/react';
import { Button } from '@telegram-wallet-ui/twa-ui-kit';
import Twa from '@twa-dev/sdk';

type TradeFormProps = {
  defaultValues: TradeFormSchema;
  tokens: Record<string, TokenData> | undefined;
};

export function TradeForm({ defaultValues, tokens }: TradeFormProps) {
  const schema = yup.object().shape({
    primaryAmount: yup
      .string()
      .required('Amount is required')
      .test((value, ctx) => {
        if (!value || !tokens) {
          return false;
        }

        const primaryAmount = BN(value);

        if (primaryAmount.eq(0)) {
          return ctx.createError({
            message: 'Please enter a positive amount',
          });
        }

        if (primaryAmount.gt(tokens[ctx.parent.primaryToken].balance)) {
          return ctx.createError({
            message: 'Insufficient balance',
          });
        }

        return true;
      }),
    secondaryAmount: yup
      .string()
      .required('Amount is required')
      .test((value, ctx) => {
        if (!value || !tokens) {
          return false;
        }

        const secondaryAmount = BN(value);

        if (secondaryAmount.eq(0)) {
          return ctx.createError({
            message: 'Please enter a positive amount',
          });
        }

        return true;
      }),
    primaryToken: yup.string().required('Token is required'),
    secondaryToken: yup.string().required('Token is required'),
  });

  const form = useForm<TradeFormSchema>({
    defaultValues,
    mode: 'all',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const { register, handleSubmit, watch, formState } = form;
  const primaryToken = watch('primaryToken');
  const secondaryToken = watch('secondaryToken');
  const primaryAmount = watch('primaryAmount');
  const secondaryAmount = watch('secondaryAmount');

  const onSubmit: SubmitHandler<TradeFormSchema> = (data) => console.log(data);

  const { data: primaryPrice } = useFetchLatestPrice(
    tokens && tokens[primaryToken]
      ? tokens[primaryToken].coingeckoId
      : undefined
  );
  const { data: secondaryPrice } = useFetchLatestPrice(
    tokens && tokens[secondaryToken]
      ? tokens[secondaryToken].coingeckoId
      : undefined
  );

  if (!tokens) {
    return (
      <Container size="sm" height="100vh" position="relative">
        <WalletSpinner />
      </Container>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack alignItems="stretch">
        <HStack justifyContent="space-between">
          <div>
            You pay{' '}
            {tokens[primaryToken] && tokens[primaryToken].symbol.toUpperCase()}
          </div>
          <Text size="sm">
            Max: {tokens[primaryToken] ? tokens[primaryToken].balance : '0.00'}{' '}
            <Text as="span" variant="hint">
              {tokens[primaryToken] &&
                tokens[primaryToken].symbol.toUpperCase()}
            </Text>
          </Text>
        </HStack>
        <FormControl isInvalid={Boolean(formState.errors.primaryAmount)}>
          <Input
            id="primaryAmount"
            {...register('primaryAmount')}
            onChange={(e) => {
              if (primaryPrice) {
                const primaryInUsd = BN(primaryPrice).multipliedBy(
                  e.target.value
                );

                form.setValue(
                  'secondaryAmount',
                  BN(primaryInUsd)
                    .dividedBy(secondaryPrice || 0)
                    .toString(),
                  { shouldDirty: true, shouldTouch: true }
                );
              }
            }}
            placeholder="0.00"
            type="number"
          />
          <FormErrorMessage>
            {formState.errors.primaryAmount?.message}
          </FormErrorMessage>
        </FormControl>
        <Text>
          {primaryPrice && primaryAmount !== ''
            ? `≈ $${BN(primaryPrice).multipliedBy(primaryAmount).toFixed(2)}`
            : `1 ${
                tokens[primaryToken] &&
                tokens[primaryToken].symbol.toUpperCase()
              } ≈ $${primaryPrice?.toFixed(2)}`}
        </Text>

        <IconButton
          aria-label="Switch"
          icon={<Icon as={MdSwapVerticalCircle} />}
          onClick={() => {
            const values = form.getValues();

            form.reset(
              {
                primaryToken: values.secondaryToken,
                primaryAmount: values.secondaryAmount,
                secondaryToken: values.primaryToken,
                secondaryAmount: values.primaryAmount,
              },
              { keepDirty: true, keepTouched: true }
            );
          }}
        />
        <HStack>
          <Text size="2xl">
            You receive{' '}
            {tokens[secondaryToken] &&
              tokens[secondaryToken].symbol.toUpperCase()}
          </Text>
        </HStack>
        <FormControl isInvalid={Boolean(formState.errors.secondaryAmount)}>
          <Input
            id="secondaryAmount"
            {...register('secondaryAmount')}
            onChange={(e) => {
              if (secondaryPrice) {
                const secondaryInUsd = BN(secondaryPrice).multipliedBy(
                  e.target.value
                );

                form.setValue(
                  'primaryAmount',
                  BN(secondaryInUsd)
                    .dividedBy(primaryPrice || 0)
                    .toString(),
                  { shouldDirty: true, shouldTouch: true }
                );
              }
            }}
            placeholder="0.00"
            type="number"
          />
          <FormErrorMessage>
            {formState.errors.primaryAmount?.message}
          </FormErrorMessage>
        </FormControl>
        <Text>
          {secondaryPrice && secondaryAmount !== ''
            ? `≈ $${BN(secondaryPrice)
                .multipliedBy(secondaryAmount)
                .toFixed(2)}`
            : `1 ${
                tokens[secondaryToken] &&
                tokens[secondaryToken].symbol.toUpperCase()
              } ≈ $${secondaryPrice?.toFixed(2)}`}
        </Text>

        {!Twa.isVersionAtLeast('6.0.1') && (
          <Button
            variant="primary"
            isDisabled={!formState.isValid}
            onClick={handleSubmit(onSubmit)}
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

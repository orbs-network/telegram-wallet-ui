import {
  VStack,
  HStack,
  Input,
  IconButton,
  Icon,
  Text,
  Container,
} from '@chakra-ui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { MdSwapVerticalCircle } from 'react-icons/md';
import { useFetchLatestPrice } from '../../hooks';
import { TradeFormSchema } from './schema';
import { TokenData } from '../../types';
import BN from 'bignumber.js';
import { WalletSpinner } from '../../components';
import { useEffect } from 'react';

type TradeFormProps = {
  defaultValues: TradeFormSchema;
  tokens: Record<string, TokenData> | undefined;
};

export function TradeForm({ defaultValues, tokens }: TradeFormProps) {
  const form = useForm<TradeFormSchema>({
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const { register, handleSubmit, watch } = form;
  const primaryToken = watch('primaryToken');
  const secondaryToken = watch('secondaryToken');
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
        <Input
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
                  .toString()
              );
            }
          }}
          placeholder="0.00"
        />
        <Text>
          1 {tokens[primaryToken] && tokens[primaryToken].symbol.toUpperCase()}{' '}
          = ${primaryPrice?.toFixed(2)}
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
        <Input
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
                  .toString()
              );
            }
          }}
          placeholder="0.00"
        />
        <Text>
          1{' '}
          {tokens[secondaryToken] &&
            tokens[secondaryToken].symbol.toUpperCase()}{' '}
          = ${secondaryPrice?.toFixed(2)}
        </Text>
      </VStack>
    </form>
  );
}

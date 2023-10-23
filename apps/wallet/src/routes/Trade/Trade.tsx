import {
  Container,
  HStack,
  Icon,
  IconButton,
  Input,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BackButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks';
import { MdSwapVerticalCircle } from 'react-icons/md';
import { useForm, SubmitHandler } from 'react-hook-form';

type Inputs = {
  primaryAmount: string;
  secondaryAmount: string;
  primaryToken: string;
  secondaryToken: string;
};

export function Trade() {
  const navigate = useNavigate();
  const userData = useUserData();

  const form = useForm<Inputs>({
    defaultValues: {
      primaryAmount: '0',
      secondaryAmount: '0',
      primaryToken: 'usdt',
      secondaryToken: 'eth',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => console.log(data);

  const { register, handleSubmit, watch } = form;
  const primaryToken = watch('primaryToken');
  const primaryAmount = watch('primaryAmount');
  const secondaryToken = watch('secondaryToken');
  const secondaryAmount = watch('secondaryAmount');

  return (
    <Container size="sm" pt={4}>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack alignItems="stretch">
          <HStack justifyContent="space-between">
            <div>You pay {primaryToken}</div>
            <Text size="sm">
              Max: {userData?.tokens[primaryToken].balance}{' '}
              <Text as="span" variant="hint">
                {primaryToken}
              </Text>
            </Text>
          </HStack>
          <Input {...register('primaryAmount')} />
          <IconButton
            aria-label="Switch"
            icon={<Icon as={MdSwapVerticalCircle} />}
            onClick={() => {
              const tempToken = primaryToken;
              const tempAmount = primaryAmount;
              form.setValue('primaryToken', secondaryToken);
              form.setValue('primaryAmount', secondaryAmount);
              form.setValue('secondaryToken', tempToken);
              form.setValue('secondaryAmount', tempAmount);
            }}
          />
          <HStack>
            <Text size="2xl">You receive {secondaryToken}</Text>
          </HStack>
          <Input {...register('secondaryAmount')} />
        </VStack>
      </form>
    </Container>
  );
}

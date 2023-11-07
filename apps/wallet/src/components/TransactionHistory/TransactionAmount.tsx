import { Text } from '@chakra-ui/react';
import { useFormatNumber } from '../../hooks';

type TransactionAmountProps = {
  amount: string;
};

export function TransactionAmount({ amount }: TransactionAmountProps) {
  const formattedAmount = useFormatNumber({
    value: amount,
  });
  return <Text as="span">{formattedAmount}</Text>;
}

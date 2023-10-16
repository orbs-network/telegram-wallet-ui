import { Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';

type BalanceProps = {
  label: string;
  currencySymbol: string;
  amount: number;
};

export function Balance({ label, currencySymbol, amount }: BalanceProps) {
  return (
    <Stat textAlign="center">
      <StatLabel as="label">{label}</StatLabel>
      <StatNumber fontSize="4xl">
        <Text as="span" color="gray.500">
          {currencySymbol}
        </Text>
        {amount}
      </StatNumber>
    </Stat>
  );
}

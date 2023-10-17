import { Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';

type BalanceProps = {
  label: string;
  primaryCurrencySymbol: string;
  primaryAmount: number;
  secondaryCurrencyCode?: string;
  secondaryAmount?: number;
};

export function Balance({
  label,
  primaryCurrencySymbol,
  primaryAmount,
  secondaryAmount,
  secondaryCurrencyCode,
}: BalanceProps) {
  return (
    <Stat textAlign="center">
      <StatLabel as="label">{label}</StatLabel>
      <StatNumber fontSize="4xl">
        <Text as="span" color="gray.500">
          {primaryCurrencySymbol}
        </Text>
        {primaryAmount}
      </StatNumber>
      <Text as="label" variant="hint">
        {secondaryAmount} {secondaryCurrencyCode}
      </Text>
    </Stat>
  );
}

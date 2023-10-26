import { Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

type BalanceProps = {
  label: string;
  primaryCurrencySymbol: string;
  primaryAmount: string;
  secondaryCurrencyCode?: string;
  secondaryAmount?: string;
  isPrimaryCrypto?: boolean;
};

export function Balance({
  label,
  primaryCurrencySymbol,
  primaryAmount,
  secondaryAmount,
  secondaryCurrencyCode,
  isPrimaryCrypto,
}: BalanceProps) {
  const navigate = useNavigate();
  let PrimaryAmount = (
    <>
      <Text as="span" color="gray.500" fontWeight="normal">
        {primaryCurrencySymbol}
      </Text>
      {primaryAmount}
    </>
  );

  if (isPrimaryCrypto) {
    PrimaryAmount = (
      <>
        {primaryAmount}{' '}
        <Text
          as="span"
          color="gray.500"
          fontWeight="normal"
          onDoubleClick={() => {
            console.log('dbl clicked');
            navigate('/debug');
          }}
        >
          {primaryCurrencySymbol}
        </Text>
      </>
    );
  }
  return (
    <Stat textAlign="center">
      <StatLabel as="label">{label}</StatLabel>
      <StatNumber fontSize="4xl">{PrimaryAmount}</StatNumber>
      <Text as="label" variant="hint">
        {secondaryAmount} {secondaryCurrencyCode}
      </Text>
    </Stat>
  );
}

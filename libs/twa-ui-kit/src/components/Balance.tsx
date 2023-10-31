import { Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import BN from 'bignumber.js';
import { useState, useEffect } from 'react';

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
  const [debugCounter, setDebugCounter] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (debugCounter >= 2) {
      navigate('/debug');
    }
  }, [debugCounter, navigate]);

  let PrimaryAmount = (
    <>
      <Text
        as="span"
        color="gray.500"
        fontWeight="normal"
        onDoubleClick={() => {
          console.log('dbl clicked');
          navigate('/debug');
        }}
        onTouchStart={() => {
          setDebugCounter((val: number) => val + 1);
        }}
      >
        {primaryCurrencySymbol}
      </Text>
      {BN(primaryAmount).toFixed(2)}
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
          onTouchStart={() => {
            setDebugCounter((val: number) => val + 1);
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

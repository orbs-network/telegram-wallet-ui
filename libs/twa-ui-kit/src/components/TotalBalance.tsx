import { Stat, StatLabel, StatNumber, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import BN from 'bignumber.js';
import { useState, useEffect } from 'react';
import { colors } from '../theme';

type BalanceProps = {
  label: string;
  currencySymbol: string;
  amount: string | undefined;
  isPrimaryCrypto?: boolean;
};

export function TotalBalance({
  label,
  currencySymbol,
  amount,
  isPrimaryCrypto,
}: BalanceProps) {
  const [debugCounter, setDebugCounter] = useState(0);
  const navigate = useNavigate();

  const amountDisplay =
    amount && isPrimaryCrypto
      ? amount.split('.')
      : BN(amount || 0)
          .toFixed(2)
          .split('.');

  useEffect(() => {
    if (debugCounter >= 2) {
      navigate('/debug');
    }
  }, [debugCounter, navigate]);

  let PrimaryAmount = (
    <>
      <Text
        as="span"
        color={colors.hint_color}
        fontWeight="normal"
        onDoubleClick={() => {
          console.log('dbl clicked');
          navigate('/debug');
        }}
        onTouchStart={() => {
          setDebugCounter((val: number) => val + 1);
        }}
      >
        {currencySymbol}
      </Text>
      {amountDisplay[0]}.
      <Text as="span" fontSize="4xl">
        {amountDisplay[1]}
      </Text>
    </>
  );

  if (isPrimaryCrypto) {
    PrimaryAmount = (
      <>
        {amountDisplay[0]}.
        <Text as="span" fontSize="4xl">
          {amountDisplay[1]}
        </Text>{' '}
        <Text
          as="span"
          fontSize="4xl"
          color={colors.hint_color}
          fontWeight="normal"
          onDoubleClick={() => {
            console.log('dbl clicked');
            navigate('/debug');
          }}
          onTouchStart={() => {
            setDebugCounter((val: number) => val + 1);
          }}
        >
          {currencySymbol}
        </Text>
      </>
    );
  }
  return (
    <Stat textAlign="center">
      <StatLabel as="label">{label}</StatLabel>
      <StatNumber fontSize="6xl" lineHeight="1.3">
        {PrimaryAmount}
      </StatNumber>
    </Stat>
  );
}
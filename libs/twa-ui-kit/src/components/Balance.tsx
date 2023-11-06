import {
  SkeletonText,
  Stat,
  StatLabel,
  StatNumber,
  Text,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import BN from 'bignumber.js';

type BalanceProps = {
  label: string;
  primaryCurrencySymbol: string;
  primaryAmount: string | undefined;
  secondaryCurrencyCode?: string;
  secondaryAmount?: string | undefined;
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
    <SkeletonText isLoaded={Boolean(primaryAmount)}>
      <Text
        as="span"
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
      {BN(primaryAmount || 0).toFixed(2)}
    </SkeletonText>
  );

  if (isPrimaryCrypto) {
    PrimaryAmount = (
      <SkeletonText isLoaded={Boolean(primaryAmount)}>
        {primaryAmount}{' '}
        <Text
          as="span"
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
      </SkeletonText>
    );
  }
  return (
    <Stat textAlign="center">
      <StatLabel as="label">{label}</StatLabel>
      <StatNumber fontSize="2xl">{PrimaryAmount}</StatNumber>
      <Text as="label" variant="hint">
        {secondaryAmount} {secondaryCurrencyCode}
      </Text>
    </Stat>
  );
}

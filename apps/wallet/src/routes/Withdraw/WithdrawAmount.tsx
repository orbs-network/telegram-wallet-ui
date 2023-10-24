import { Container, VStack, Text, Input, Flex } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { makeElipsisAddress } from '../../utils';
import { css } from '@emotion/react';
import { useFetchLatestPrice, useGetTokenFromList, useMultiplyPriceByAmount } from '../../hooks';

const styles = {
  input: css`
    font-size: 60px;
    height: 70px;
    padding: 0;
    background: transparent;
    border: none;
    font-weight: 700;
    &::placeholder {
      color: #e7e7e7;
      opacity: 1;
    }
  `,
  inputSymbol: css`
    font-size: 32px;
    position: relative;
    top: 0px;
    font-weight: 700;
    color: #9d9d9d;
  `,
};

export function WithdrawAmount() {
  const { assetId, recipient } = useParams<URLParams>();
  console.log(assetId, recipient);

  return (
    <Container size="sm" pt={4}>
      <VStack spacing={4} alignItems="stretch">
        <VStack>
          <Text>send to {makeElipsisAddress(recipient, 4)}</Text>
        </VStack>
        <AmountInput />
      </VStack>
    </Container>
  );
}

const AmountInput = () => {
  const [value, setValue] = useState('');
  const {assetId} = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  console.log(token);
  
  const usdPrice = useMultiplyPriceByAmount(
    token?.coingeckoId || 'ethereum',
    Number(value)
  );

  return (
    <VStack alignItems="flex-start">
      <Flex alignItems="flex-end" justifyContent="flex-start">
        <Input
          type="number"
          css={styles.input}
          placeholder="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          style={{
            width: value ? '100%' : '50px',
          }}
        />
        {!value && <Text css={styles.inputSymbol}>{token?.symbol}</Text>}
      </Flex>
      <Text>≈ ${usdPrice}</Text>
    </VStack>
  );
};

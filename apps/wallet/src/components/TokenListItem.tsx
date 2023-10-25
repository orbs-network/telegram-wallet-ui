import { Heading, Text, Avatar, Skeleton, VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import { useFormatNumber, useTokenBalanceQuery } from '../hooks';
import { Token } from '../types';

type Props = {
  token: Token;
  balance?: string;
  onClick?: () => void;
  className?: string;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
};

export function TokenListItem({
  token,
  onClick,
  className = '',
  EndIconSlot,
  selected,
}: Props) {
  const { data: balance, isLoading } = useTokenBalanceQuery(token.address);
  const formattedAmount = useFormatNumber({
    value: balance || '0',
    decimalScale: 3,
  });

  return (
    <ListItem
      selected={selected}
      className={className}
      onClick={onClick}
      StartIconSlot={<Avatar width="40px" height="40px" src={token.logoURI} />}
      EndIconSlot={EndIconSlot}
      StartTextSlot={
        <VStack alignItems="flex-start" gap="2px">
          <Heading as="h3" variant="bodyTitle">
            {token.name}
          </Heading>

          <BalanceContainer>
            {isLoading ? (
              <Skeleton
                height="13px"
                width="60px"
                borderRadius="20px"
                marginTop="2px"
              />
            ) : formattedAmount ? (
              <Text variant="hint">
                {formattedAmount} {token.symbol.toUpperCase()}
              </Text>
            ) : null}
          </BalanceContainer>
        </VStack>
      }
    />
  );
}

const BalanceContainer = styled('div')({
  height: 18,
});

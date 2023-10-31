import { Avatar, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import styled from '@emotion/styled';
import { Card, ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import _ from 'lodash';
import { useFormatNumber, useMultiplyPriceByAmount } from '../hooks';
import { TokenData, TokensListProps } from '../types';

export function TokensList({
  onSelect,
  className = '',
  tokens,
}: TokensListProps) {
  const isLoading = !tokens || _.isEmpty(tokens);

  return (
    <List className={className}>
      {isLoading ? (
        <Card>
          <TokenListItemLoader />
        </Card>
      ) : (
        _.map(tokens, (token) => {
          return (
            <TokenListItem
              balance={token.balance}
              onClick={() => onSelect(token)}
              key={token.address}
              token={token}
            />
          );
        })
      )}
    </List>
  );
}
const List = styled(VStack)({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 10,
  overflow: 'hidden',
});

type TokenListItemProps = {
  token: TokenData;
  balance?: string;
  usd?: string;
  onClick?: () => void;
  className?: string;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
};

function TokenListItem({
  token,
  onClick,
  EndIconSlot,
  selected,
}: TokenListItemProps) {
  return (
    <StyledCard className="list-item">
      <StyledListItem
        selected={selected}
        onClick={onClick}
        className="list-item-content"
        StartIconSlot={
          <Avatar width="40px" height="40px" src={token.logoURI} />
        }
        EndIconSlot={EndIconSlot}
        EndTextSlot={<USD token={token} />}
        StartTextSlot={
          <VStack alignItems="flex-start" gap="2px">
            <Heading as="h3" variant="bodyTitle">
              {token.name}
            </Heading>
            <Balance token={token} />
          </VStack>
        }
      />
    </StyledCard>
  );
}

const StyledCard = styled(Card)({
  borderRadius: '20px',
  minHeight: 'unset',
  '.chakra-card__body': {
    padding: '0px',
  },
});
const StyledListItem = styled(ListItem)({
  padding: '10px 20px 10px 16px',
});

const USD = ({ token }: { token: TokenData }) => {
  const value = useMultiplyPriceByAmount(token.coingeckoId, token.balance);
  const formattedAmount = useFormatNumber({
    value: value || '0',
    decimalScale: 2,
  });

  if (!formattedAmount) {
    return (
      <Skeleton
        height="13px"
        width="60px"
        borderRadius="20px"
        marginTop="2px"
      />
    );
  }

  return <Text size="sm">${formattedAmount}</Text>;
};

const Balance = ({ token }: { token: TokenData }) => {
  const formattedAmount = useFormatNumber({
    value: token.balance || '0',
    decimalScale: 3,
  });

  return (
    <Text variant="hint">
      {formattedAmount} {token.symbol.toUpperCase()}
    </Text>
  );
};

function TokenListItemLoader() {
  return (
    <ListItem
      StartIconSlot={<Skeleton width="40px" height="40px" borderRadius="50%" />}
      StartTextSlot={
        <VStack alignItems="flex-start" gap="5px">
          <Skeleton width="150px" height="15px" borderRadius="10px" />
          <Skeleton width="50px" height="15px" borderRadius="10px" />
        </VStack>
      }
    />
  );
}

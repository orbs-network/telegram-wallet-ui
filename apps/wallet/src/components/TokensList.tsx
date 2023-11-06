import { Avatar, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { List, ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import _ from 'lodash';
import { useFormatNumber, useMultiplyPriceByAmount } from '../hooks';
import { TokenData, TokensListProps } from '../types';

export function TokensList({
  onSelect,
  className = '',
  tokens,
  mode,
  disabledTokens,
  selected,
  css = {}
}: TokensListProps) {
  const isLoading = !tokens || _.isEmpty(tokens);
  

  return (
    <List css={css} className={className} mode={mode} isLoading={isLoading}>
      {_.map(tokens, (token) => {
        const isDisabled = disabledTokens?.includes(token.symbol);
        const isSelected = selected === token.symbol;
        return (
          <TokenListItem
            disabled={isDisabled}
            selected={isSelected}
            balance={token.balance}
            onClick={() => onSelect(token)}
            key={token.address}
            token={token}
          />
        );
      })}
    </List>
  );
}
type TokenListItemProps = {
  token: TokenData;
  balance?: string;
  usd?: string;
  onClick?: () => void;
  className?: string;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
};

function TokenListItem({
  token,
  onClick,
  EndIconSlot,
  selected,
  disabled,
}: TokenListItemProps) {
  return (
    <ListItem
      className={disabled ? `token-list-item-disabled` : ''}
      selected={selected}
      onClick={onClick}
      StartIconSlot={<Avatar width="40px" height="40px" src={token.logoURI} />}
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
  );
}

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
        borderRadius="14px"
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
      {formattedAmount} {token.symbolDisplay}
    </Text>
  );
};
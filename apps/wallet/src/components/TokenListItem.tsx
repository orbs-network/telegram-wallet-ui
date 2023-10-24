import { Heading, Box, Text, Avatar } from '@chakra-ui/react';
import { ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import { useTokenBalanceQuery } from '../hooks';
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
  const { data: balance } = useTokenBalanceQuery(token.address);

  return (
    <ListItem
      selected={selected}
      className={className}
      onClick={onClick}
      StartIconSlot={<Avatar width="40px" height="40px" src={token.logoURI} />}
      EndIconSlot={EndIconSlot}
      StartTextSlot={
        <Box>
          <Heading as="h3" variant="bodyTitle">
            {token.name}
          </Heading>
          {balance && (
            <Text variant="hint">
              {balance} {token.symbol.toUpperCase()}
            </Text>
          )}
        </Box>
      }
    />
  );
}

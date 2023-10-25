import { Flex, Skeleton, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Card } from '@telegram-wallet-ui/twa-ui-kit';
import _ from 'lodash';
import { useCoinsList } from '../hooks';
import { TokenListItem } from './TokenListItem';
import { TokenListItemLoader } from './TokenListItemLoader';

type Props = {
  onSelect: (token: string) => void;
  selected?: string;
};


export function TokensList({ onSelect, selected }: Props) {
  const { data: tokens, isLoading } = useCoinsList();

  if (isLoading) {
    return (
      <StyledCard>
        <TokenListItemLoader />
      </StyledCard>
    );
  }
  return (
    <StyledCard>
      <List>
        {tokens?.map((token) => {
          const isSelected = token.address === selected;
          return (
            <StyledTokenListItem
              selected={isSelected}
              onClick={() => onSelect(token.address)}
              key={token.address}
              token={token}
            />
          );
        })}
      </List>
    </StyledCard>
  );
}

const StyledCard = styled(Card)({
  '.chakra-card__body': {
    padding: '12px 0px',
  },
});

const StyledTokenListItem = styled(TokenListItem)({
  position: 'relative',
});

const List = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  borderRadius: 10,
  overflow: 'hidden',
});

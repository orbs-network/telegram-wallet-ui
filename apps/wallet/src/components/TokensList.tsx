import styled from '@emotion/styled';
import { Card } from '@telegram-wallet-ui/twa-ui-kit';
import { useCoinsList } from '../hooks';
import { TokenListItem } from './TokenListItem';

type Props = {
  onSelect: (token: string) => void;
  selected?: string;
};

export function TokensList({ onSelect, selected }: Props) {
  const { data: tokens, isLoading } = useCoinsList();
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

import styled from '@emotion/styled';
import { TokensListProps } from '../types';
import { TokensList } from './TokensList';
import { twaMode } from '@telegram-wallet-ui/twa-ui-kit';

export function SelectToken(props: TokensListProps) {
  return <StyledTokensList {...props} />;
}

const StyledTokensList = styled(TokensList)({
  gap: 0,
  borderRadius: 20,

  '.list-item': {
    borderRadius: 0,
    position: 'relative',
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: 0,
      left: 65,
      right: 0,
      height: 1,
      background: twaMode('#d9d9d9', '#2d2d2d'),
    },
    '&:last-child::after': {
      display: 'none',
    },
  },
});

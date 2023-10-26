import styled from '@emotion/styled';
import { TokensListProps } from '../types';
import { TokensList } from './TokensList';

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
      background: '#D9D9D9',
    },
    '&:last-child::after': {
      display: 'none',
    },
  },
});

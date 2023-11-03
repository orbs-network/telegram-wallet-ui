import { css } from '@emotion/react';
import { DataDisplayItem } from './DataDisplayItem';
import { Box, Icon, useColorMode } from '@chakra-ui/react';
import { BiCheck } from 'react-icons/bi';

import { tgColors } from '../theme';

const styles = css`
  width: 100%;
  padding: 16px 20px 14px 16px;

  &:last-child:after {
    display: none;
  }
`;

type ListItemProps = {
  StartTextSlot?: React.ReactNode;
  EndTextSlot?: React.ReactNode;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
};

export function ListItem({
  StartIconSlot,
  StartTextSlot,
  EndTextSlot,
  EndIconSlot,
  selected,
  onClick,
  className = '',
}: ListItemProps) {
  const mode = useColorMode();

  return (
    <Box css={styles} onClick={onClick} className={className}>
      <DataDisplayItem
        StartIconSlot={StartIconSlot}
        StartTextSlot={StartTextSlot}
        EndTextSlot={
          selected ? (
            <Icon as={BiCheck} color={tgColors[mode.colorMode].button_color} />
          ) : (
            EndTextSlot
          )
        }
        EndIconSlot={EndIconSlot}
      />
    </Box>
  );
}

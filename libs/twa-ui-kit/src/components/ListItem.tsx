import { css } from '@emotion/react';
import { DataDisplayItem } from './DataDisplayItem';
import { Box, Icon, useColorMode } from '@chakra-ui/react';
import { AiOutlineCheck } from 'react-icons/ai';
import { tgColors } from '../theme';

const styles = css`
  padding: 1rem 0;

  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  :not(:last-child) {
    border-bottom: 1px solid #e5e7eb;
  }
`;

type ListItemProps = {
  StartTextSlot?: React.ReactNode;
  EndTextSlot?: React.ReactNode;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
};

export function ListItem({
  StartIconSlot,
  StartTextSlot,
  EndTextSlot,
  EndIconSlot,
  selected,
}: ListItemProps) {
  const mode = useColorMode();

  return (
    <Box css={styles}>
      <DataDisplayItem
        StartIconSlot={StartIconSlot}
        StartTextSlot={StartTextSlot}
        EndTextSlot={
          selected ? (
            <Icon
              as={AiOutlineCheck}
              color={tgColors[mode.colorMode].button_color}
            />
          ) : (
            EndTextSlot
          )
        }
        EndIconSlot={EndIconSlot}
      />
    </Box>
  );
}

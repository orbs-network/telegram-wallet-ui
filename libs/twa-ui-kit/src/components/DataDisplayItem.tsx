import { HStack, Interpolation } from '@chakra-ui/react';
import { CSSProperties } from 'react';

type DataDisplayItemProps = {
  StartTextSlot?: React.ReactNode;
  EndTextSlot?: React.ReactNode;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  css?: Interpolation<CSSProperties>;
};

export function DataDisplayItem({
  StartIconSlot,
  StartTextSlot,
  EndTextSlot,
  EndIconSlot,
  onClick,
  className = '',
  css = {}
}: DataDisplayItemProps) {
  return (
    <HStack
      css={css}
      className={className}
      justifyContent="space-between"
      alignItems="center"
      width="100%"
      onClick={onClick}
    >
      <HStack spacing={3} alignItems="center">
        {StartIconSlot}
        {StartTextSlot}
      </HStack>
      <HStack spacing={4} alignItems="center"> 
        {EndTextSlot}
      {EndIconSlot}
      </HStack>
    </HStack>
  );
}

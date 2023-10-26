import { HStack } from '@chakra-ui/react';

type DataDisplayItemProps = {
  StartTextSlot?: React.ReactNode;
  EndTextSlot?: React.ReactNode;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function DataDisplayItem({
  StartIconSlot,
  StartTextSlot,
  EndTextSlot,
  EndIconSlot,
  onClick,
  className = '',
}: DataDisplayItemProps) {
  return (
    <HStack
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

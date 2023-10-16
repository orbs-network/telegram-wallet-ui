import { HStack } from '@chakra-ui/react';

type DataDisplayItemProps = {
  StartTextSlot?: React.ReactNode;
  EndTextSlot?: React.ReactNode;
  StartIconSlot?: React.ReactNode;
  EndIconSlot?: React.ReactNode;
};

export function DataDisplayItem({
  StartIconSlot,
  StartTextSlot,
  EndTextSlot,
  EndIconSlot,
}: DataDisplayItemProps) {
  return (
    <HStack justifyContent="space-between" alignItems="center" width="100%">
      <HStack spacing={4} alignItems="center">
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

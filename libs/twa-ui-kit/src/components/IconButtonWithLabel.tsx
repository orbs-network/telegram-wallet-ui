import { VStack, Text, Button, ButtonProps } from '@chakra-ui/react';

type IconButtonWithLabelProps = ButtonProps & {
  IconSlot: React.ReactNode;
  label: string;
};

export function IconButtonWithLabel({
  IconSlot,
  label,
  onClick,
}: IconButtonWithLabelProps) {
  return (
    <Button variant="icon" onClick={onClick}>
      <VStack>
        {IconSlot}
        <Text fontWeight="bold">{label}</Text>
      </VStack>
    </Button>
  );
}

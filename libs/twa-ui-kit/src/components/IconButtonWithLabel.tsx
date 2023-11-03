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
      <VStack gap="0.25rem">
        {IconSlot}
        <Text as="span" fontSize="14px">
          {label}
        </Text>
      </VStack>
    </Button>
  );
}

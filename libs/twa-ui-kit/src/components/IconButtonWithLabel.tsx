import {
  VStack,
  Text,
  Icon as IconWrapper,
  Button,
  ButtonProps,
} from '@chakra-ui/react';
import { IconType } from 'react-icons';

type IconButtonWithLabelProps = ButtonProps & {
  Icon: IconType;
  label: string;
};

export function IconButtonWithLabel({
  Icon,
  label,
  onClick,
}: IconButtonWithLabelProps) {
  return (
    <Button variant="icon" onClick={onClick}>
      <VStack>
        <IconWrapper as={Icon} fontSize="2xl" color="inherit" />
        <Text fontWeight="bold">{label}</Text>
      </VStack>
    </Button>
  );
}

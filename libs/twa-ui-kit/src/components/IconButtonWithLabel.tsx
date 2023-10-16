import { VStack, Text, Icon as IconWrapper, Button } from '@chakra-ui/react';
import { colors } from '../theme';
import { IconType } from 'react-icons';

type IconButtonWithLabelProps = {
  Icon: IconType;
  label: string;
  onClick?: () => void;
};

export function IconButtonWithLabel({
  Icon,
  label,
  onClick,
}: IconButtonWithLabelProps) {
  console.log(colors);

  return (
    <Button variant="icon" onClick={onClick}>
      <VStack>
        <IconWrapper as={Icon} fontSize="2xl" color="inherit" />
        <Text fontWeight="bold">{label}</Text>
      </VStack>
    </Button>
  );
}

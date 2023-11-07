import {
  Button as ChakraButton,
  ButtonProps as ChakraButtonProps,
} from '@chakra-ui/react';

type ButtonProps = ChakraButtonProps & {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
};

export function Button({ children, ...rest }: ButtonProps) {
  return (
    <ChakraButton fontSize="1rem" {...rest}>
      {children}
    </ChakraButton>
  );
}

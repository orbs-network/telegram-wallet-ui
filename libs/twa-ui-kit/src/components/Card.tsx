import { CardBody, Card as ChakraCard } from '@chakra-ui/react';
import { css } from '@emotion/react';

const styles = css`
  border-radius: 1rem;
  min-height: 72px;
`;

type CardProps = {
  children: React.ReactNode;
};

export function Card({ children }: CardProps) {
  return (
    <ChakraCard size="sm" css={styles}>
      <CardBody>{children}</CardBody>
    </ChakraCard>
  );
}

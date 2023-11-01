import { CardBody, Card as ChakraCard } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { colors } from '../theme';

const styles = css`
  border-radius: 1rem;
  min-height: 72px;
  width: 100%;
  box-shadow: unset;
  background-color: ${colors.bg_color};
`;

type CardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Card({ children, onClick, className = '' }: CardProps) {
  return (
    <ChakraCard onClick={onClick} size="sm" css={styles} className={className}>
      <CardBody>{children}</CardBody>
    </ChakraCard>
  );
}

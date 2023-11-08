import { CardBody, Card as ChakraCard } from '@chakra-ui/react';
import { css, Interpolation } from '@emotion/react';
import { CSSProperties } from 'react';
import { colors } from '../theme';

const styles = css`
  border-radius: 0.875rem;
  min-height: 72px;
  width: 100%;
  box-shadow: rgba(0, 0, 0, 0.04) 0px 2px 8px 0px;
  background-color: ${colors.bg_color};
  color: ${colors.text_color};
`;

type CardProps = {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  css?: Interpolation<CSSProperties>; 
};

export function Card({ children, onClick, className = '', css = {} }: CardProps) {
  return (
    <ChakraCard onClick={onClick} size="sm" css={[styles, css]} className={className}>
      <CardBody>{children}</CardBody>
    </ChakraCard>
  );
}

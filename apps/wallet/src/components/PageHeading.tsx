import { Heading } from '@chakra-ui/react';
import { css } from '@emotion/react';

const styles = css`
  font-size: 28px;
  text-align: center;
  padding: 44px 16px 50px 16px;
`;

export function PageHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading css={styles} as="h1">
      {children}
    </Heading>
  );
}

import { AbsoluteCenter, Icon } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import { BiWallet } from 'react-icons/bi';

const bounce = keyframes`
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 0.1;
  }

  100% {
    opacity: 0.6;
  }
`;

const styles = css`
  animation: ${bounce} 1s linear infinite;
`;

export function WalletSpinner({
  width = '80px',
  height = '80px',
}: {
  width?: string;
  height?: string;
}) {
  return (
    <AbsoluteCenter>
      <Icon css={styles} width={width} height={height} as={BiWallet} />
    </AbsoluteCenter>
  );
}

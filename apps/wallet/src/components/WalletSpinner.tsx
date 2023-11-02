import { AbsoluteCenter, Box } from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
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
      <Box css={styles}>
        <svg
          fill="currentColor"
          height={height}
          width={width}
          version="1.1"
          viewBox="0 0 458.531 343.89826"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g>
            <path
              fill="currentColor"
              d="m 336.688,242.47101 v 0 c -21.972,-0.001 -39.848,-17.876 -39.848,-39.848 v -66.176 C 296.84,114.47501 314.716,96.6 336.688,96.6 h 103.83 c 0.629,0 1.254,0.019 1.876,0.047 V 30.725 C 442.394,13.756 428.638,5.4518208e-8 411.669,5.4518208e-8 H 30.726 C 13.756,-9.9994548e-4 0,13.755 0,30.724 v 277.62101 c 0,16.969 13.756,30.726 30.726,30.726 h 380.943 c 16.969,0 30.725,-13.756 30.725,-30.726 v -65.922 c -0.622,0.029 -1.247,0.048 -1.876,0.048 z"
            />
            <path
              fill="currentColor"
              d="m 440.518,118.43401 h -103.83 c -9.948,0 -18.013,8.065 -18.013,18.013 v 66.176 c 0,9.948 8.065,18.013 18.013,18.013 h 103.83 c 9.948,0 18.013,-8.064 18.013,-18.013 v -66.176 c 0,-9.949 -8.065,-18.013 -18.013,-18.013 z m -68.052,77.099 c -14.359,0 -25.999,-11.64 -25.999,-25.999 0,-14.359 11.64,-25.999 25.999,-25.999 14.359,0 25.999,11.64 25.999,25.999 0,14.359 -11.64,25.999 -25.999,25.999 z"
            />
          </g>
        </svg>
      </Box>
    </AbsoluteCenter>
  );
}

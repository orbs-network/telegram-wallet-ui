import { keyframes } from "@emotion/react";

export const flash = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.1;
  }

  100% {
    opacity: 1;
  }
`;



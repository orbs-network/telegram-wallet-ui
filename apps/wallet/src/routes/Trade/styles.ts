import { css, keyframes } from '@emotion/react';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';

export const styles = {
  switchTokensContainer: css`
    justify-content: flex-end;
    width: 100%;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      width: calc(100% + 32px);
      height: 1px;
      background-color: ${colors.border_color};
      top: 50%;
      transform: translate(-50%);
      left: 50%;
    }
  `,
  switchTokensButton: css`
    position: relative;
    z-index: 1;
    padding: 10px;
    background-color: ${colors.button_color};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    svg {
      color: white;
      width: 30px;
      height: 30px;
    }
  `,
};






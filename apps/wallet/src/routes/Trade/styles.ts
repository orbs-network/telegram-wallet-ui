import { css, keyframes } from '@emotion/react';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';

export const styles = {
  switchTokensContainer: css`
    margin-top: 2px;
    margin-bottom: 2px;
    justify-content: flex-end;
    width: 100%;
    position: relative;
    &:after {
      content: '';
      position: absolute;
      width: calc(100% + 32px);
      height: 2px;
      background-color: ${colors.border_color};
      top: 50%;
      transform: translate(-50%);
      left: 50%;
    }
  `,
  switchTokensButton: css`
    position: relative;
    width: 48px;
    height: 48px;
    z-index: 1;
    padding: 0px;
    background-color: #ebf3fa;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    overflow: hidden;
    border: 4px solid ${colors.bg_color};
    svg {
      color: ${colors.button_color};
      font-size: 23px;
    }
  `,
};






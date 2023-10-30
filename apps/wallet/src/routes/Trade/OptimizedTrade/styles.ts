import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Page } from "../../../components";

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
      background-color: #e5e5e5;
      top: 50%;
      transform: translate(-50%);
      left: 50%;
    }
  `,
  switchTokensButton: css`
    position: relative;
    z-index: 1;
    padding: 10px;
    background-color: #417fc6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;

    svg {
      color: white;
      width: 30px;
      height: 30px;
    }
  `,
};

export const StyledPage = styled(Page)({
  background: 'white',
});

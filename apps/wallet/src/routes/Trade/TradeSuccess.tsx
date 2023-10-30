import {  Link, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  SuccessPage } from '../../components';
import { POLYGON_EXPLORER } from '../../consts';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { useFormatNumber } from '../../hooks';
import { URLParams } from '../../types';

const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    justify-content: center;
    text-align: center;
  `,
  title: css`
    font-size: 22px;
    font-weight: 600;
  `,
  link: css`
    color: #00a3ff;
    margin-top: 16px;
    text-decoration: unset;
  `,
};

export function TradeSuccess() {
  const { outToken, outAmount, txHash } = useParams<URLParams>();
  const formattedOutAmount = useFormatNumber({ value: outAmount });
  const { onSetButton } = useMainButtonContext();
  const navigate = useNavigate();

  useEffect(() => {
    onSetButton({
      text: 'Done',
      onClick: () => navigate('/'),
    });
  }, [onSetButton, navigate]);

  return (
    <StyledPage>
      <Text css={styles.title}>Exchange completed</Text>
      <Text>
        <strong>
          {formattedOutAmount} {`${outToken?.toUpperCase()} `}
        </strong>
        has been deposited to your wallet
      </Text>
      <Link
        css={styles.link}
        href={`${POLYGON_EXPLORER}/address/${txHash}`}
        target="_blank"
      >
        View transaction
      </Link>
    </StyledPage>
  );
}

const StyledPage = styled(SuccessPage)({
  background: 'white',
});

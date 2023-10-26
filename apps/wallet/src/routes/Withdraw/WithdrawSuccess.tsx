import { Container, Text, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Page } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { ROUTES } from '../../router/routes';
import Lottie from 'lottie-react';
import SuccessLottie from '../../assets/lottie/success.json';
import { URLParams } from '../../types';
import { useGetTokenFromList } from '../../hooks';
import { css } from '@emotion/react';
import styled from '@emotion/styled';

const styles = {
  container: css`
    flex: 1;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  `,
  title: css`
    font-size: 24px;
    font-weight: 700;
  `,
  text: css`
    font-size: 14px;
  `,
  recipient: css`
    font-size: 14px;
    max-width: 180px;
  `,
  smallTitle: css`
    font-size: 14px;
    opacity: 0.5;
  `,
};

export function WithdrawSuccess() {
  const { onSetButton, resetButton } = useMainButtonContext();
  const navigate = useNavigate();
  const { assetId, amount, recipient } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const symbol = token?.symbol || '';

  useEffect(() => {
    onSetButton({
      text: 'DONE',
      //   onClick: () =>
      //     mutate({ assetId: assetId!, recipient: recipient!, amount: amount! }),
      onClick: () => {
        navigate(ROUTES.root);
        resetButton();
      },
    });
  }, [onSetButton, navigate, resetButton]);

  return (
    <StyledPage>
      <Container css={styles.container} size="sm" pt={4}>
        <VStack spacing={4}>
          <LottieContainer>
            <Lottie
              animationData={SuccessLottie}
              loop={true}
              width={200}
              height={200}
            />
          </LottieContainer>

          <Text css={styles.title}>{symbol} Sent</Text>
          <Text css={styles.text}>
            Your transaction has been sent to the network and will be proccessed
            in a few seconds
          </Text>
        </VStack>
        <VStack style={{ marginTop: 'auto' }}>
          <Text css={styles.smallTitle}>
            {amount} {symbol} has been sent to{' '}
          </Text>
          <Text css={styles.recipient} style={{ wordBreak: 'break-all' }}>
            {recipient}
          </Text>
        </VStack>
      </Container>
    </StyledPage>
  );
}

const StyledPage = styled(Page)({
  paddingBottom: 40,
});

const LottieContainer = styled('div')({
  position: 'relative',
  bottom: -70,
});

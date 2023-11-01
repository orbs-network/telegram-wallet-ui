import { Container, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import SuccessLottie from '../assets/lottie/success.json';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { Page } from './Page';
import { setTwaHeader } from '@telegram-wallet-ui/twa-ui-kit';
import { useEffect } from 'react';

const styles = {
  container: css`
    flex: 1;
    align-items: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  `,
};

export function SuccessPage({
  children,
  className = '',
  secondaryBackground = false,
}: {
  children: React.ReactNode;
  className?: string;
  secondaryBackground?: boolean;
}) {
  useEffect(() => {
    setTwaHeader(true);

    return () => {
      setTwaHeader(false);
    };
  }, []);

  return (
    <Page className={className} secondaryBackground={secondaryBackground}>
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
          {children}
        </VStack>
      </Container>
    </Page>
  );
}

const LottieContainer = styled('div')({
  position: 'relative',
  bottom: -70,
});

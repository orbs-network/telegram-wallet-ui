import { Container, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import SuccessLottie from '../assets/lottie/success.json';
import { css } from '@emotion/react';
import { Page } from './Page';
import { setTwaBg } from '@telegram-wallet-ui/twa-ui-kit';
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
    setTwaBg(true);

    return () => {
      setTwaBg(false);
    };
  }, []);

  return (
    <Page className={className} secondaryBackground={secondaryBackground}>
      <Container
        css={styles.container}
        size="sm"
        pt={4}
        justifyContent="stretch"
      >
        <VStack spacing={4} justifyContent="space-between">
          <Lottie
            animationData={SuccessLottie}
            loop={true}
            style={{ height: '300px' }}
          />
          {children}
        </VStack>
      </Container>
    </Page>
  );
}

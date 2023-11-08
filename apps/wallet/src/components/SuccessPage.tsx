import { Container, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import SuccessLottie from '../assets/lottie/success.json';
import { css } from '@emotion/react';
import { Page } from './Page';

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
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Page className={className} secondaryBackground={true}>
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

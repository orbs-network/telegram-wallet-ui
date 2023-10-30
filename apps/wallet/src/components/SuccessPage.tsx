import { Container, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import SuccessLottie from '../assets/lottie/success.json';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
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
    <StyledPage className={className}>
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

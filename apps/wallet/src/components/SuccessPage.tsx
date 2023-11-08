import { Container, Link, Text, VStack } from '@chakra-ui/react';
import Lottie from 'lottie-react';
import SuccessLottie from '../assets/lottie/success.json';
import { css } from '@emotion/react';
import { Page } from './Page';
import { ReactNode } from 'react';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';
import { POLYGON_EXPLORER } from '../consts';

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
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 8px;
  `,
  text: css`
    font-size: 17px;
  `,
  link: css`
    color: ${colors.link_color};
    margin-top: 16px;
    text-decoration: unset;
  `,
};

function SuccessPage({
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
        gap='0px'
        justifyContent="stretch"
      >
        <VStack gap='0px' justifyContent="space-between">
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

const Title = ({text}:{text: string}) => {
  return <Text as='h1' css={styles.title}>{text}</Text>
}

const SuccessLink = ({ text, txHash }: { text: string; txHash?: string }) => {
  return (
    <Link
      css={styles.link}
      href={`${POLYGON_EXPLORER}/tx/${txHash}`}
      target="_blank"
    >
      {text}
    </Link>
  );
};

const SuccessText = ({text}:{text: ReactNode}) => {
  return <Text css={styles.text}>{text}</Text>
}


SuccessPage.Title = Title;
SuccessPage.Text = SuccessText; 
SuccessPage.Link = SuccessLink;


export default SuccessPage
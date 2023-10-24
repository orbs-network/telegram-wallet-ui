import {
  Code,
  Container,
  HStack,
  Icon,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { BackButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks';
import { Button, colors } from '@telegram-wallet-ui/twa-ui-kit';
import QRCode from 'react-qr-code';
import { css } from '@emotion/react';
import { useState } from 'react';
import { MdIosShare } from 'react-icons/md';
import { BiCheck } from 'react-icons/bi';
import { WalletSpinner } from '../../components';

const styles = {
  qr: css`
    width: 80%;
    padding: 2rem;
    background-color: ${colors.bg_color};
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2rem;

    > * {
      width: 60%;
    }
  `,
};

export function DepositAddress() {
  const navigate = useNavigate();
  const [isCopied, setIsCopied] = useState(false);
  const userData = useUserData();
  const toast = useToast();

  if (!userData?.data?.account.address) {
    return (
      <Container size="sm" height="100vh" position="relative">
        <WalletSpinner />
      </Container>
    );
  }

  const address = userData.data.account.address;

  function handleCopy() {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setIsCopied(true);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      })
      .finally(() => setTimeout(() => setIsCopied(false), 3000));
  }

  const isShareSupported = navigator.share !== undefined;

  function handleShare() {
    async function share() {
      try {
        await navigator.share({
          text: address,
        });
      } catch (err) {
        toast({
          title: 'Failed to share',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
    void share();
  }

  return (
    <Container size="sm" pt={4} height="100vh">
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <VStack
        justifyContent="center"
        alignItems="center"
        height="100%"
        position="relative"
        spacing={8}
      >
        <VStack css={styles.qr}>
          <QRCode value={address} />
          <Code textAlign="center" colorScheme="transparent">
            {address}
          </Code>
        </VStack>
        <HStack width="100%">
          <Button
            variant={isCopied ? undefined : 'primary'}
            onClick={handleCopy}
            colorScheme={isCopied ? 'green' : 'none'}
            leftIcon={isCopied ? <Icon as={BiCheck} /> : undefined}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </Button>
          {isShareSupported && (
            <Button
              variant="tertiary"
              leftIcon={<Icon as={MdIosShare} />}
              onClick={handleShare}
            >
              Share
            </Button>
          )}
        </HStack>
      </VStack>
    </Container>
  );
}

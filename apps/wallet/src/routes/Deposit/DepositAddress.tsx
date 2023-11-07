import {
  Container,
  Heading,
  HStack,
  Icon,
  Text,
  useColorMode,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useGetTokenFromList, useUserData } from '../../hooks';
import { Button, Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { QRCodeSVG } from 'qrcode.react';
import { css } from '@emotion/react';
import { MdIosShare } from 'react-icons/md';
import { NetworkSelector, Page, WalletSpinner } from '../../components';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { BiSolidCopy } from 'react-icons/bi';
const QR_SIZE = 190;
const isShareSupported = navigator.share !== undefined;

const styles = {
  qr: css`
    width: auto;
    padding: 0px;
    gap: 0px;

    .chakra-card__body {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 22px;
      padding: 30px 30px 20px 30px;
    }
  `,
  address: css`
    white-space: normal;
    width: 100%;
    line-break: anywhere;
    text-align: center;
    font-size: 13px;
    line-height: 18px;
  `,
  network: css`
    font-size: 14px;
    width: 100%;
    text-align: center;
    color: ${colors.hint_color};
  `,
  warning: css`
    font-size: 15px;
    width: 100%;
    text-align: center;
  `,
  buttons: css`
    margin-top: auto;
  `,
  container: css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
};

export function DepositAddress() {
  const { data: userData } = useUserData();
  const { assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const mode = useColorMode().colorMode;

  if (!userData?.account.address) {
    return (
      <Page>
        <Container size="sm" pt={4}>
          <WalletSpinner />
        </Container>
      </Page>
    );
  }

  const address = userData.account.address;

  return (
    <Page>
      <Container size="sm" pt={6} css={styles.container}>
        <VStack spacing={6} flex="1">
          <NetworkSelector />
          <Heading as="h1" size="md" textAlign="center">
            Deposit {token?.symbolDisplay}
          </Heading>
          <VStack
            justifyContent="center"
            alignItems="center"
            gap="20px"
            flex="1"
          >
            <Card css={styles.qr}>
              <QRCodeSVG
                bgColor="transparent"
                fgColor={mode === 'light' ? '#000' : '#fff'}
                size={QR_SIZE}
                includeMargin={false}
                value={address}
                level="L"
                imageSettings={{
                  src: token?.logoURI || '',
                  height: 37,
                  width: 37,
                  excavate: true,
                }}
              />
              <VStack gap="4px">
                <Text style={{ maxWidth: QR_SIZE - 20 }} css={styles.address}>
                  {address}
                </Text>
                <Text css={styles.network}>
                  Your {token?.symbolDisplay || ''} address
                </Text>
              </VStack>
            </Card>
            <Warning />

            <HStack width="100%" css={styles.buttons}>
              <CopyButton address={address} />
              <ShareButton address={address} />
            </HStack>
          </VStack>
        </VStack>
      </Container>
    </Page>
  );
}

const ShareButton = ({ address }: { address: string }) => {
  const handleShare = () => {
    async function share() {
      try {
        await navigator.share({
          text: address,
        });
      } catch (err) {
        // do nothing if user cancels
      }
    }
    void share();
  };

  if (!isShareSupported) return null;
  return (
    <Button
      variant="tertiary"
      leftIcon={<Icon as={MdIosShare} />}
      onClick={handleShare}
    >
      Share
    </Button>
  );
};

const CopyButton = ({ address }: { address: string }) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        toast({
          status: 'success',
          title: 'Copied to clipboard',
          isClosable: true,
          duration: 40_000,
        });
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  return (
    <Button
      variant="primary"
      onClick={handleCopy}
      colorScheme="none"
      leftIcon={<BiSolidCopy />}
    >
      Copy
    </Button>
  );
};

const Warning = () => {
  const { assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  return (
    <Text css={styles.warning}>
      Send only <strong>{token?.symbolDisplay || ''} ERC-20</strong> to this
      Polygon address using a native Polygon wallet. <br /> Sending other coins may
      result in permanent loss.
    </Text>
  );
};

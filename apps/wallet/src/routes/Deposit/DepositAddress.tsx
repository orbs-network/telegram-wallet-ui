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
import { useGetTokenFromList } from '../../hooks';
import { Button, Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { QRCodeSVG } from 'qrcode.react';
import { css } from '@emotion/react';
import { MdIosShare } from 'react-icons/md';
import { NetworkSelector, Page, WalletSpinner } from '../../components';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { BiSolidCopy } from 'react-icons/bi';
import { useEffect } from 'react';
import { useInitialize } from '../../config';

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
      gap: 35px;
      padding: 40px 40px 20px 40px;
    }
  `,
  address: css`
    white-space: normal;
    width: 100%;
    line-break: anywhere;
    text-align: center;
    font-size: 14px;
    line-height: 20px;
  `,
  network: css`
    font-size: 15px;
    width: 100%;
    text-align: center;
    color: ${colors.hint_color};
  `,
  warning: css`
    font-size: 16px;
    width: 100%;
    text-align: center;
  `,
  buttons: css`
    margin-top: auto;
    gap: 20px;
  `,
  container: css`
    flex: 1;
    display: flex;
    flex-direction: column;
  `,
};

export function DepositAddress() {
  const { assetId } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const mode = useColorMode().colorMode;
  const config = useInitialize();

  useEffect(() => {
    if (token && config) {
      config.faucetProvider.setProofErc20(token.address);
      config.permit2Provider.addErc20(token.address);
    }
  }, [token, config]);

  if (!config?.account.address) {
    return (
      <Page>
        <Container size="sm" pt={4}>
          <WalletSpinner />
        </Container>
      </Page>
    );
  }

  const address = config?.account.address;

  return (
    <Page>
      <Container size="sm" pt={6} css={styles.container}>
        <VStack gap="20px" css={{ marginBottom: '26px' }}>
          <NetworkSelector assetId={assetId || ''} />
          <Heading as="h1" size="md" textAlign="center">
            Deposit {token?.symbolDisplay}
          </Heading>
        </VStack>
        <VStack justifyContent="center" alignItems="center" gap="24px" flex="1">
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
                height: 47,
                width: 47,
                excavate: true,
              }}
            />
            <VStack gap="4px">
              <Text style={{ maxWidth: QR_SIZE - 10 }} css={styles.address}>
                {address}
              </Text>
              <Text css={styles.network}>Your Polygon address</Text>
            </VStack>
          </Card>
          <Warning />

          <HStack width="100%" css={styles.buttons}>
            <CopyButton address={address} />
            <ShareButton address={address} />
          </HStack>
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
      variant="secondary"
      leftIcon={<Icon as={MdIosShare} />}
      onClick={handleShare}
    >
      Share
    </Button>
  );
};

const copyToastId = 'copy-toast';

const CopyButton = ({ address }: { address: string }) => {
  const toast = useToast();

  const handleCopy = () => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        if (!toast.isActive(copyToastId)) {
          toast({
            status: 'success',
            title: 'Copied to clipboard',
            isClosable: true,
            duration: 3_000,
            id: copyToastId,
          });
        }
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
      leftIcon={<Icon as={BiSolidCopy} />}
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
      address. Sending other coins may result in permanent loss.
    </Text>
  );
};

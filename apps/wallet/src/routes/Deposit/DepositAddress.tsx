import { Container, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { useGetTokenFromList, useUserData } from '../../hooks';
import { Button, Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { QRCodeSVG } from 'qrcode.react';

import { css } from '@emotion/react';
import { useMemo, useState } from 'react';
import { MdIosShare } from 'react-icons/md';
import { BiCheck } from 'react-icons/bi';
import { NetworkSelect, Page, WalletSpinner } from '../../components';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { useNavigation } from '../../router/hooks';

const QR_SIZE = 180

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
      gap: 16px;
      padding: 30px 15px 15px 15px;
    }
  `,
  address: css`
    white-space: normal;
    width: 100%;
    line-break: anywhere;
    text-align: center;
    font-size: 16px;
    line-height: 20px;
  `,
  network: css`
    font-size: 14px;
    width: 100%;
    text-align: center;
    color: ${colors.hint_color};
  `,
};


const SelectNetwork = () => {
  const depositCryptoNetworkSelectPath =
    useNavigation().depositCryptoNetworkSelectPath;
  const { assetId } = useParams<URLParams>();

  const path = useMemo(() => depositCryptoNetworkSelectPath(assetId!),
    [assetId, depositCryptoNetworkSelectPath]
  );


  return <NetworkSelect.Selector path={path} />;
}

export function DepositAddress() {
  const [isCopied, setIsCopied] = useState(false);
  const { data: userData } = useUserData();
  const {assetId} = useParams<URLParams>()
  const token = useGetTokenFromList(assetId)

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
        // do nothing if user cancels
      }
    }
    void share();
  }

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack justifyContent="center" alignItems="center" height="100%">
          <Card css={styles.qr}>
            <QRCodeSVG
              size={QR_SIZE}
              includeMargin={false}
              value={address}
              level="Q"
              imageSettings={{
                src: token?.logoURI || '',
                height: 40,
                width: 40,
                excavate: true,
              }}
            />
            <VStack gap="4px">
              <Text style={{ maxWidth: QR_SIZE + 30 }} css={styles.address}>
                {address}
              </Text>
              <Text css={styles.network}>Your Polygon address</Text>
            </VStack>
          </Card>
          <SelectNetwork />

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
    </Page>
  );
}

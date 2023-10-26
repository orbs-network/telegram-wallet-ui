import {
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  Icon,
  useColorMode,
  Container,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { MdOutlineContentPaste } from 'react-icons/md';
import Telegram from '@twa-dev/sdk';
import Web3 from 'web3';
import { MdQrCodeScanner } from 'react-icons/md';
import { tgColors } from '@telegram-wallet-ui/twa-ui-kit';
import styled from '@emotion/styled';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import { useNavigation } from '../../router/hooks';
import { Page } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { useCurrentPath } from '../../hooks';

const styles = {
    container: css`
        flex:1
    `
}

export function WithdrawAddress() {
  const [address, setAddress] = useState('');
  const { withdrawAmount } = useNavigation();
  const { onSetButton } = useMainButtonContext();
  const {assetId} = useParams<URLParams>()

  useCurrentPath();

  const isValidAddress = useMemo(
    () => Web3.utils.isAddress(address),
    [address]
  );

  useEffect(() => {
    onSetButton({
      text: 'Continue',
      disabled: !isValidAddress,
      onClick: () => withdrawAmount(assetId!, address),
    });
  }, [onSetButton, withdrawAmount, isValidAddress, address, assetId]);

  return (
    <Page>
      <Container size="sm" pt={4} css={styles.container}>
        <VStack spacing={4} alignItems="stretch" height="100%">
          <Heading as="h1" size="md" textAlign="center">
            Enter address
          </Heading>
          <AddressInput address={address} setAddress={setAddress} />
          <ScanQR setAddress={setAddress} />
        </VStack>
      </Container>
    </Page>
  );
}



const AddressInput = ({
  address,
  setAddress,
}: {
  address: string;
  setAddress: (address: string) => void;
}) => {
  const mode = useColorMode();

  const paste = () => {
    navigator.clipboard
      .readText()
      .then((text) => {
        setAddress(text);
      })
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
      });
  };

  const onClick = () => {
    if (address) {
      setAddress('');
    } else {
      paste();
    }
  };

  return (
    <InputGroup>
      <Input
        onChange={(e) => setAddress(e.target.value)}
        value={address}
        placeholder="Enter address"
      />
      <InputRightElement onClick={onClick}>
        <Icon
          width={'20px'}
          height={'20px'}
          as={address ? AiOutlineCloseCircle : MdOutlineContentPaste}
          color={tgColors[mode.colorMode].button_color}
        />
      </InputRightElement>
    </InputGroup>
  );
};

const ScanQR = ({ setAddress }: { setAddress: (value: string) => void }) => {
  const mode = useColorMode();

  const onScan = () => {
    Telegram.showScanQrPopup({}, (value) => {
      try {
        const result = value.substring(value.indexOf('0x'));
        setAddress(result);
      } catch (error) {
        console.error(error);
      } finally {
        Telegram.closeScanQrPopup();
      }
    });
  };

  return (
    <StyledQRCode>
      <VStack spacing={2} alignItems="center" onClick={onScan}>
        <Icon
          width={30}
          height={30}
          as={MdQrCodeScanner}
          color={tgColors[mode.colorMode].button_color}
        />
        <Text
          fontWeight={700}
          fontSize={14}
          color={tgColors[mode.colorMode].button_color}
        >
          Scan QR
        </Text>
      </VStack>
    </StyledQRCode>
  );
};

const StyledQRCode = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flex: 1,
});

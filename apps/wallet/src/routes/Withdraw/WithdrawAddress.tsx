import {
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  Icon,
  Container,
  HStack,
  Heading,
  Box,
} from '@chakra-ui/react';
import { useCallback, useMemo, useState } from 'react';
import Telegram from '@twa-dev/sdk';
import Web3 from 'web3';
import { LuScanLine } from 'react-icons/lu';
import { ListItem, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { useNavigation } from '../../router/hooks';
import { Page } from '../../components';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { useCurrentPath } from '../../hooks';
import { useUpdateMainButton } from '../../store/main-button-store';
import { AiFillCloseCircle, AiFillWarning } from 'react-icons/ai';

const styles = {
  container: css`
    flex: 1;
  `,
};

export function WithdrawAddress() {
  const [address, setAddress] = useState('');
  const { withdrawAmount } = useNavigation();
  const { assetId } = useParams<URLParams>();

  useCurrentPath();

  const isValidAddress = useMemo(() => {
    try {
      Web3.utils.toChecksumAddress(address);
      return true;
    } catch (e) {
      return false;
    }
  }, [address]);

  const onSubmit = useCallback(() => {
    withdrawAmount(assetId!, address);
  }, [withdrawAmount, assetId, address]);

  useUpdateMainButton({
    text: 'Continue',
    disabled: !isValidAddress,
    onClick: onSubmit,
  });

  return (
    <Page>
      <Container size="sm" pt={4} css={styles.container}>
        <VStack spacing={4} alignItems="stretch" height="100%">
          <AddressInput address={address} setAddress={setAddress} />
          {address !== '' && !isValidAddress ? (
            <ListItem
              StartIconSlot={<Icon as={AiFillWarning} />}
              StartTextSlot={
                <Box>
                  <Heading as="h3" variant="bodyTitle">
                    Invalid Address
                  </Heading>
                  <Text variant="hint" fontSize="xs">
                    Enter a valid Polygon address
                  </Text>
                </Box>
              }
            />
          ) : (
            <ScanQR setAddress={setAddress} />
          )}
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
        placeholder="Enter Polygon address"
      />

      <InputRightElement
        onClick={onClick}
        pr={address === '' ? 8 : 0}
        color={colors.link_color}
      >
        {address === '' ? 'Paste' : <Icon as={AiFillCloseCircle} />}
      </InputRightElement>
    </InputGroup>
  );
};

const ScanQR = ({ setAddress }: { setAddress: (value: string) => void }) => {
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

  if (!Telegram.initData) {
    return null;
  }

  return (
    <HStack spacing={2} alignItems="center" onClick={onScan}>
      <Icon as={LuScanLine} color={colors.button_color} />
      <Text color={colors.button_color}>Scan QR Code</Text>
    </HStack>
  );
};

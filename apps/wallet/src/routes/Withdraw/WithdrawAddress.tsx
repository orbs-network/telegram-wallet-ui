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
  useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Telegram from '@twa-dev/sdk';
import Web3 from 'web3';
import { LuScanLine } from 'react-icons/lu';
import { ListItem, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { useNavigation } from '../../router/hooks';
import { NetworkSelector, Page } from '../../components';
import { css } from '@emotion/react';
import { useParams } from 'react-router-dom';
import { URLParams } from '../../types';
import { useUpdateMainButton } from '../../store/main-button-store';
import { AiFillCloseCircle, AiFillWarning } from 'react-icons/ai';
import { useUserData } from '../../hooks';
import { eqIgnoreCase } from '@defi.org/web3-candies';

const styles = {
  container: css`
    flex: 1;
  `,
};

const validateAddress = (address?: string) => {
  if (!address) return true;
  try {
    Web3.utils.toChecksumAddress(address);
    return true;
  } catch (e) {
    return false;
  }
};

export function WithdrawAddress() {
  const [address, setAddress] = useState('');
  const { withdrawAmount } = useNavigation();
  const { assetId } = useParams<URLParams>();
  const account = useUserData().data?.account;

  const addressError = useMemo(() => {
    const valid = validateAddress(address);

    if (!address) return 
      if (!valid) {
        return {
          title: ' Invalid Address',
          subtitle: 'Enter a valid Polygon address',
        };
      }

    if (eqIgnoreCase(address, account?.address || '')) {
      return {
        title: ' Invalid Address',
        subtitle: 'You cannot withdraw to your own address',
      };
    }
  }, [address, account]);

  const onSubmit = useCallback(() => {
    withdrawAmount(assetId!, address);
  }, [withdrawAmount, assetId, address]);

  useUpdateMainButton({
    text: 'Continue',
    disabled: !address || !!addressError,
    onClick: onSubmit,
  });

  // '0x2Faa775F78952aF08026bDF651A6Da288DE1360c';
  return (
    <Page>
      <Container size="sm" pt={4} css={styles.container}>
        <VStack spacing={4} alignItems="stretch" height="100%">
          <NetworkSelector />
          <AddressInput address={address} setAddress={setAddress} />

          {addressError && (
            <AddressError
              title={addressError.title}
              subtitle={addressError.subtitle}
            />
          )}

          {!addressError && <ScanQR setAddress={setAddress} />}
        </VStack>
      </Container>
    </Page>
  );
}


const AddressError = ({ title, subtitle }: { title: string; subtitle: string }) => {
   return (
     <ListItem
       StartIconSlot={<Icon as={AiFillWarning} />}
       StartTextSlot={
         <Box>
           <Heading as="h3" variant="bodyTitle">
             {title}
           </Heading>
           <Text variant="hint" fontSize="xs">
             {subtitle}
           </Text>
         </Box>
       }
     />
   );
}

const AddressInput = ({
  address,
  setAddress,
}: {
  address: string;
  setAddress: (address: string) => void;
}) => {
  const [pasteSupported, setPasteSupported] = useState(false);
  const toast = useToast();

  useEffect(() => {
    async function checkPermission() {
      try {
        // const permission = await navigator.permissions.query({
        //   name: 'clipboard-read',
        //   // little hack for TS to ignore this unavailable type
        // } as unknown as PermissionDescriptor);
        // if (permission.state === 'granted') {
        //   setPasteSupported(true);
        //   return;
        // }

        if (typeof navigator.clipboard.readText === 'function') {
          setPasteSupported(true);
        }
      } catch (err) {
        // paste not supported
        console.error(err);
      }
    }
    checkPermission();
  }, []);

  const paste = () => {
    async function readClipboard() {
      try {
        const text = await navigator.clipboard.readText();
        setAddress(text);
      } catch (err) {
        toast({
          description: 'Failed to read clipboard contents',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }

    readClipboard();
  };
  const handlePaste = () => {
    paste();
  };
  const handleClear = () => {
    setAddress('');
  };

  return (
    <InputGroup>
      <Input
        onChange={(e) => setAddress(e.target.value)}
        value={address}
        placeholder="Enter Polygon address"
      />
      {pasteSupported && address === '' && (
        <InputRightElement
          onClick={handlePaste}
          pr={8}
          color={colors.link_color}
        >
          Paste
        </InputRightElement>
      )}

      {address !== '' && (
        <InputRightElement onClick={handleClear} color={colors.link_color}>
          <Icon as={AiFillCloseCircle} />
        </InputRightElement>
      )}
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

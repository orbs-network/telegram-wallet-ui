import {
  Container,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react';
import { BackButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { useUserData } from '../../hooks';
import { useState } from 'react';
import { MdSwapHorizontalCircle } from 'react-icons/md';

export function Trade() {
  const navigate = useNavigate();
  const userData = useUserData();
  const [primaryToken, setPrimaryToken] = useState('usdt');
  const [secondaryToken, setSecondaryToken] = useState('eth');

  return (
    <Container size="sm" pt={4}>
      <BackButton
        onClick={() => {
          navigate(-1);
        }}
      />
      <VStack alignItems="stretch">
        <HStack justifyContent="space-between">
          <div>You pay</div>
          <Text size="sm">
            Max: {userData?.tokens[primaryToken].balance}{' '}
            <Text as="span" variant="hint">
              {userData?.tokens[primaryToken].symbol}
            </Text>
          </Text>
        </HStack>
        <IconButton
          aria-label="Switch"
          icon={<Icon as={MdSwapHorizontalCircle} />}
          onClick={() => {
            const temp = primaryToken;
            setPrimaryToken(secondaryToken);
            setSecondaryToken(temp);
          }}
        />
        <HStack>
          <Text size="2xl">{userData?.tokens[secondaryToken].symbol}</Text>
        </HStack>
      </VStack>
    </Container>
  );
}

import { Container, Heading, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Page, TokensList } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { useNavigation } from '../../router/hooks';

export function Withdraw() {
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );
  const { withdrawAddress } = useNavigation();
  const { onSetButton } = useMainButtonContext();

  useEffect(() => {
    onSetButton({
      text: 'Continue',
      disabled: !selectedToken,
      onClick: () => withdrawAddress(selectedToken!),
    });
  }, [onSetButton, selectedToken, navigate, withdrawAddress]);

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch">
          <Heading as="h1" size="md" textAlign="center">
            Choose asset to withdraw
          </Heading>
          <TokensList selected={selectedToken} onSelect={setSelectedToken} />
        </VStack>
      </Container>
    </Page>
  );
}

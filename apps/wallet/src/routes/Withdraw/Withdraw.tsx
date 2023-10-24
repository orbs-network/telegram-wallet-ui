import { Container, Heading, VStack } from '@chakra-ui/react';
import  { useState } from 'react';
import { TokensList } from '../../components';
import { MainButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@telegram-wallet-ui/twa-ui-kit';

export function Withdraw() {
  const navigate = useNavigate();
  const [selectedToken, setSelectedToken] = useState<string | undefined>(
    undefined
  );

  const onSubmit = () => {
    navigate(`/withdraw/${selectedToken}/address`);
  };

  return (
    <Container size="sm" pt={4}>
      <VStack spacing={4} alignItems="stretch">
        <Heading as="h1" size="md" textAlign="center">
          Choose asset to withdraw
        </Heading>
        <TokensList selected={selectedToken} onSelect={setSelectedToken} />
        {selectedToken && <MainButton text="Continue" onClick={onSubmit} />}
        {selectedToken && <Button  onClick={onSubmit}>Continue</Button>}
      </VStack>
    </Container>
  );
}

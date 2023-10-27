import { VStack, Text, Heading } from '@chakra-ui/react';
import { SuccessPage } from '../../components';
import Twa from '@twa-dev/sdk';
import { Button } from '@telegram-wallet-ui/twa-ui-kit';
import { MainButton } from '@twa-dev/sdk/react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../router/routes';

export function Success() {
  const navigate = useNavigate();
  const handleDone = () => {
    navigate(ROUTES.root);
  };

  return (
    <SuccessPage>
      <VStack spacing={8}>
        <Heading as="h1" size="md">
          Swap Successful
        </Heading>
        <Text>
          Your transaction has been sent to the network and will be proccessed
          in a few seconds
        </Text>
        {!Twa.isVersionAtLeast('6.0.1') && (
          <Button variant="primary" onClick={handleDone}>
            Done
          </Button>
        )}
      </VStack>

      <MainButton text="Done" onClick={handleDone} />
    </SuccessPage>
  );
}

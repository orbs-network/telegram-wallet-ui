import { VStack, Text } from '@chakra-ui/react';
import { SuccessPage } from '../../components';

export function Success() {
  return (
    <SuccessPage>
      <VStack>
        <Text>Swap Successful</Text>
        <Text>
          Your transaction has been sent to the network and will be proccessed
          in a few seconds
        </Text>
      </VStack>
    </SuccessPage>
  );
}

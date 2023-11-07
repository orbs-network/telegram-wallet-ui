import { Card } from '@telegram-wallet-ui/twa-ui-kit';
import { Text } from '@chakra-ui/react';
import { DepositMethods } from '../routes';

export const DepositOptions = () => {
  return (
    <Card css={{background: 'transparent'}}>
      <Text style={{marginBottom: 6}} variant="hint">WAYS TO ADD FUNDS</Text>
      <DepositMethods />
    </Card>
  );
};

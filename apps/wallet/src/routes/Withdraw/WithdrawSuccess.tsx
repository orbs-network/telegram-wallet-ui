import { Code, Heading, Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessPage } from '../../components';
import { ROUTES } from '../../router/routes';
import { URLParams } from '../../types';
import { useGetTokenFromList } from '../../hooks';
import { useUpdateMainButton } from '../../store/main-button-store';

export function WithdrawSuccess() {
  const navigate = useNavigate();
  const { assetId, amount, recipient } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const symbol = token?.symbol || '';

  const onSubmit = useCallback(() => {
    navigate(ROUTES.root);
  }, [navigate]);

  useUpdateMainButton({
    text: 'Done',
    onClick: onSubmit,
    progress: false,
    disabled: false,
  });

  return (
    <SuccessPage>
      <VStack mt={-12}>
        <VStack>
          <Heading as="h1" size="xl">
            {symbol.toUpperCase()} Sent
          </Heading>
          <Text>
            Your transaction has been sent to the network and will be proccessed
            in a few seconds
          </Text>
        </VStack>
        <VStack>
          <Text variant="hint" mt={8}>
            {amount} {symbol.toUpperCase()} has been sent to{' '}
          </Text>
          <Code
            background="transparent"
            style={{ wordBreak: 'break-all' }}
            maxWidth="75%"
          >
            {recipient}
          </Code>
        </VStack>
      </VStack>
    </SuccessPage>
  );
}

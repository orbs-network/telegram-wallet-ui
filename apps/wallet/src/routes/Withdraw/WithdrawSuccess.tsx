import { Container, VStack } from '@chakra-ui/react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { ROUTES } from '../../router/routes';

export function WithdrawSuccess() {
  const { onSetButton } = useMainButtonContext();
  const navigate = useNavigate();

  useEffect(() => {
    onSetButton({
      text: 'DONE',
      //   onClick: () =>
      //     mutate({ assetId: assetId!, recipient: recipient!, amount: amount! }),
      onClick: () => navigate(ROUTES.root),
    });
  }, [onSetButton, navigate]);

  return (
    <Page>
      <Container size="sm" pt={4}>
        <VStack spacing={4} alignItems="stretch" height="100%"></VStack>
      </Container>
    </Page>
  );
}

import { Container } from '@chakra-ui/react';
import React, { useCallback } from 'react'
import { useNavigate} from 'react-router-dom'
import { Page } from '../../components';
import { ROUTES } from '../../router/routes';
import { useUpdateMainButton } from '../../store/main-button-store';
export function Page1() {

  const navigate = useNavigate();

  const onClick = useCallback(() => {
    navigate(ROUTES.onboardingPage1);
  }, [navigate]);
  

  useUpdateMainButton({
    text: 'Next',
    onClick,
  });

  
  return (
    <Page>
      <Container size="sm" pt={4}>
        <p>Page1</p>
      </Container>
    </Page>
  );
}


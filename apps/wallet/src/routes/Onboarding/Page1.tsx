import { Container } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { Page } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { ROUTES } from '../../router/routes';
export function Page1() {

  const {onSetButton} = useMainButtonContext()
  const navigate = useNavigate();

  useEffect(() => {
    onSetButton({
      text: 'Next',
      onClick: () => navigate(ROUTES.onboardingPage1),
    });
  }, [onSetButton, navigate]);
  
  return (
    <Page>
      <Container size="sm" pt={4}>
        <p>Page1</p>
      </Container>
    </Page>
  );
}


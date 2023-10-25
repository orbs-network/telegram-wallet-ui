import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Page } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { ROUTES } from '../../router/routes';
import { usePersistedStore } from '../../store/persisted-store';

export function Page3() {
  const {hideOnboarding} = usePersistedStore()
  
  const { onSetButton } = useMainButtonContext();
  const navigate = useNavigate();

  useEffect(() => {
    onSetButton({
      text: 'Next',
      onClick: () => {
        hideOnboarding();
        navigate(ROUTES.root);
      },
    });
  }, [onSetButton, navigate, hideOnboarding]);



  return (
    <Page>
      <p>Page3</p>
    </Page>
  );
}


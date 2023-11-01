import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Page } from '../../components';
import { ROUTES } from '../../router/routes';
import { useUpdateMainButton } from '../../store/main-button-store';
import { usePersistedStore } from '../../store/persisted-store';

export function Page3() {
  const { hideOnboarding } = usePersistedStore();

  const navigate = useNavigate();

  const onClick = useCallback(() => {
    hideOnboarding();
    navigate(ROUTES.root);
  }, [navigate, hideOnboarding]);

  useUpdateMainButton({
    text: 'Next',
    onClick,
  });

  return (
    <Page>
      <p>Page3</p>
    </Page>
  );
}

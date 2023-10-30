import React from 'react';
import { usePersistedStore } from '../store/persisted-store';
import { MainRouter } from './MainRouter';
import { OnboardingRouter } from './OnboardingRouter';

function Router() {
  const { showOnboarding } = usePersistedStore();
  return showOnboarding ? <OnboardingRouter /> : <MainRouter />;
}


export default Router;
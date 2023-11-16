// import { usePersistedStore } from '../store/persisted-store';
import { useInitialize } from '../config';
import { MainRouter } from './MainRouter';
// import { OnboardingRouter } from './OnboardingRouter';

function Router() {
  // const { showOnboarding } = usePersistedStore();
  // return showOnboarding ? <OnboardingRouter /> : <MainRouter />;
  const config = useInitialize();

  return config ? <MainRouter /> : <div />;
}

export default Router;

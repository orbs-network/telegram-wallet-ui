import { ChakraProvider, Container, useColorMode } from '@chakra-ui/react';
import { MainButton, theme } from '@telegram-wallet-ui/twa-ui-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import styled from '@emotion/styled';
import { lazy, Suspense, useEffect, useState } from 'react';
import { usePersistedStore } from './store/persisted-store';
import { WalletSpinner } from './components';
import { useMainButtonStore } from './store/main-button-store';
import Twa from '@twa-dev/sdk';

const queryClient = new QueryClient();

const Router = lazy(() => import('./router/Router'));

document.getElementById('loader')?.remove();

const App = () => {
  const [height] = useState(window.innerHeight);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <AppContainer style={{ height }}>
          <Suspense fallback={<Fallback height={height} />}>
            <ColorMode />
            <Router />
          </Suspense>
          <ActionButton />
        </AppContainer>
      </ChakraProvider>
    </QueryClientProvider>
  );
};

const ColorMode = () => {
  const { setColorMode } = useColorMode();

  useEffect(() => {
    setColorMode(Twa.colorScheme);
  }, [setColorMode]);

  return <div />;
};

const Fallback = ({ height }: { height: number }) => {
  return (
    <Container
      size="sm"
      style={{
        height: Twa.viewportStableHeight || height,
        position: 'relative',
      }}
    >
      <WalletSpinner />
    </Container>
  );
};

const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

function ActionButton() {
  const { onClick, text, disabled, progress } = useMainButtonStore();
  const location = useLocation();
  const { showOnboarding } = usePersistedStore();

  if (!showOnboarding && location.pathname === ROUTES.root) return null;

  if (!text) return null;

  return (
    <ButtonContainer>
      <MainButton
        disabled={disabled}
        progress={progress}
        onClick={onClick || (() => null)}
        text={text}
      />
    </ButtonContainer>
  );
}

const ButtonContainer = styled(Container)({
  position: 'absolute',
  zIndex: 10,
  bottom: 10,
});

export default App;

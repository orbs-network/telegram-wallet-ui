import { ChakraProvider, Container } from '@chakra-ui/react';
import { MainButton, theme } from '@telegram-wallet-ui/twa-ui-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  MainButtonContextProvider,
  useMainButtonContext,
} from './context/MainButtonContext';
import { useLocation } from 'react-router-dom';
import { ROUTES } from './router/routes';
import styled from '@emotion/styled';
import { lazy, Suspense, useState } from 'react';
import { usePersistedStore } from './store/persisted-store';
import { WalletSpinner } from './components';
const queryClient = new QueryClient();

const Router = lazy(() => import('./router/Router'));

const App = () =>  {
  const [height] = useState(window.innerHeight);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <MainButtonContextProvider>
          <AppContainer style={{ height }}>
            <Suspense fallback={<Fallback />}>
              <Router />
            </Suspense>
            <ActionButton />
          </AppContainer>
        </MainButtonContextProvider>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

const Fallback = () => {
  return (
    <Container size="sm" style={{ height: '100vh', position: 'relative' }}>
      <WalletSpinner width="80px" height="80px" />
    </Container>
  );
};



const AppContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});

function ActionButton() {
  const { onClick, text, disabled, progress } = useMainButtonContext();
  const location = useLocation();
    const { showOnboarding } = usePersistedStore();


  if (!showOnboarding && location.pathname === ROUTES.root) return null;

  if(!text) return null;

  return (
    <ButtonContainer>
      <MainButton
        disabled={disabled}
        progress={progress}
        onClick={onClick}
        text={text}
      />
    </ButtonContainer>
  );
}

const ButtonContainer = styled(Container)({
  position:'absolute',
  zIndex: 10,
  bottom: 10,
});


export default App;
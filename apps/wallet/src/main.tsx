import { Container, Flex } from '@chakra-ui/react';
import { lazy, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { WalletSpinner } from './components';

const App = lazy(() => import('./App'));

const Fallback = () => {
  return (
    <Container size="sm" pt={4}>
      <Flex justifyContent="center" style={{ paddingTop: 100 }}>
        <WalletSpinner />
      </Flex>
    </Container>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <StrictMode>
  <Router>
    <Suspense fallback={<Fallback />}>
      <App />
    </Suspense>
  </Router>

  // </StrictMode>
);

import { Container, Flex, Spinner } from '@chakra-ui/react';
import { lazy, StrictMode, Suspense } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';

const App = lazy(() => import('./App'));

const Fallback = () => {
  return (
    <Container size="sm" pt={4}>
      <Flex justifyContent="center" style={{ paddingTop: 100 }}>
        <Spinner width={100} height={100} color="#417FC6" />
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

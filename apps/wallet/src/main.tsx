import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import App from './App';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@telegram-wallet-ui/twa-ui-kit';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <Router>
    <QueryParamProvider adapter={ReactRouter6Adapter}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <App />
    </QueryParamProvider>
  </Router>
);

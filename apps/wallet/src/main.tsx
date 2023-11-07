import * as ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import * as Sentry from '@sentry/react';
import App from './App';
import { ColorModeScript } from '@chakra-ui/react';
import { theme } from '@telegram-wallet-ui/twa-ui-kit';
import Twa from '@twa-dev/sdk';
import './styles.css'
Twa.ready();

if (import.meta.env.PROD) {
  Sentry.init({
    dsn: 'https://9173b09233ee1b73d9d3a492bd4e5772@o4506145778565120.ingest.sentry.io/4506151658127360',
    integrations: [
      new Sentry.BrowserTracing({
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: [
          'localhost',
          import.meta.env.VITE_FAUCET_BACKEND_URL,
        ],
      }),
      new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
}

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

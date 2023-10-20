import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import { Root, Asset, Buy, SelectMethod } from './routes';
import { theme } from '@telegram-wallet-ui/twa-ui-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DepositAddress } from './routes/Deposit/DepositAddress';
import { TempUtils } from './routes/Deposit/TempUtils';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: '/asset/:assetId',
    element: <Asset />,
  },
  {
    path: '/deposit',
    element: <SelectMethod />,
  },
  {
    path: '/deposit/buy',
    element: <Buy />,
  },
  {
    path: '/deposit/crypto',
    element: <DepositAddress />,
  },
  {
    path: '/tempUtils',
    element: <TempUtils />,
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <RouterProvider router={router} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}

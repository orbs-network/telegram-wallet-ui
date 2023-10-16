import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './ErrorPage';
import { Root, Asset } from './routes';
import { theme } from '@telegram-wallet-ui/twa-ui-kit';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: 'asset/:assetId',
    element: <Asset />,
  },
]);

export function App() {
  return (
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  );
}

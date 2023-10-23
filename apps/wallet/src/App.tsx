import { ChakraProvider } from '@chakra-ui/react';
import { theme } from '@telegram-wallet-ui/twa-ui-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router } from './router/Router';
const queryClient = new QueryClient();

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <Router />
      </ChakraProvider>
    </QueryClientProvider>
  );
}


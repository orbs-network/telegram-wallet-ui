import { useMutation } from '@tanstack/react-query';
import { FaucetProvider } from '../lib/FaucetProvider';
import { web3Provider } from '../config';

export const faucetProvider = new FaucetProvider(
  import.meta.env.VITE_FAUCET_BACKEND_URL,
  web3Provider
);

export const useFaucet = () =>
  useMutation({
    mutationFn: async (erc20Token: string) => {
      await faucetProvider.requestIfNeeded(erc20Token);
    },
  });

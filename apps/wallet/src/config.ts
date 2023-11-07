import web3 from 'web3';
import { AccountProvider, LiquihubProvider, Web3Provider } from './lib';
import { FaucetProvider } from './lib/FaucetProvider';
import { CoinsProvider } from './lib/CoinsProvider';
import { SwapProvider } from './lib/SwapProvider';
import { Permit2Provider } from './lib/Permit2Provider';
import { LocalStorageProvider } from './lib/LocalStorageProvider';
import { EventsProvider } from './lib/EventsProvider';

export const isMumbai = import.meta.env.VITE_IS_MUMBAI === '1';

export const disabledTokens = ['TON'];

export const chainstackW3 = new web3(
  isMumbai
    ? `https://polygon-mumbai.g.alchemy.com/v2/${
        import.meta.env.VITE_ALCHEMY_API_KEY
      }`
    : 'https://nd-629-499-152.p2pify.com/9d54c0800de991110a4e8e5dc6300b3a'
);

// ---- TEMP: provider fallback for demo ----
export const alchemyW3 = new web3(
  `https://polygon-mainnet.g.alchemy.com/v2/${
    import.meta.env.VITE_ALCHEMY_API_KEY
  }`
);
const currentProvider = localStorage.getItem('currentProvider');
if (!currentProvider) {
  localStorage.setItem('currentProvider', 'chainstack');
}
const w3 = currentProvider === 'alchemy' ? alchemyW3 : chainstackW3;
// ------------------------------------------

export const TRANSAK_API_KEY = import.meta.env.VITE_TRANSAK_API_KEY;
export const TRANSAK_URL = import.meta.env.VITE_TRANSAK_URL;

export const accountProvider = new AccountProvider(w3);

export const account = accountProvider.account!;

export const web3Provider = new Web3Provider(w3, account);

export const liqHubProvider = new LiquihubProvider(web3Provider);

export const coinsProvider = new CoinsProvider();

export const permit2Provider = new Permit2Provider(
  web3Provider,
  new LocalStorageProvider()
);

export const eventsProvider = new EventsProvider(new LocalStorageProvider());

export const swapProvider = new SwapProvider(
  coinsProvider,
  liqHubProvider,
  permit2Provider,
  eventsProvider,
  web3Provider
);

// TODO: remove this
export type CryptoAsset = 'MATIC' | 'ETH' | 'USDC';

export const faucetProvider = new FaucetProvider(
  import.meta.env.VITE_FAUCET_BACKEND_URL,
  web3Provider,
  eventsProvider
);

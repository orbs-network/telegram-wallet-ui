import web3 from 'web3';

import { networks } from '@defi.org/web3-candies';

import { AccountProvider, LiquihubProvider, Web3Provider } from './lib';
import { ERC20sDataProvider } from './lib/ERC20sDataProvider';

// export const w3 = new web3(networks.poly.publicRpcUrl);
export const w3 = new web3(
  `https://polygon-mumbai.g.alchemy.com/v2/${
    import.meta.env.VITE_ALCHEMY_API_KEY
  }`
);

const accountHolder = new AccountProvider(w3);

export const account = accountHolder.account!;

export const web3Provider = new Web3Provider(w3, account);

export const liqHubProvider = new LiquihubProvider(web3Provider);

export type CryptoAsset = 'MATIC' | 'ETH' | 'USDC';

export const erc20sDataProvider = new ERC20sDataProvider();

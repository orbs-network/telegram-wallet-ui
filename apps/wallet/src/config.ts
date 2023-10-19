import web3 from 'web3';

import { networks } from '@defi.org/web3-candies';

import { AccountProvider, LiquihubProvider, Web3Provider } from './lib';

export const w3 = new web3(networks.poly.publicRpcUrl);

const accountHolder = new AccountProvider(w3);

export const account = accountHolder.account;

export const web3Provider = new Web3Provider(w3, account);

export const liqHubProvider = new LiquihubProvider(web3Provider);

export type CryptoAsset = 'MATIC' | 'ETH' | 'USDC';

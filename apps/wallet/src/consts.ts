import { Network } from './types';

export const POLYGON_EXPLORER = 'https://polygonscan.com';
export const INSUFFICIENT_FUNDS_ERROR = 'Insufficient balance';
export const ERROR_COLOR = '#ff3333';

export const NETWORKS: Network[] = [
  {
    name: 'ethereum',
    displayName: 'Ethereum',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    nativeTokenSymbol: 'ETH',
    enabled: false,
    wrappedTokenPrefix: 'W',
    tokenSuffix: 'ERC-20',
    alwaysUsePrefix: false,
  },
  {
    name: 'binance-smart-chain',
    displayName: 'BNB Chain',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    nativeTokenSymbol: 'BNB',
    enabled: false,
    wrappedTokenPrefix: 'W',
    tokenSuffix: 'BRC-20',
    alwaysUsePrefix: false,
  },
  {
    name: 'polygon',
    displayName: 'Polygon (Matic)',
    logo: 'https://s3.coinmarketcap.com/static-gravity/image/b8db9a2ac5004c1685a39728cdf4e100.png',
    nativeTokenSymbol: 'MATIC',
    enabled: true,
    wrappedTokenPrefix: 'W',
    tokenSuffix: 'ERC-20',
    alwaysUsePrefix: false,
  },
  {
    name: 'arbitrum',
    displayName: 'Arbitrum',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11841.png',
    nativeTokenSymbol: 'ARB',
    enabled: false,
    wrappedTokenPrefix: 'W',
    tokenSuffix: 'ERC-20',
    alwaysUsePrefix: false,
  },
  {
    name: 'ton',
    displayName: 'TON Blockchain',
    logo: 'https://s2.coinmarketcap.com/static/img/coins/64x64/11419.png',
    nativeTokenSymbol: 'TON',
    enabled: false,
    wrappedTokenPrefix: 'j',
    tokenSuffix: 'Jetton',
    alwaysUsePrefix: true,
  },
];

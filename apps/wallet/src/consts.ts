import { Network } from "./types";

export const POLYGON_EXPLORER = 'https://polygonscan.com';
export const INSUFFICIENT_FUNDS_ERROR = 'Insufficient balance';
export const ERROR_COLOR = '#ff3333';


export const NETWORKS: Network[] = [
  {
    name: 'ethereum',
    displayName: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
    symbol: 'ETH',
    enabled: false
  },
  {
    name: 'binance-smart-chain',
    displayName: 'Binance Smart Chain',
    logo: 'https://assets.coingecko.com/coins/images/825/small/binance-coin-logo.png?1547034615',
    symbol: 'BNB',
    enabled: false
  },
  {
    name: 'polygon',
    displayName: 'Polygon',
    logo: 'https://assets.coingecko.com/coins/images/4713/small/matic___polygon.jpg?1612939050',
    symbol: 'MATIC',
    enabled: true
  },
];
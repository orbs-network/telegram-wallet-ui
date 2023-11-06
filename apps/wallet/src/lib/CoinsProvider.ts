import { BNComparable, Token } from '../types';
import { amountBN, amountUi, dstAmount } from '../utils/conversion';
import BN, { BigNumber } from 'bignumber.js';
import { getDebug } from './utils/debug';

const debug = getDebug('CoinsProvider');

const coins = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: '0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6',
    decimals: 8,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1.png',
    coingeckoId: 'wrapped-bitcoin',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1027.png',
    coingeckoId: 'weth',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    address: '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    decimals: 6,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png',
    coingeckoId: 'tether',
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
    decimals: 6,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/3408.png',
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    address: '0xeCDCB5B88F8e3C15f95c720C51c71c9E2080525d',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png',
    coingeckoId: 'wbnb',
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    address: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/4943.png',
    coingeckoId: 'dai',
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    address: '0xCc2a9051E904916047c26C90f41c000D4f273456',
    decimals: 6,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/52.png',
    coingeckoId: 'ripple',
  },
  {
    symbol: 'SOL',
    name: 'SOL',
    address: '0x7DfF46370e9eA5f0Bad3C4E29711aD50062EA7A4',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5426.png',
    coingeckoId: 'solana',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/1975.png',
    coingeckoId: 'chainlink',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    address: '0x2C89bbc92BD86F8075d1DEcc58C7F4E0107f286b',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/64x64/5805.png',
    coingeckoId: 'avalanche-2',
  },
];

export class CoinsProvider {
  constructor() {}

  async fetchCoins() {
    return coins;
  }

  toRawAmount(token: Token, quantity: BNComparable) {
    return amountBN(token, quantity);
  }

  fromRawAmount(token: Token, amount: BN) {
    return amountUi(token, amount);
  }

  getMinAmountOut(
    srcCoin: Token,
    dstCoin: Token,
    srcCoinLatestPrice: number,
    dstCoinLatestPrice: number,
    quantity: BNComparable
  ) {
    const _dstAmount = dstAmount(
      srcCoin,
      dstCoin,
      quantity,
      new BN(srcCoinLatestPrice!),
      new BN(dstCoinLatestPrice!)
    )
      .dividedBy(1.05)
      .integerValue(BigNumber.ROUND_DOWN); // 5% price difference. TODO: this can be more competitive

    debug(
      `srcCoinLatestPrice: ${srcCoinLatestPrice}, dstCoinLatestPrice: ${dstCoinLatestPrice}, _dstAmount: ${_dstAmount} for quantity: ${quantity}, src decimals ${srcCoin.decimals}, dst decimals ${dstCoin.decimals}`
    );

    return _dstAmount;
  }
}

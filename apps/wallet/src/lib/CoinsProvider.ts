import { BNComparable, Token } from '../types';
import { amountBN, amountUi, dstAmount } from '../utils/conversion';
import BN, { BigNumber } from 'bignumber.js';
import { getDebug } from './utils/debug';

const debug = getDebug('CoinsProvider');

const coins = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    address: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',
    decimals: 8,
    chainId: 137,
    logoURI: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    coingeckoId: 'wrapped-bitcoin',
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    address: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1027.png',
    coingeckoId: 'weth',
  },
  {
    symbol: 'USDT',
    name: 'Tether',
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    decimals: 6,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/825.png',
    coingeckoId: 'tether',
  },
  {
    symbol: 'USDC',
    name: 'USDC',
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    decimals: 6,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/3408.png',
    coingeckoId: 'usd-coin',
  },
  {
    symbol: 'BNB',
    name: 'BNB',
    address: '0xecdcb5b88f8e3c15f95c720c51c71c9e2080525d',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1839.png',
    coingeckoId: 'wbnb',
  },
  {
    symbol: 'DAI',
    name: 'Dai',
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/4943.png',
    coingeckoId: 'dai',
  },
  {
    symbol: 'XRP',
    name: 'XRP',
    address: '0xcc2a9051e904916047c26c90f41c000d4f273456',
    decimals: 6,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/52.png',
    coingeckoId: 'ripple',
  },
  {
    symbol: 'SOL',
    name: 'SOL',
    address: '0x7dff46370e9ea5f0bad3c4e29711ad50062ea7a4',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/5426.png',
    coingeckoId: 'solana',
  },
  {
    symbol: 'LINK',
    name: 'Chainlink',
    address: '0x53e0bca35ec356bd5dddfebbd1fc0fd03fabad39',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/1975.png',
    coingeckoId: 'chainlink',
  },
  {
    symbol: 'AVAX',
    name: 'Avalanche',
    address: '0x2c89bbc92bd86f8075d1decc58c7f4e0107f286b',
    decimals: 18,
    chainId: 137,
    logoURI: 'https://s2.coinmarketcap.com/static/img/coins/128x128/5805.png',
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

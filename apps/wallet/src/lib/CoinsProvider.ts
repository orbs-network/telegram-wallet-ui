import { erc20s, zeroAddress } from '@defi.org/web3-candies';
import { BNComparable, Token, TokenListResponse } from '../types';
import { Fetcher } from '../utils/fetcher';
import { amountBN, amountUi, dstAmount } from '../utils/conversion';
import BN, { BigNumber } from 'bignumber.js';
import { fetchLatestPrice } from '../utils/fetchLatestPrice';
import { getDebug } from './utils/debug';
import { TTLCache } from './TTLCache';
import fallbackTokenList from './res/polygon';

const debug = getDebug('CoinsProvider');

export class CoinsProvider {
  coinsUrl: string;

  constructor(isMumbai: boolean, private ttlCache: TTLCache) {
    this.coinsUrl = `https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/${
      isMumbai ? 'mumbai' : 'polygon'
    }.json`;
  }

  async fetchCoins() {
    let data;
    try {
      data = await this.ttlCache.execute(
        'coins',
        () => Fetcher.get<TokenListResponse>(this.coinsUrl),
        60 * 60 * 1000
      );
    } catch (e) {
      data = fallbackTokenList;
    }

    const parsed: Array<Token> = data.map((coin: any): Token => {
      return {
        symbol: coin.symbol,
        address: coin.address,
        decimals: coin.decimals,
        coingeckoId: coin.coingeckoId ?? '',
        logoURI: coin.logoURI,
        name: coin.name,
      };
    });

    // TODO this doesn't support mumbai but it only hurts sort order
    // so leaving as-is for now
    const candiesAddresses = [
      zeroAddress,
      ...Object.values(erc20s.poly).map((t) => t().address),
    ];

    return parsed
      .sort((a, b) => {
        const indexA = candiesAddresses.indexOf(a.address);
        const indexB = candiesAddresses.indexOf(b.address);
        return indexA >= 0 && indexB >= 0
          ? indexA - indexB
          : indexA >= 0
          ? -1
          : indexB >= 0
          ? 1
          : 0;
      })
      .slice(0, 10);
  }

  toRawAmount(token: Token, quantity: BNComparable) {
    return amountBN(token, quantity);
  }

  fromRawAmount(token: Token, amount: BN) {
    return amountUi(token, amount);
  }

  async getMinAmountOut(
    srcCoin: Token,
    dstCoin: Token,
    quantity: BNComparable
  ) {
    const srcCoinLatestPrice = await this.ttlCache.execute(
      srcCoin.coingeckoId,
      () => fetchLatestPrice(srcCoin.coingeckoId),
      60 * 1000
    );

    const dstCoinLatestPrice = await this.ttlCache.execute(
      dstCoin.coingeckoId,
      () => fetchLatestPrice(dstCoin.coingeckoId),
      60 * 1000
    );

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

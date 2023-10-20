import { erc20s, zeroAddress } from '@defi.org/web3-candies';
import { BNComparable, Token, TokenListResponse } from '../types';
import { Fetcher } from '../utils/fetcher';
import { amountBN, dstAmount } from '../utils/conversion';
import BN from 'bignumber.js';
import { fetchLatestPrice } from '../utils/fetchLatestPrice';

export class CoinsProvider {
  coinsUrl: string;

  constructor(isMumbai: boolean) {
    this.coinsUrl = `https://raw.githubusercontent.com/viaprotocol/tokenlists/main/tokenlists/${
      isMumbai ? 'mumbai' : 'polygon'
    }.json`;
  }

  async fetchCoins() {
    const data = await Fetcher.get<TokenListResponse>(this.coinsUrl);

    const parsed = data.map((coin): Token => {
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

  async getMinAmountOut(
    srcCoin: Token,
    dstCoin: Token,
    quantity: BNComparable
  ) {
    const srcCoinLatestPrice = await fetchLatestPrice(srcCoin.coingeckoId);
    const dstCoinLatestPrice = await fetchLatestPrice(dstCoin.coingeckoId);

    const _dstAmount = dstAmount(
      srcCoin,
      dstCoin,
      amountBN(srcCoin, quantity),
      new BN(srcCoinLatestPrice!),
      new BN(dstCoinLatestPrice!)
    ).dividedBy(1.05); // 5% slippage. TODO: this can be more competitive
    // TODO -> Liquidity hub seems to ignore the min amount out we're passing in 🤔

    return _dstAmount;
  }
}

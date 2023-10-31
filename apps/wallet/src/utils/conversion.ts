import { convertDecimals, parsebn, TokenData } from '@defi.org/web3-candies';
import BN from 'bignumber.js';
import { BNComparable } from '../types';

export const amountBN = (token: TokenData | undefined, amount: BNComparable) =>
  parsebn(amount).times(BN(10).pow(token?.decimals || 0));

export const amountUi = (
  token: TokenData | undefined,
  amount: BN,
  maxDecimals?: number
) => {
  if (!token) return '';
  const percision = BN(10).pow(token?.decimals || 0);

  const output = amount.times(percision).idiv(percision).div(percision);

  return maxDecimals
    ? toUiDisplay(output.toFormat(), maxDecimals)
    : output.toFormat();
};

export const dstAmount = (
  srcToken: TokenData,
  dstToken: TokenData,
  srcAmount: BN.Value,
  srcUsdMarket: BN.Value,
  dstUsdMarket: BN.Value
): BN =>
  convertDecimals(
    BN(srcAmount).times(srcUsdMarket).div(dstUsdMarket),
    srcToken.decimals,
    dstToken.decimals
  ).integerValue(BN.ROUND_FLOOR);

export const toUiDisplay = (amount: string, decimals = 5) => {
  return Number(BN(amount).toFixed(decimals)).toString();
};

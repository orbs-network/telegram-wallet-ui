import { convertDecimals, parsebn, TokenData } from "@defi.org/web3-candies";
import BN from "bignumber.js";

export const amountBN = (token: TokenData | undefined, amount: string) =>
  parsebn(amount).times(BN(10).pow(token?.decimals || 0));

export const amountUi = (token: TokenData | undefined, amount: BN) => {
  if (!token) return "";
  const percision = BN(10).pow(token?.decimals || 0);
  return amount.times(percision).idiv(percision).div(percision).toFormat();
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

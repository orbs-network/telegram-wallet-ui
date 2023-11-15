export const ROUTES = {
  root: '/',
  deposit: '/deposit',
  depositSelectCoin: '/deposit/:method/coin',
  depositBuy: '/deposit/buy',
  depositCrypto: '/deposit/:assetId/crypto',
  asset: '/asset/:assetId',
  withdraw: '/withdraw',
  withdrawAddress: '/withdraw/:assetId/address',
  withdrawAmount: '/withdraw/:assetId/:recipient/amount',
  withdrawSummary: '/withdraw/:assetId/:recipient/amount/:amount/summary',
  withdrawSuccess: '/withdraw/:assetId/:recipient/amount/:amount/success',
  onboardingPage1: '/1',
  onboardingPage2: '/2',
  trade: '/trade',
  tradeInTokenSelect: '/trade-in-select',
  tradeOutTokenSelect: '/trade-out-select',
  tradeReview: '/trade/:inToken/:outToken/:inAmount/review',
  tradeSuccess: '/trade/:outToken/:outAmount/:txHash/success',
  transaction: '/transaction/:txId',
  networkSelect: '/network/:assetId',
};

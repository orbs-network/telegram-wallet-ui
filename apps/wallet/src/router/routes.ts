import _ from 'lodash';

export const ROUTES = {
  root: '/',
  deposit: '/deposit',
  depositBuy: '/deposit/buy',
  depositCrypto: '/deposit/crypto',
  tempUtils: '/tempUtils',
  asset: '/asset/:assetId',
  withdraw: '/withdraw',
  withdrawAddress: '/withdraw/:assetId/address',
  withdrawAmount: '/withdraw/:assetId/:recipient/amount',
  withdrawSummary: '/withdraw/:assetId/:recipient/amount/:amount/summary',
  withdrawSuccess: '/withdraw/:assetId/:recipient/amount/:amount/success',
  onboardingPage1: '/1',
  onboardingPage2: '/2',
};

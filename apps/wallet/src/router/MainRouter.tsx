import { RouteObject } from 'react-router-dom';
import { AnimatedRouter } from './AnimatedRouter';
import { Asset } from '../routes/Asset';
import { Buy, SelectMethod } from '../routes/Deposit';
import { DepositAddress } from '../routes/Deposit/DepositAddress';
import { TempUtils } from '../routes/Deposit/TempUtils';
import { Root } from '../routes/Root';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Root />,
  },
  {
    path: '/deposit',
    element: <SelectMethod />,
  },
  {
    path: '/deposit/buy',
    element: <Buy />,
  },
  {
    path: '/deposit/crypto',
    element: <DepositAddress />,
  },
  {
    path: '/tempUtils',
    element: <TempUtils />,
  },
  {
    path: '/asset/:assetId',
    element: <Asset />,
  },
];

export const MainRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

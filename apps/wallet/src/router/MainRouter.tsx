import { AnimatedRouter } from './AnimatedRouter';
import {
  Asset,
  Buy,
  SelectMethod,
  DepositAddress,
  TempUtils,
  Debug,
  Home,
  Trade,
  Withdraw,
  WithdrawAddress,
  WithdrawAmount,
  WithdrawSuccess,
  WithdrawSummary,
} from '../routes';
import { RouteObject } from 'react-router-dom';
import { ROUTES } from './routes';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: ROUTES.deposit,
    element: <SelectMethod />,
  },
  {
    path: ROUTES.depositBuy,
    element: <Buy />,
  },
  {
    path: ROUTES.depositCrypto,
    element: <DepositAddress />,
  },
  {
    path: ROUTES.tempUtils,
    element: <TempUtils />,
  },
  {
    path: ROUTES.asset,
    element: <Asset />,
  },
  {
    path: '/debug',
    element: <Debug />,
  },
  {
    path: ROUTES.withdraw,
    element: <Withdraw />,
  },
  {
    path: ROUTES.withdrawAddress,
    element: <WithdrawAddress />,
  },
  {
    path: ROUTES.withdrawAmount,
    element: <WithdrawAmount />,
  },
  {
    path: ROUTES.withdrawSummary,
    element: <WithdrawSummary />,
  },
  {
    path: ROUTES.withdrawSuccess,
    element: <WithdrawSuccess />,
  },
  {
    path: '/trade',
    element: <Trade />,
  },
];

export const MainRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

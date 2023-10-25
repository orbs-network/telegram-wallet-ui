import { AnimatedRouter } from './AnimatedRouter';
import { Asset } from '../routes/Asset';
import { Buy, SelectMethod } from '../routes/Deposit';
import { DepositAddress } from '../routes/Deposit/DepositAddress';
import { TempUtils } from '../routes/Deposit/TempUtils';
import { Root } from '../routes/Root';
import { Withdraw, WithdrawAddress, WithdrawAmount, WithdrawSuccess, WithdrawSummary } from '../routes';
import { ROUTES } from './routes';
import { RouteObject } from 'react-router-dom';

const routes: RouteObject[] = [
  {
    path: ROUTES.root,
    element: <Root />,
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
];

export const MainRouter = () => {
  return <AnimatedRouter routes={routes} />;
};

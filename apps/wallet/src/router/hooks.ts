import { useNavigate, useParams } from 'react-router-dom';
import { URLParams } from '../types';
import { ROUTES } from './routes';

export const useNavigation = () => {
  const navigate = useNavigate();
  const params = useParams<URLParams>();

  const withdraw = () => {
    navigate(ROUTES.withdraw);
  };

  const deposit = () => {
    navigate(ROUTES.deposit);
  };

  const depositBuy = () => {
    navigate(ROUTES.depositBuy);
  };

  const depositCrypto = () => {
    navigate(ROUTES.depositCrypto);
  };

  const tempUtils = () => {
    navigate(ROUTES.tempUtils);
  };

  const asset = (assetId: string) => {
    navigate(ROUTES.asset.replace(':assetId', assetId));
  };

  const withdrawAddress = (assetId: string) => {
    navigate(ROUTES.withdrawAddress.replace(':assetId', assetId));
  };

  const withdrawAmount = (recipient: string) => {
    console.log(recipient);
    
    navigate(
      ROUTES.withdrawAmount
        .replace(':assetId', params.assetId || '')
        .replace(':recipient', recipient)
    );
  };

  return {
    withdraw,
    deposit,
    depositBuy,
    depositCrypto,
    tempUtils,
    asset,
    withdrawAddress,
    withdrawAmount,
  };
};

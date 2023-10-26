import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from './routes';

export const useNavigation = () => {
  const navigate = useNavigate();

  const withdraw = useCallback(() => {
    navigate(ROUTES.withdraw);
  }, [navigate]);

  const deposit = useCallback(() => {
    navigate(ROUTES.deposit);
  }, [navigate]);

  const depositBuy = useCallback(() => {
    navigate(ROUTES.depositBuy);
  }, [navigate]);

  const depositCrypto = useCallback(() => {
    navigate(ROUTES.depositCrypto);
  }, [navigate]);

  const tempUtils = useCallback(() => {
    navigate(ROUTES.tempUtils);
  }, [navigate]);

  const asset = useCallback(
    (assetId: string) => {
      navigate(ROUTES.asset.replace(':assetId', assetId));
    },
    [navigate]
  );

  const withdrawAddress = useCallback(
    (assetId: string) => {
      navigate(ROUTES.withdrawAddress.replace(':assetId', assetId));
    },
    [navigate]
  );

  const withdrawAmount = useCallback(
    (assetId: string, recipient: string) => {
      navigate(
        ROUTES.withdrawAmount
          .replace(':assetId', assetId || '')
          .replace(':recipient', recipient)
      );
    },
    [navigate]
  );

  const withdrawSummary = useCallback(
    (assetId: string, recipient: string, amount: string) => {
      navigate(
        ROUTES.withdrawSummary
          .replace(':assetId', assetId || '')
          .replace(':recipient', recipient)
          .replace(':amount', amount)
      );
    },
    [navigate]
  );

   const withdrawSuccess = useCallback(
     (assetId: string, recipient: string, amount: string) => {
       navigate(
         ROUTES.withdrawSuccess
           .replace(':assetId', assetId || '')
           .replace(':recipient', recipient)
           .replace(':amount', amount)
       );
     },
     [navigate]
   );

  return {
    withdraw,
    deposit,
    depositBuy,
    depositCrypto,
    tempUtils,
    asset,
    withdrawAddress,
    withdrawAmount,
    withdrawSummary,
    withdrawSuccess,
  };
};

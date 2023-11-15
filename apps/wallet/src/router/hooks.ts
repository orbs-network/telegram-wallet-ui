import { useCallback } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';
import { ROUTES } from './routes';

export const useNavigation = () => {
  const navigate = useNavigate();

  const withdraw = useCallback(() => {
    navigate(ROUTES.withdraw);
  }, [navigate]);

  const deposit = useCallback(() => {
    navigate(ROUTES.deposit);
  }, [navigate]);

  const depositSelectCoin = useCallback(
    (method: string) => {
      navigate(ROUTES.depositSelectCoin.replace(':method', method));
    },
    [navigate]
  );

  const depositBuy = useCallback(
    (assetId: string) => {
      navigate(generatePath(ROUTES.depositBuy, { assetId }));
    },
    [navigate]
  );

  const depositCrypto = useCallback(
    (assetId: string) => {
      navigate(ROUTES.depositCrypto.replace(':assetId', assetId));
    },
    [navigate]
  );

  const depositCryptoPath = useCallback((assetId: string) => {
    return ROUTES.depositCrypto.replace(':assetId', assetId);
  }, []);
  


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

  const tradeReview = useCallback(
    (inToken: string, outToken: string, inAmount: string) => {
      navigate(
        ROUTES.tradeReview

          .replace(':inToken', inToken || '')
          .replace(':outToken', outToken || '')
          .replace(':inAmount', inAmount || '')
      );
    },
    [navigate]
  );

  const tradeSuccess = useCallback(
    (outToken: string, outAmount: string, txHash: string) => {
      navigate(
        ROUTES.tradeSuccess

          .replace(':outToken', outToken || '')
          .replace(':outAmount', outAmount || '')
          .replace(':txHash', txHash)
      );
    },
    [navigate]
  );

  return {
    withdraw,
    deposit,
    depositBuy,
    depositCrypto,
    asset,
    withdrawAddress,
    withdrawAmount,
    withdrawSummary,
    withdrawSuccess,
    depositSelectCoin,
    tradeReview,
    tradeSuccess,
    depositCryptoPath,
  };
};

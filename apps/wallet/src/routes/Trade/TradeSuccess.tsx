import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessPage } from '../../components';
import { useFormatNumber, useGetTokenFromList } from '../../hooks';
import { useUpdateMainButton } from '../../store/main-button-store';
import { URLParams } from '../../types';



export function TradeSuccess() {
  const { outToken, outAmount, txHash } = useParams<URLParams>();

  const formattedOutAmount = useFormatNumber({ value: outAmount });
  const navigate = useNavigate();
  const token = useGetTokenFromList(outToken);

  const onClick = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useUpdateMainButton({
    text: 'DONE',
    onClick,
    disabled: false,
    progress: false,
  });

  return (
    <SuccessPage>
      <SuccessPage.Title text="Exchange completed" />
      <SuccessPage.Text
        text={
          <>
            <strong>
              {formattedOutAmount} {`${token?.symbolDisplay || ''} `}
            </strong>
            has been deposited to your wallet.
          </>
        }
      />
      <SuccessPage.Link text="View transaction" txHash={txHash} />
    </SuccessPage>
  );
}

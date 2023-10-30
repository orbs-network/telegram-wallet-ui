import { Text, VStack } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessPage } from '../../components';
import { useMainButtonContext } from '../../context/MainButtonContext';
import { ROUTES } from '../../router/routes';
import { URLParams } from '../../types';
import { useGetTokenFromList } from '../../hooks';
import { css } from '@emotion/react';

const styles = {
  title: css`
    font-size: 24px;
    font-weight: 700;
  `,
  text: css`
    font-size: 14px;
  `,
  recipient: css`
    font-size: 14px;
    max-width: 180px;
  `,
  smallTitle: css`
    font-size: 14px;
    opacity: 0.5;
  `,
};

export function WithdrawSuccess() {
  const { onSetButton, resetButton } = useMainButtonContext();
  const navigate = useNavigate();
  const { assetId, amount, recipient } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const symbol = token?.symbol || '';

  useEffect(() => {
    onSetButton({
      text: 'DONE',
      //   onClick: () =>
      //     mutate({ assetId: assetId!, recipient: recipient!, amount: amount! }),
      onClick: () => {
        navigate(ROUTES.root);
        resetButton();
      },
    });
  }, [onSetButton, navigate, resetButton]);

  return (
    <SuccessPage>
      <VStack>
        <Text css={styles.title}>{symbol} Sent</Text>
        <Text css={styles.text}>
          Your transaction has been sent to the network and will be proccessed
          in a few seconds
        </Text>
        <Text css={styles.smallTitle}>
          {amount} {symbol} has been sent to{' '}
        </Text>
        <Text css={styles.recipient} style={{ wordBreak: 'break-all' }}>
          {recipient}
        </Text>
      </VStack>
    </SuccessPage>
  );
}

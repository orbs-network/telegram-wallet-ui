import { Text, VStack } from '@chakra-ui/react';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SuccessPage } from '../../components';
import { ROUTES } from '../../router/routes';
import { URLParams } from '../../types';
import { useGetTokenFromList } from '../../hooks';
import { css } from '@emotion/react';
import { useUpdateMainButton } from '../../store/main-button-store';

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
  const navigate = useNavigate();
  const { assetId, amount, recipient } = useParams<URLParams>();
  const token = useGetTokenFromList(assetId);
  const symbol = token?.symbol || '';

  const onSubmit = useCallback(() => {
    navigate(ROUTES.root);
  }, [navigate]);

  useUpdateMainButton({
    text: 'Done',
    onClick: onSubmit,
  });

  return (
    <SuccessPage>
      <VStack>
        <Text css={styles.title}>{symbol.toUpperCase()} Sent</Text>
        <Text css={styles.text}>
          Your transaction has been sent to the network and will be proccessed
          in a few seconds
        </Text>
        <Text css={styles.smallTitle}>
          {amount} {symbol.toUpperCase()} has been sent to{' '}
        </Text>
        <Text css={styles.recipient} style={{ wordBreak: 'break-all' }}>
          {recipient}
        </Text>
      </VStack>
    </SuccessPage>
  );
}

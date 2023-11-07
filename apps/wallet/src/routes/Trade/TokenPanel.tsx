/* eslint-disable @typescript-eslint/no-explicit-any */
import { Avatar, Box, Flex, Text, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo } from 'react';
import { BsChevronCompactRight } from 'react-icons/bs';
import { CryptoAmountInput } from '../../components';
import { useFormatNumber } from '../../hooks';
import { TokenData } from '../../types';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';
import { flash } from '../../styles';
import { ERROR_COLOR, INSUFFICIENT_FUNDS_ERROR } from '../../consts';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../router/routes';
import { useTradeContext } from './context';

const outAmountStyles = css`
  animation: ${flash} 1s linear infinite;
`;

const styles = {
  container: css`
    align-items: flex-start;
  `,
  header: css`
    align-items: center;
    gap: 8px;
    justify-content: space-between;
    width: 100%;
  `,
  max: css`
    color: ${colors.link_color};
  `,
  balance: css`
    font-size: 14px;
    align-items: center;
    gap: 4px;
    p {
      color: ${colors.hint_color};
    }
  `,
  closeButton: css`
    z-index: 1;
    outline: none;
    border: none;
  `,
  drawerContent: css`
    padding-top: 20px;
  `,
  error: css`
    color: ${ERROR_COLOR};
    font-size: 16px;
  `,
  symbol: css`
    font-size: 24px;
  `,
};

const TokenPanelHeader = ({
  token,
  isInToken,
  onChange,
}: {
  token?: TokenData;
  isInToken?: boolean;
  onChange?: (value: string) => void;
}) => {
  const formattedBalance = useFormatNumber({
    value: token?.balance,
    decimalScale: 4,
  });

  return (
    <Flex css={styles.header}>
      <Flex alignItems="center" gap="8px">
        <Avatar width={30} height={30} src={token?.logoURI} />
        {isInToken && <Text fontSize="14px">You pay</Text>}
        {!isInToken && <Text fontSize="14px">You receive</Text>}
      </Flex>
      {isInToken && onChange && token && (
        <CryptoAmountInput.MaxButton
          tokenSymbol={token.symbol}
          onChange={onChange}
        />
      )}
    </Flex>
  );
};

const StyledErrorMaxBtn = styled('span')({
  color: colors.link_color,
});

export const TokenPanel = ({
  quotePending,
  value,
  onChange,
  onTokenSelect,
  filterTokenSymbol,
  token,
  isInToken,
  error,
  otherTokenSymbol,
  name,
}: {
  value: string;
  onChange?: (value: string) => void;
  onTokenSelect: (token: TokenData) => void;
  filterTokenSymbol?: string;
  quotePending?: boolean;
  token?: TokenData;
  isInToken?: boolean;
  error?: string;
  otherTokenSymbol?: string;
  name: string;
}) => {
  const { setDisableMainButtonUpdate } = useTradeContext();
  const handleErorrComponent = useMemo(() => {
    if (error === INSUFFICIENT_FUNDS_ERROR && token?.balance) {
      return (
        <Text css={styles.error}>
          Insufficient funds.{' '}
          <StyledErrorMaxBtn onClick={() => onChange?.(token.balance)}>
            Exchange max
          </StyledErrorMaxBtn>
        </Text>
      );
    }
  }, [error, onChange, token?.balance]);

  const tokenSelectPath = useMemo(() => {
    if (isInToken) {
      return ROUTES.tradeInTokenSelect;
    }
    return ROUTES.tradeOutTokenSelect;
  }, [isInToken]);

  return (
    <VStack css={styles.container}>
      <TokenPanelHeader
        onChange={onChange}
        token={token}
        isInToken={isInToken}
      />

      <Flex css={quotePending && outAmountStyles}>
        <CryptoAmountInput
          otherTokenSymbol={otherTokenSymbol}
          value={value}
          tokenSymbol={token?.symbol}
          onChange={onChange}
          editable={!!isInToken}
          name={name}
          error={error}
          errorComponent={handleErorrComponent}
          sideContent={
            <Link to={tokenSelectPath} onClick={setDisableMainButtonUpdate}>
              <CryptoAmountInput.Symbol
                symbol={token?.symbolDisplay || 'Select'}
                icon={<BsChevronCompactRight />}
              />
            </Link>
          }
        />
      </Flex>
    </VStack>
  );
};

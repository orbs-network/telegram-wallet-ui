/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Avatar,
  Box,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Text,
  VStack,
} from '@chakra-ui/react';
import { css, keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useMemo, useRef, useState } from 'react';
import { BiSolidChevronRight } from 'react-icons/bi';
import { CryptoAmountInput, SelectToken } from '../../components';
import { useFormatNumber, useUserData } from '../../hooks';
import { TokenData } from '../../types';
import { IoClose } from 'react-icons/io5';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';
const flash = keyframes`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.1;
  }

  100% {
    opacity: 1;
  }
`;

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
        <Flex css={styles.balance}>
          <Box onClick={() => onChange(token?.balance)} css={styles.max}>
            Max:{' '}
          </Box>
          <Text fontSize="14px">
            {formattedBalance} {token?.symbol.toUpperCase()}
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

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
  return (
    <VStack css={styles.container}>
      <TokenPanelHeader
        onChange={onChange}
        token={token}
        isInToken={isInToken}
      />
      <Flex>
        <Box css={quotePending && outAmountStyles}>
          <CryptoAmountInput
            hideSymbol
            otherTokenSymbol={otherTokenSymbol}
            value={value}
            tokenSymbol={token?.symbol}
            onChange={onChange}
            editable={!!isInToken}
            name={name}
            error={error}
          />
        </Box>

        <TokenSelectDrawer
          filterTokenSymbol={filterTokenSymbol}
          onSelect={onTokenSelect}
          token={token}
        />
      </Flex>
    </VStack>
  );
};

const TokenSelectDrawer = ({
  onSelect,
  filterTokenSymbol,
  token,
}: {
  onSelect: (token: TokenData) => void;
  filterTokenSymbol?: string;
  token?: TokenData;
}) => {
  const { data, dataUpdatedAt } = useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<any>();

  const tokens = useMemo(() => {
    if (!data) return [];
    return Object.values(data.tokens).filter(
      (token) => token.symbol !== filterTokenSymbol
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterTokenSymbol, dataUpdatedAt]);

  return (
    <Flex alignItems="center">
      <TokenSelectButton ref={btnRef.current} onClick={() => setIsOpen(true)}>
        <Text>{token ? token.symbol?.toUpperCase() : 'Select'}</Text>
        <BiSolidChevronRight />
      </TokenSelectButton>
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnOverlayClick={true}
        finalFocusRef={btnRef}
        size="full"
      >
        <DrawerOverlay />
        <DrawerContent css={styles.drawerContent}>
          <StyledClose onClick={() => setIsOpen(false)}>
            <IoClose />
          </StyledClose>
          <StyledTokenList
            onSelect={(token) => {
              onSelect(token);
              setIsOpen(false);
            }}
            tokens={tokens}
          />
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

const TokenSelectButton = styled(Box)({
  height: 'auto',
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  top: '-10px',
  '& p': {
    color: colors.hint_color,
    fontSize: '26px',
    fontWeight: 700,
  },
  svg: {
    color: colors.hint_color,
    fontSize: '26px',
  },
});

const StyledTokenList = styled(SelectToken)({
  overflowY: 'auto',
});

const StyledClose = styled('button')({
  position: 'relative',

  zIndex: 1,
  outline: 'none',
  padding: 0,
  marginRight: 20,
  marginLeft: 'auto',
  svg: {
    width: '24px',
    height: '24px',
  },
});

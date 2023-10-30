/* eslint-disable @typescript-eslint/no-explicit-any */
import {
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

export const TokenPanel = ({
  quotePending,
  value,
  symbol,
  name,
  onChange,
  onTokenSelect,
  editable = false,
  filterToken,
  balance,
}: {
  value: string;
  symbol?: string;
  name: string;
  onChange?: (value: string) => void;
  onTokenSelect: (token: TokenData) => void;
  editable?: boolean;
  filterToken?: string;
  balance?: string;
  quotePending?: boolean;
}) => {
  return (
    <Flex>
      <Box css={quotePending && outAmountStyles}>
        <CryptoAmountInput
          hideSymbol
          name={name}
          value={value}
          tokenSymbol={symbol}
          onChange={onChange}
          editable={editable}
        />
      </Box>

      <TokenSelectDrawer
        filterToken={filterToken}
        onSelect={onTokenSelect}
        selected={symbol}
        balance={balance}
      />
    </Flex>
  );
};

const TokenSelectDrawer = ({
  onSelect,
  selected,
  filterToken,
  balance,
}: {
  onSelect: (token: TokenData) => void;
  selected?: string;
  filterToken?: string;
  balance?: string;
}) => {
  const { data, dataUpdatedAt } = useUserData();
  const [isOpen, setIsOpen] = useState(false);
  const btnRef = useRef<any>();

  const formattedBalance = useFormatNumber({ value: balance });

  const tokens = useMemo(() => {
    if (!data) return [];
    return Object.values(data.tokens).filter(
      (token) => token.symbol !== filterToken
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterToken, dataUpdatedAt]);

  return (
    <Flex alignItems="center">
      <TokenSelectButton ref={btnRef.current} onClick={() => setIsOpen(true)}>
        <VStack>
          <Flex alignItems="center">
            <Text>{selected ? selected?.toUpperCase() : 'Select Token'}</Text>
            <BiSolidChevronRight />
          </Flex>
          <Text>{formattedBalance}</Text>
        </VStack>
      </TokenSelectButton>
      <Drawer
        placement="bottom"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        closeOnOverlayClick={true}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
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
  '& p': {
    color: '#9D9D9D',
    fontSize: '26px',
    fontWeight: 700,
  },
  svg: {
    color: '#9D9D9D',
    fontSize: '26px',
  },
});

const StyledTokenList = styled(SelectToken)({
  overflowY: 'auto',
});

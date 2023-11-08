import { Avatar, Box, Heading, Skeleton, Text, VStack } from '@chakra-ui/react';
import { colors, List, ListItem, Twa } from '@telegram-wallet-ui/twa-ui-kit';
import _ from 'lodash';
import { useFormatNumber, useMultiplyPriceByAmount } from '../hooks';
import { TokenData, TokensListProps } from '../types';
import BN from 'bignumber.js';
import { css } from '@emotion/react';

const styles = {
  showMoreBtn: css`
    width: 100%;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    color: ${colors.button_color};
    padding: 1rem 1rem 0.5rem 1rem;
  `,
};

export function TokensList({
  onSelect,
  className = '',
  tokens,
  mode,
  disabledTokens,
  selected,
  css = {},
  showMoreBtn,
}: TokensListProps) {
  const isLoading = !tokens || _.isEmpty(tokens);

  return (
    <VStack spacing={3} alignItems="stretch">
      <List css={css} className={className} mode={mode} isLoading={isLoading}>
        {_.map(tokens, (token) => {
          const isDisabled = disabledTokens
            ?.map((t) => t.toLowerCase())
            .includes(token.symbol.toLowerCase());
          const isSelected = selected === token.symbol;
          return (
            <TokenListItem
              disabled={isDisabled}
              selected={isSelected}
              balance={token.balance}
              onClick={() => onSelect(token)}
              key={token.address}
              token={token}
            />
          );
        })}
        {showMoreBtn && (
          <Box
            css={styles.showMoreBtn}
            onClick={() => Twa.showAlert('Coming soon')}
          >
            Show more
          </Box>
        )}
      </List>
    </VStack>
  );
}
type TokenListItemProps = {
  token: TokenData;
  balance?: string;
  usd?: string;
  onClick?: () => void;
  className?: string;
  EndIconSlot?: React.ReactNode;
  selected?: boolean;
  disabled?: boolean;
};

function TokenListItem({
  token,
  onClick,
  EndIconSlot,
  selected,
  disabled,
}: TokenListItemProps) {
  return (
    <ListItem
      className={disabled ? `token-list-item-disabled` : ''}
      selected={selected}
      onClick={
        disabled
          ? () => {
              Twa.showAlert('Coming soon');
            }
          : onClick
      }
      StartIconSlot={<Avatar width="40px" height="40px" src={token.logoURI} />}
      EndIconSlot={EndIconSlot}
      EndTextSlot={<USD token={token} />}
      StartTextSlot={
        <VStack alignItems="flex-start" gap="1px">
          <Heading fontSize="17px" as="h3" variant="bodyTitle">
            {token.name}
          </Heading>
          <Balance token={token} />
        </VStack>
      }
    />
  );
}

const USD = ({ token }: { token: TokenData }) => {
  const value = useMultiplyPriceByAmount(token.coingeckoId, token.balance);

  const formattedAmount = useFormatNumber({
    value: value || '0',
    decimalScale: 2,
  });

  if (!formattedAmount) {
    return (
      <Skeleton
        height="13px"
        width="60px"
        borderRadius="14px"
        marginTop="2px"
      />
    );
  }

  return (
    <Text variant="bodyText">
      ${BN(formattedAmount).toFixed(2, BN.ROUND_HALF_UP)}
    </Text>
  );
};

const Balance = ({ token }: { token: TokenData }) => {
  const formattedAmount = useFormatNumber({
    value: token.balance || '0',
    decimalScale: 3,
  });

  return (
    <Text variant="hint">
      {formattedAmount} {token.symbolDisplay}
    </Text>
  );
};

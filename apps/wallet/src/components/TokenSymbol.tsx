import { Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';
import React from 'react'

const styles = {
  text: css`
    font-size: 32px;
    font-weight: 700;
    color: ${colors.hint_color};
    position: absolute;
    bottom: 10px;
    pointer-events: none;
  `,
};

export function TokenSymbol({ symbol }: { symbol: string }) {
  return <Text css={styles.text}>{symbol}</Text>;
}


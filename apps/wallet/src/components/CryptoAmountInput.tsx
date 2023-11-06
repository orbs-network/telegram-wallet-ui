import { VStack, Flex, Text, Box } from '@chakra-ui/react';
import { CSSProperties, ReactNode, useEffect, useMemo } from 'react';
import {
  useMultiplyPriceByAmount,
  useFormatNumber,
  useGetTokenFromList,
  useExchangeRate,
} from '../hooks';
import { getTextSizeInPixels } from '../utils/utils';
import { css, Interpolation } from '@emotion/react';
import styled from '@emotion/styled';
import { NumericFormat } from 'react-number-format';
import { useAnimate } from 'framer-motion';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';
import Twa from '@twa-dev/sdk';
import { ERROR_COLOR } from '../consts';

const styles = {
  inputContainer: css`
    position: relative;
  `,
  inputSymbol: css`
    p,
    svg {
      font-size: 34px;
      font-weight: 700;
      color: ${colors.hint_color};
    }
  `,
  usd: css`
    padding-left: 7px;
  `,
  error: css`
    color: ${ERROR_COLOR};
  `,
  bottonContent: css`
    width: 100%;
    height: 20px;
    top: -5px;
    position: relative;
    * {
      color: ${colors.hint_color};
      font-size: 16px;
      font-weight: 400;
    }
  `,
};

const StyledNumericFormat = styled(NumericFormat)({
  fontSize: '55px',
  fontWeight: 700,
  outline: 'none',
  caretColor: colors.button_color,
  width: '100%',
  overflow: 'hidden',
  height: '75px',
  backgroundColor: 'transparent',
  color: colors.text_color,
  '::placeholder': {
    color: colors.text_color,
  },
});

type CryptoAmountInputProps = {
  name: string;
  tokenSymbol?: string;
  value: string;
  onChange?: (value: string) => void;
  editable?: boolean;
  error?: string;
  otherTokenSymbol?: string;
  sideContent?: ReactNode;
  errorComponent?: ReactNode;
};

function CryptoAmountInput({
  tokenSymbol,
  name,
  value,
  onChange,
  editable = true,
  error,
  otherTokenSymbol,
  sideContent,
  errorComponent,
}: CryptoAmountInputProps) {
  const token = useGetTokenFromList(tokenSymbol);

  const calculatedPrice = useMultiplyPriceByAmount(
    token?.coingeckoId || 'ethereum',
    Number(value)
  );

  const priceCompare = useExchangeRate(tokenSymbol, otherTokenSymbol);
  const formattedPriceCompare = useFormatNumber({
    value: priceCompare,
  });
  const formattedAmount = useFormatNumber({ value, decimalScale: 18 });
  const formattedUsdPrice = useFormatNumber({
    value: calculatedPrice,
    prefix: '$',
  });

  const bottomContent = useMemo(() => {
    if (error) {
      return errorComponent || <Text css={styles.error}>{error}</Text>;
    }
    if (!value && otherTokenSymbol) {
      return (
        <Text>
          1 {tokenSymbol?.toUpperCase()} ≈ {formattedPriceCompare}{' '}
          {otherTokenSymbol?.toUpperCase()}
        </Text>
      );
    }

    return <Text css={styles.usd}>≈ {formattedUsdPrice}</Text>;
  }, [
    error,
    value,
    formattedUsdPrice,
    tokenSymbol,
    formattedPriceCompare,
    otherTokenSymbol,
    errorComponent,
  ]);

  const textSizePX = useMemo(() => {
    const size = getTextSizeInPixels({
      text: formattedAmount || '',
      fontSize: 55,
      fontWeight: 700,
    });
    return size < window.innerWidth ? size : window.innerWidth;
  }, [formattedAmount]);

  const [scope, animate] = useAnimate();
  useEffect(() => {
    if (error) {
      animate(
        `#${name}`,
        { x: [0, 10, 0] },
        {
          duration: 0.05,
          repeat: 2,
          ease: 'easeIn',
        }
      );
      Twa.HapticFeedback.notificationOccurred('error');
    }
  }, [animate, error, name]);

  return (
    <VStack alignItems="flex-start" gap="0px">
      <Flex
        css={styles.inputContainer}
        alignItems="center"
        justifyContent="flex-start"
        ref={scope}
        gap="10px"
      >
        <StyledNumericFormat
          id={name}
          name={name}
          placeholder="0"
          thousandSeparator={true}
          inputMode="decimal"
          value={value}
          onValueChange={({ value }) => onChange && onChange(value)}
          contentEditable={editable}
          style={{
            pointerEvents: editable ? 'auto' : 'none',
            color: error ? ERROR_COLOR : '',
          }}
          readOnly={!editable}
        />
        {sideContent || (
          <Symbol
            symbol={token?.symbolDisplay}
            css={{
              position: 'absolute',
              bottom: '10px',
              pointerEvents: 'none',
              left: !value ? 50 : textSizePX + 12,
              color: error ? ERROR_COLOR : '',
            }}
          />
        )}
      </Flex>
      <Box css={styles.bottonContent}>{bottomContent}</Box>
    </VStack>
  );
}

function Symbol({
  symbol,
  css = {},
  icon,
}: {
  symbol?: string;
  css?: Interpolation<CSSProperties>;
  icon?: ReactNode;
}) {
  return (
    <Box css={[styles.inputSymbol, css]}>
      {icon ? (
        <Flex alignItems="center">
          <Text>{symbol}</Text> {icon}
        </Flex>
      ) : (
        <Text>{symbol}</Text>
      )}
    </Box>
  );
}

CryptoAmountInput.Symbol = Symbol;

export default CryptoAmountInput;

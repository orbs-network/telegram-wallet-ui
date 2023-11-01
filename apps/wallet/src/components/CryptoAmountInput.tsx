import { VStack, Flex, Text, Box } from '@chakra-ui/react';
import { useEffect, useMemo } from 'react';
import {
  useMultiplyPriceByAmount,
  useFormatNumber,
  useGetTokenFromList,
  useExchangeRate,
} from '../hooks';
import { getTextSizeInPixels } from '../utils/utils';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { NumericFormat } from 'react-number-format';
import { useAnimate } from 'framer-motion';
import { colors } from '@telegram-wallet-ui/twa-ui-kit';

const ERROR_COLOR = '#ff3333';

const styles = {
  inputContainer: css`
    position: relative;
  `,
  inputSymbol: css`
    font-size: 32px;
    font-weight: 700;
    color: ${colors.hint_color};
    position: absolute;
    bottom: 10px;
    pointer-events: none;
  `,
  usd: css`
    padding-left: 7px;
  `,
  error: css`
    color: ${ERROR_COLOR};
  `,
  bottomText: css`
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
  backgroundColor: 'transparent',
  color: colors.text_color,
});

type CryptoAmountInputProps = {
  name: string;
  tokenSymbol?: string;
  value: string;
  onChange?: (value: string) => void;
  hideSymbol?: boolean;
  editable?: boolean;
  error?: string;
  otherTokenSymbol?: string;
};

export function CryptoAmountInput({
  tokenSymbol,
  name,
  value,
  onChange,
  hideSymbol,
  editable = true,
  error,
  otherTokenSymbol,
}: CryptoAmountInputProps) {
  const token = useGetTokenFromList(tokenSymbol);

  const calculatedPrice = useMultiplyPriceByAmount(
    token?.coingeckoId || 'ethereum',
    Number(value)
  );

  const priceCompare = useExchangeRate(tokenSymbol, otherTokenSymbol);
  const formattedPriceCompare = useFormatNumber({
    value: priceCompare,
    decimalScale: 6,
  });
  const formattedAmount = useFormatNumber({ value, decimalScale: 18 });
  const formattedUsdPrice = useFormatNumber({
    value: calculatedPrice,
    prefix: '$',
    decimalScale: 2,
  });

  const bottomContent = useMemo(() => {
    if (error) {
      return <Text css={styles.error}>{error}</Text>;
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
    }
  }, [animate, error, name]);

  return (
    <VStack alignItems="flex-start" gap="0px">
      <Flex
        css={styles.inputContainer}
        alignItems="flex-end"
        justifyContent="flex-start"
        ref={scope}
      >
        <StyledNumericFormat
          id={name}
          name={name}
          placeholder="0"
          thousandSeparator={true}
          value={value}
          onValueChange={({ value }) => onChange && onChange(value)}
          contentEditable={editable}
          style={{
            pointerEvents: editable ? 'auto' : 'none',
            color: error && ERROR_COLOR,
          }}
          readOnly={!editable}
        />
        {!hideSymbol && (
          <Text
            style={{
              left: !value ? 50 : textSizePX + 12,
              color: error && ERROR_COLOR,
            }}
            css={styles.inputSymbol}
          >
            {token?.symbol.toUpperCase()}
          </Text>
        )}
      </Flex>
      <Box css={styles.bottomText}>{bottomContent}</Box>
    </VStack>
  );
}

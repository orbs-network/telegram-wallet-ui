import { VStack, Flex, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import {
  useMultiplyPriceByAmount,
  useFormatNumber,
  useGetTokenFromList,
  useFetchLatestPrice,
} from '../hooks';
import { getTextSizeInPixels } from '../utils/utils';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { NumericFormat } from 'react-number-format';

const styles = {
  inputContainer: css`
    position: relative;
  `,
  inputSymbol: css`
    font-size: 32px;
    font-weight: 700;
    color: #9d9d9d;
    position: absolute;
    bottom: 10px;
    pointer-events: none;
  `,
  usd: css`
    color: #b8b8b8;
    font-size: 18px;
    font-weight: 400;
    padding-left: 7px;
    position: relative;
    top: -5px;
  `,
};

const StyledNumericFormat = styled(NumericFormat)({
  fontSize: '60px',
  fontWeight: 700,
  outline: 'none',
  caretColor: '#417fc6',
  width: '100%',
  overflow: 'hidden',
});

type CryptoAmountInputProps = {
  name: string;
  tokenSymbol: string;
  value: string;
  onChange?: (value: string) => void;
  hideSymbol?: boolean;
  editable?: boolean;
};

export function CryptoAmountInput({
  tokenSymbol,
  name,
  value,
  onChange,
  hideSymbol,
  editable = true,
}: CryptoAmountInputProps) {
  const token = useGetTokenFromList(tokenSymbol);

  const { data: price } = useFetchLatestPrice(token?.coingeckoId);

  const calculatedPrice = useMultiplyPriceByAmount(
    token?.coingeckoId || 'ethereum',
    Number(value)
  );

  const formattedAmount = useFormatNumber({ value, decimalScale: 18 });

  const textSizePX = useMemo(() => {
    const size = getTextSizeInPixels({
      text: formattedAmount || '',
      fontSize: 60,
      fontWeight: 700,
    });
    return size < window.innerWidth ? size : window.innerWidth;
  }, [formattedAmount]);

  const formattedUsdPrice = useFormatNumber({
    value: calculatedPrice,
    prefix: '$',
    decimalScale: 2,
  });

  const fiatConversion =
    value !== ''
      ? `≈ ${formattedUsdPrice}`
      : `1 ${token?.symbol.toUpperCase()} ≈ $${price?.toFixed()}`;

  return (
    <VStack alignItems="flex-start" gap="0px">
      <Flex
        css={styles.inputContainer}
        alignItems="flex-end"
        justifyContent="flex-start"
      >
        <StyledNumericFormat
          id={name}
          name={name}
          placeholder="0"
          thousandSeparator={true}
          value={value}
          onValueChange={({ value }) => onChange && onChange(value)}
          contentEditable={editable}
          readOnly={!editable}
        />
        {!hideSymbol && (
          <Text
            style={{
              left: !value ? 50 : textSizePX + 12,
            }}
            css={styles.inputSymbol}
          >
            {token?.symbol}
          </Text>
        )}
      </Flex>

      <Text css={styles.usd}>{fiatConversion}</Text>
    </VStack>
  );
}

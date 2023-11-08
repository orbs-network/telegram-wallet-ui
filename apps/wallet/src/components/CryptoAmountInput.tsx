import { VStack, Flex, Text, Box } from '@chakra-ui/react';
import {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
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
import { Twa, colors } from '@telegram-wallet-ui/twa-ui-kit';
import { ERROR_COLOR } from '../consts';
const INPUT_FONT_SIZE = 56;
const styles = {
  inputContainer: css`
    position: relative;
  `,
  max: css`
    color: ${colors.link_color};
    font-size: 17px;
  `,
  balance: css`
    align-items: center;
    gap: 4px;
    p {
      color: ${colors.hint_color};
      font-size: 17px;
    }
  `,
  inputSymbol: css`
    position: relative;
    padding-right: 20px;
    p,
    svg {
      color: ${colors.hint_color};
    }
    ,
    svg {
      font-size: 35px;
      position: absolute;
      right: -10px;
    }
    ,
    p {
      font-size: 40px;
      font-weight: 700;
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
      font-size: 17px;
      font-weight: 400;
    }
  `,
};

const StyledNumericFormat = styled(NumericFormat)({
  fontWeight: 700,
  outline: 'none',
  caretColor: colors.button_color,
  width: '100%',
  overflow: 'hidden',
  height: '66px',
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
  css?: Interpolation<CSSProperties>;
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
  css = {},
}: CryptoAmountInputProps) {
  const token = useGetTokenFromList(tokenSymbol);
  const containerRef = useRef<HTMLDivElement>(null);
  const sideContentRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
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

  useEffect(() => {
    if (containerRef.current && sideContentRef.current) {
      setReady(true);
    }
  }, []);

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

  const { fontSize, inputWidth } = useMemo(() => {
    if (!ready) {
      return {
        fontSize: INPUT_FONT_SIZE,
        inputWidth: 0,
      };
    }
    const maxWidth =
      (containerRef.current?.offsetWidth || 0) -
      (sideContentRef.current?.offsetWidth || 0);
    let _fontSize = INPUT_FONT_SIZE;

    const _inputWidth = getTextSizeInPixels({
      text: value.endsWith('.') ? `${formattedAmount}.` : formattedAmount || '',
      fontSize: _fontSize,
      fontWeight: 700,
    });

    if (_inputWidth > maxWidth) {
      const dif = maxWidth / _inputWidth;
      _fontSize = _fontSize * dif * 0.94;
    }
    return {
      fontSize: Math.max(_fontSize, 22),
      inputWidth: _inputWidth >= maxWidth ? maxWidth : _inputWidth,
    };
  }, [formattedAmount, ready, value]);

  return (
    <VStack
      css={css}
      alignItems="flex-start"
      gap="0px"
      ref={containerRef}
      width="100%"
    >
      <Flex
        css={styles.inputContainer}
        alignItems="center"
        justifyContent="flex-start"
        ref={scope}
        gap="10px"
        width="100%"
        className="input-container"
      >
        <StyledNumericFormat
          id={name}
          name={name}
          placeholder="0"
          thousandSeparator={true}
          inputMode="decimal"
          value={value}
          onValueChange={(values) => {
            onChange && onChange(values.floatValue?.toString() || '');
          }}
          contentEditable={editable}
          style={{
            pointerEvents: editable ? 'auto' : 'none',
            color: error ? ERROR_COLOR : '',
            fontSize: `${fontSize}px`,
            width: Math.max(inputWidth, 32),
          }}
          readOnly={!editable}
        />
        <div ref={sideContentRef}>
          {sideContent || (
            <Symbol
              symbol={token?.symbolDisplay}
              css={{
                pointerEvents: 'none',
                color: error ? ERROR_COLOR : '',
              }}
            />
          )}
        </div>
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

const MaxButton = ({
  onChange,
  tokenSymbol,
  css = {},
}: {
  onChange: (value: string) => void;
  tokenSymbol?: string;
  css?: Interpolation<CSSProperties>;
}) => {
  const token = useGetTokenFromList(tokenSymbol);

  const formattedBalance = useFormatNumber({
    value: token?.balance || '0',
  });

  if (!token?.balance) {
    return null;
  }
  return (
    <Flex css={[css, styles.balance]}>
      <Box onClick={() => onChange(token?.balance || '')} css={styles.max}>
        Max:{' '}
      </Box>
      <Text fontSize="14px">
        {formattedBalance} {token?.symbolDisplay}
      </Text>
    </Flex>
  );
};

CryptoAmountInput.Symbol = Symbol;
CryptoAmountInput.MaxButton = MaxButton;

export default CryptoAmountInput;

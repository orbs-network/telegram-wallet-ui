import { Avatar, Box, Flex, Skeleton, Text, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import React, { ReactNode } from 'react';
import { useFormatNumber, useGetTokenFromList } from '../hooks';
import { BsArrowDownShort } from 'react-icons/bs';
import { flash } from '../styles';
import styled from '@emotion/styled';
const styles = {
  container: css``,
  tokenDisplayContainer: css`
    width: 100%;
    gap: 5px;
    position: relative;
  `,
  tokenDisplayContainerArrow: css`
    padding: 1px;
    border-radius: 50%;
    background-color: ${colors.button_color};
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    left: 23px;
    svg {
      color: white;
      width: 20px;
      height: 20px;
    }
  `,
  category: css`
    width: 100%;
    align-items: flex-start;
    gap: 0px;
    .review-tx-section {
      border-bottom: 1px solid ${colors.border_color};
      padding-bottom: 10px;
      &:last-child {
        border-bottom: none;
        padding-bottom: 0px;
      }
    }
  `,
  categoryTitle: css`
    color: ${colors.hint_color};
    font-size: 14px;
    font-weight: 500;
    padding-left: 18px;
    margin-bottom: 10px;
  `,
  section: css`
    width: 100%;
    align-items: flex-start;
    gap: 2px;
  `,
  sectionValue: css`
    font-weight: 500;
    font-size: 15px;
  `,
  sectionTitle: css`
    color: ${colors.hint_color};
    font-size: 14px;
    width: 100%;
  `,
  sectionLoader: css`
    width: 100%;
    height: 18px;
    border-radius: 10px;
    max-width: 200px;
    margin-top: 5px;
  `,
  tokenDisplay: css`
    align-items: center;
    gap: 12px;
  `,
  tokenDisplayLoader: css`
    width: 80px;
    height: 18px;
    border-radius: 10px;
  `,
  tokenDisplayAmount: css`
    position: relative;
  `,
  tokenAmount: css`
    font-size: 24px;
    font-weight: 600;
  `,
  refetching: css`
    animation: ${flash} 1s linear infinite;
  `,
};

export const ReviewTx = ({ children }: { children: ReactNode }) => {
  return <VStack gap="20px">{children}</VStack>;
};

const Category = ({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) => {
  return (
    <VStack css={styles.category}>
      {title && <Text css={styles.categoryTitle}>{title}</Text>}
      <Card>
        <VStack gap="10px">{children}</VStack>
      </Card>
    </VStack>
  );
};

const Section = ({ title, value }: { title: string; value?: string }) => {
  return (
    <VStack css={styles.section} className="review-tx-section">
      <Text css={styles.sectionTitle}>{title}</Text>

      {value ? (
        <Text css={styles.sectionValue}>{value}</Text>
      ) : (
        <Skeleton css={styles.sectionLoader} />
      )}
    </VStack>
  );
};

const TokenDisplay = ({
  symbol,
  amount,
  isInToken,
  isRefetching,
}: {
  symbol?: string;
  amount?: string;
  isInToken?: boolean;
  isRefetching?: boolean;
}) => {
  const token = useGetTokenFromList(symbol);
  const formattedAmount = useFormatNumber({ value: amount });

  return (
    <Card>
      <Flex align="center" css={styles.tokenDisplay}>
        <Avatar width="44px" height="44px" src={token?.logoURI} />
        <VStack gap="1px">
          <Text css={styles.sectionTitle}>
            {isInToken ? 'You pay' : 'You recieve'}
          </Text>
          <Box css={styles.tokenDisplayAmount}>
            {formattedAmount ? (
              <Text css={[styles.tokenAmount]}>
                <StyledSpan $show={Boolean(isRefetching)}>
                  {formattedAmount}
                </StyledSpan>{' '}
                {token?.symbolDisplay.toUpperCase()}
              </Text>
            ) : (
              <Flex gap="10px" alignItems="center">
                <Skeleton css={styles.tokenDisplayLoader} />
                <Text css={styles.tokenAmount}>
                  {token?.symbolDisplay.toUpperCase()}
                </Text>
              </Flex>
            )}
          </Box>
        </VStack>
      </Flex>
    </Card>
  );
};

const StyledSpan = styled('span')<{ $show: boolean }>(({ $show }) => ({
  animation: $show ? `${flash} 1s linear infinite` : undefined,
}));

const TokensDisplayContainer = ({ children }: { children: ReactNode }) => {
  return (
    <VStack css={styles.tokenDisplayContainer}>
      <Box css={styles.tokenDisplayContainerArrow}>
        <BsArrowDownShort />
      </Box>
      {children}
    </VStack>
  );
};

ReviewTx.Category = Category;
ReviewTx.Section = Section;
ReviewTx.TokenDisplay = TokenDisplay;
ReviewTx.TokensDisplayContainer = TokensDisplayContainer;

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
    gap: 4px;
    position: relative;
  `,
  tokenDisplayContainerArrow: css`
    padding: 1px;
    border-radius: 50%;
    background-color: ${colors.border_color};
    position: absolute;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    left: 23px;
    width: 24px;
    height: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      color: white;
      font-size: 23px;
      color: ${colors.text_color};
    }
  `,
  category: css`
    width: 100%;
    align-items: flex-start;
    gap: 0px;

    .chakra-card {
      min-height: unset;
    }
    .chakra-card__body {
      padding: 10px 16px;
    }

    .review-tx-section {
      padding-bottom: 6px;
      position: relative;

      &:after {
        content: '';
        left: 0px;
        position: absolute;
        width: calc(100% + 20px);
        bottom: 0px;
        height: 1px;
        background-color: ${colors.border_color};
      }
      &:last-child {
        padding-bottom: 0px;
      }
      &:last-child:after {
        display: none;
      }
    }
  `,
  categoryTitle: css`
    color: ${colors.hint_color};
    font-size: 13px;
    font-weight: 500;
    padding-left: 16px;
    margin-bottom: 4px;
    margin-top: 6px;
    text-transform: uppercase;
  `,
  section: css`
    width: 100%;
    align-items: flex-start;
    gap: 0px;
  `,
  sectionValue: css`
    font-weight: 500;
    font-size: 17px;
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
    gap: 10px;
  `,
  tokenDisplayLoader: css`
    width: 80px;
    height: 18px;
    border-radius: 10px;
  `,
  tokenDisplayAmount: css`
    position: relative;
  `,
  tokenDisplayCard: css`
    background-color: ${colors.secondary_bg_color2};
    .chakra-card__body {
      padding: 12px 15px;
    }
  `,
  tokenAmount: css`
    font-size: 20px;
    font-weight: 600;
  `,
  refetching: css`
    animation: ${flash} 1s linear infinite;
  `,
};

export const ReviewTx = ({ children }: { children: ReactNode }) => {
  return <VStack gap="24px">{children}</VStack>;
};

const Category = ({
  title,
  children,
  bottomText,
}: {
  title?: string;
  children: ReactNode;
  bottomText?: string;
}) => {
  return (
    <VStack css={styles.category}>
      {title && <Text css={styles.categoryTitle}>{title}</Text>}
      <Card>
        <VStack gap="10px">{children}</VStack>
      </Card>
      {bottomText && (
        <Text mt={2} variant="hint">
          {bottomText}
        </Text>
      )}
    </VStack>
  );
};

const Section = ({ title, value }: { title: string; value?: string }) => {
  return (
    <VStack css={styles.section} className="review-tx-section">
      <Text css={styles.sectionTitle}>{title}</Text>

      {value ? (
        <Text css={styles.sectionValue} wordBreak="break-all">
          {value}
        </Text>
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
    <Card css={styles.tokenDisplayCard}>
      <Flex align="center" css={styles.tokenDisplay}>
        <Avatar width="36px" height="36px" src={token?.logoURI} />
        <VStack gap="0px">
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

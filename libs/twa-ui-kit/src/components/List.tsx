import { Box, Skeleton, Text, VStack } from '@chakra-ui/react';
import { css, Interpolation } from '@emotion/react';
import React, { CSSProperties } from 'react';
import { colors } from '../theme';
import { Card } from './Card';
import { ListItem } from './ListItem';

interface Props {
  mode: 'select' | 'display';
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
  css?: Interpolation<CSSProperties>;
  title?: string;
}

const styles = {
  select: css`
  gap: 0px;
  padding: 0px;
  border-radius: 10px;
  
  & > .chakra-card__body {
    padding: 0px;
  }
    .list-item {
    .chakra-card__body {
  position: relative;
    &::after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: 65px;
      right: 0px;
      height: 1px;
      background: ${colors.secondary_bg_color};
    },
    
},
},
a{
   &:last-child {
    .chakra-card__body::after {
        display: none;
    }
   }
}
}

  }`,
  display: css`
    gap: 6px;
    padding: 0px;
    .chakra-card__body {
      padding: 10px;
    }
  `,
  title: css`
    font-size: 14px;
    margin-left: 12px;
    margin-top: 10px;
  `,
};

export function List({
  mode,
  children,
  isLoading,
  css = {},
  title,
  className,
}: Props) {
  return mode === 'select' ? (
    <Card css={[css, styles.select]} className={className}>
      <Title title={title} />
      {isLoading ? <Loader /> : children}
    </Card>
  ) : (
    <VStack css={[styles.display, css]} className={className}>
      <Title title={title} />
      {isLoading ? <Loader /> : children}
    </VStack>
  );
}

const Title = ({ title }: { title?: string }) => {
  if (!title) return null;

  return (
    <Text css={styles.title} variant="hint">
      {title}
    </Text>
  );
};

function Loader() {
  return (
    <ListItem
      StartIconSlot={<Skeleton width="40px" height="40px" borderRadius="50%" />}
      StartTextSlot={
        <VStack alignItems="flex-start" gap="5px">
          <Skeleton width="150px" height="15px" borderRadius="10px" />
          <Skeleton width="50px" height="15px" borderRadius="10px" />
        </VStack>
      }
    />
  );
}
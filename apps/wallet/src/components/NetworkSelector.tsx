import {
  Flex,
  Text,
} from '@chakra-ui/react';
import { css } from '@emotion/react';
import { Card, colors } from '@telegram-wallet-ui/twa-ui-kit';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { NETWORKS } from '../consts';
import { usePersistedStore } from '../store/persisted-store';
import { TbChevronRight } from 'react-icons/tb';
import { ROUTES } from '../router/routes';

const styles = {
  list: css`
    width: 100%;
  `,
  selector: css`
    width: 100%;
    min-height: unset;
    .chakra-card__body {
      display: flex;
      justify-content: space-between;
    }
  `,
  selectorRight: css`
    p {
      font-size: 14px;
    }
    svg {
      position: relative;
      top: 2px;
      font-size: 16px;
    }
  `,
};

export const NetworkSelector = () => {
  const { network } = usePersistedStore();

  const selected = _.find(NETWORKS, { name: network });

  return (
    <Link to={ROUTES.networkSelect} style={{ width: '100%' }}>
      <Card css={styles.selector}>
        <Text>Network</Text>
        <Flex alignItems="center" css={styles.selectorRight}>
          <Text variant="hint">{selected?.displayName}</Text>
          <TbChevronRight color={colors.hint_color} />
        </Flex>
      </Card>
    </Link>
  );
};


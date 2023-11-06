import { Avatar, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { css } from '@emotion/react';
import { Card, colors, List, ListItem } from '@telegram-wallet-ui/twa-ui-kit';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { NETWORKS } from '../consts';
import { usePersistedStore } from '../store/persisted-store';
import { Network } from '../types';
import {TbChevronRight} from 'react-icons/tb'
interface Props {
  onSelect: (value: string) => void;
  className?: string;
  enabledNetworks?: string[];
}

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

function NetworkSelect({ onSelect, className = '' }: Props) {
  const { network: selectedNetwork } = usePersistedStore();
  return (
    <List mode="select" css={styles.list} className={className}>
      {_.map(NETWORKS, (network) => {
        const selected = network.name === selectedNetwork;
        return (
          <NetworkListItem
            onClick={() => onSelect(network.name)}
            key={network.name}
            network={network}
            selected={selected}
          />
        );
      })}
    </List>
  );
}

const Selector = ({ path }: { path: string }) => {
  const { network } = usePersistedStore();

  const selected = _.find(NETWORKS, { name: network });

  return (
    <Link to={path} style={{ width: '100%' }}>
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

NetworkSelect.Selector = Selector;
export default NetworkSelect;
interface NetworkProps {
  network: Network;
  onClick: () => void;
  selected: boolean;
}

function NetworkListItem({
  network,
  onClick,
  selected,
}: NetworkProps) {
  return (
    <ListItem
      css={{
        pointerEvents: network.enabled ? 'auto' : 'none',
        opacity: network.enabled ? 1 : 0.6,
      }}
      selected={selected}
      onClick={onClick}
      className="list-item-content"
      StartIconSlot={<Avatar width="40px" height="40px" src={network.logo} />}
      StartTextSlot={
        <VStack alignItems="flex-start" gap="2px">
          <Heading as="h3" variant="bodyTitle">
            {network.name}
          </Heading>
          <Text variant="hint">{network.symbol}</Text>
        </VStack>
      }
    />
  );
}

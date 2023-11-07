import { Avatar, Container, Heading, Text, VStack } from "@chakra-ui/react";
import { css } from "@emotion/react";
import { List, ListItem } from "@telegram-wallet-ui/twa-ui-kit";
import _ from "lodash";
import { useNavigate, useParams } from "react-router-dom";
import { Page } from "../components";
import { NETWORKS } from "../consts";
import { useGetTokenFromList } from "../hooks";
import { usePersistedStore } from "../store/persisted-store";
import { Network as NetworkType, TokenData, URLParams } from "../types";


const styles = {
  list: css`
    width: 100%;
  `,

};

export function Network({ className = '' }: { className?: string }) {
  const { network: selectedNetwork, setNetwork } = usePersistedStore();
  const {assetId} = useParams<URLParams>()
  const navigate = useNavigate();
  const token = useGetTokenFromList(assetId);
  

  const onSelect = (network: string) => {
    navigate(-1);
    setTimeout(() => {
      setNetwork(network);
    }, 100);
  };

  return (
    <Page>
      <Container size="sm" pt={4}>
        <List mode="select" css={styles.list} className={className}>
          {_.map(NETWORKS, (network) => {
            const selected = network.name === selectedNetwork;
            return (
              <NetworkListItem
                onClick={() => onSelect(network.name)}
                key={network.name}
                network={network}
                selected={selected}
                token={token}
              />
            );
          })}
        </List>
      </Container>
    </Page>
  );
}


interface NetworkProps {
  network: NetworkType;
  onClick: () => void;
  selected: boolean;
  token?: TokenData;
}



function NetworkListItem({ network, onClick, selected }: NetworkProps) {
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
            {network.displayName}
          </Heading>
          <Text variant="hint">{network.symbol}</Text>
        </VStack>
      }
    />
  );
}


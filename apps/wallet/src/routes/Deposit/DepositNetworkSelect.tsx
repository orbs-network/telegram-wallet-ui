import { Container } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NetworkSelect, Page } from '../../components';
import { usePersistedStore } from '../../store/persisted-store';

export function DepositNetworkSelect() {
  const navigate = useNavigate();
  const { setNetwork } = usePersistedStore();

  const onSelect = (network: string) => {
    navigate(-1);
    setTimeout(() => {
      setNetwork(network);
    }, 100);
  };

  return (
    <Page>
      <Container size="sm" pt={4}>
        <NetworkSelect onSelect={onSelect} />
      </Container>
    </Page>
  );
}

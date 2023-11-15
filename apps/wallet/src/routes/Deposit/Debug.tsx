import { Button, Container, Text } from '@chakra-ui/react';
import { eventsProvider, useInitialize } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { Fetcher } from '../../utils/fetcher';
import BN from 'bignumber.js';
import Web3 from 'web3';
import { getBalances } from '../../hooks';
import { BackButton } from '@telegram-wallet-ui/twa-ui-kit';

function setCurrentW3Provider(provider: 'chainstack' | 'alchemy') {
  localStorage.setItem('currentProvider', provider);
}

const useLoadBalanceData = () => {
  const config = useInitialize();

  return useQuery({
    queryKey: ['debug', 'balance'],
    enabled: !!config?.web3Provider,
    queryFn: async () => {
      const balance = (await config!.web3Provider.balance())
        .dividedBy(1e18)
        .toFixed(6);

      const tokens = await getBalances();

      const erc20s = [];
      for (const erc20 of Object.values(tokens)) {
        erc20s.push({
          ...erc20,
          isApproved: config!.permit2Provider.isApproved(erc20.address),
        });
      }

      return {
        balance,
        erc20s,
      };
    },
  });
};

const useLoadFaucetData = () => {
  return useQuery({
    queryKey: ['debug', 'faucet'],
    queryFn: async () => {
      const _faucetStatus: any = await Fetcher.get(
        `${import.meta.env.VITE_FAUCET_BACKEND_URL}/hc`
      );

      const faucetStatus = {
        balance: new BN(_faucetStatus.balance).dividedBy(1e18).toFixed(6),
        missingBalance: new BN(_faucetStatus.missingBalance)
          .dividedBy(1e18)
          .toFixed(6),
        hasEnoughBalance: _faucetStatus.hasEnoughBalance,
      };

      return faucetStatus;
    },
  });
};

export const Debug = () => {
  const { data } = useLoadBalanceData();
  const config = useInitialize();
  const { data: faucetStatus, isLoading: loadingFaucet } = useLoadFaucetData();
  return (
    <Container size="sm" height="100vh">
      <BackButton />
      <Text>
        <b>Address</b> {config?.account.address}
      </Text>
      <Text>
        <b>MATIC balance</b> {data?.balance}
      </Text>
      <Text>
        <b>ERC20s:</b>
      </Text>
      <>
        {(data?.erc20s ?? []).map((token) => (
          <Text key={token.address}>
            {token.symbol.toUpperCase()}{' '}
            {'...' + token.address.slice(token.address.length - 6)}{' '}
            {token.balance} {token.isApproved ? '✅' : '❌'}
          </Text>
        ))}
      </>

      <>
        <b>Faucet:</b>
        {loadingFaucet ? (
          'Loading...'
        ) : (
          <>
            <Text>Balance: {faucetStatus?.balance} </Text>
            <Text>Missing Balance: {faucetStatus?.missingBalance} </Text>
            <Text>
              Has enough balance: {faucetStatus?.hasEnoughBalance ? '✅' : '❌'}
            </Text>
          </>
        )}
      </>

      <>
        <b>Current web3 provider:</b>
        <Text>{localStorage.getItem('currentProvider') ?? 'chainstack'}</Text>
      </>
      <Button
        onClick={async () => {
          const newPrivateKey = prompt(
            'Private key',
            config?.account?.privateKey
          );
          if (newPrivateKey) {
            const account = new Web3().eth.accounts.privateKeyToAccount(
              newPrivateKey
            );
            if (
              window.confirm(
                'New address is: ' + account.address + '. Are you sure?'
              )
            ) {
              await config?.accountProvider.setAccount(newPrivateKey, true);
              window.location.reload();
            }
          }
        }}
      >
        Replace private key
      </Button>
      <Button
        onClick={() => {
          eventsProvider.clear();
        }}
      >
        Clear events
      </Button>
      <Button
        onClick={async () => {
          if (
            window.confirm(
              'Are you sure? you will lose the account and all funds'
            )
          ) {
            localStorage.clear();
            await config?.accountProvider.clearAccount();
          }
        }}
      >
        Reset app state (delete account)
      </Button>

      <Button
        onClick={() => {
          const current = localStorage.getItem('currentProvider');
          if (current === 'chainstack') {
            console.log('switching to alchemy');
            setCurrentW3Provider('alchemy');
          } else {
            console.log('switching to chainstack');
            setCurrentW3Provider('chainstack');
          }
          setTimeout(() => {
            window.location.reload();
          }, 0);
        }}
      >
        Change web3 provider
      </Button>
    </Container>
  );
};

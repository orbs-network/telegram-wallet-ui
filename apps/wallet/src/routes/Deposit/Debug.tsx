import { Button, Container, Text } from '@chakra-ui/react';
import { getDebug } from '../../lib/utils/debug';
import { accountProvider, permit2Provider, web3Provider } from '../../config';
import { useQuery } from '@tanstack/react-query';
import { erc20s } from '@defi.org/web3-candies';
import { Fetcher } from '../../utils/fetcher';
import BN from 'bignumber.js';
import { BackButton } from '@twa-dev/sdk/react';
import Web3 from 'web3';

const debug = getDebug('Debug');

const useLoadBalanceData = () => {
  return useQuery({
    queryKey: ['debug', 'balance'],
    queryFn: async () => {
      const balance = (await web3Provider.balance()).dividedBy(1e18).toFixed(6);

      const erc20s = [];
      for (const erc20 of permit2Provider.erc20s()) {
        const erc20Balance = await web3Provider.balanceOf(erc20);
        const isApproved = await permit2Provider.isApproved(erc20);
        erc20s.push({
          erc20,
          erc20Balance,
          isApproved,
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
  const { data: faucetStatus, isLoading: loadingFaucet } = useLoadFaucetData();
  return (
    <Container size="sm" height="100vh">
      <BackButton />
      <Text>
        <b>Address</b> {web3Provider.account.address}
      </Text>
      <Text>
        <b>MATIC balance</b> {data?.balance}
      </Text>
      <Text>
        <b>ERC20s:</b>
      </Text>
      <>
        {(data?.erc20s ?? []).map((token) => (
          <Text key={token.erc20}>
            {token.erc20} {token.erc20Balance.toString()}{' '}
            {token.isApproved ? 'Approved' : 'Not Approved'}
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
      <Button
        onClick={() => {
          const newPrivateKey = prompt(
            'Private key',
            accountProvider.account!.privateKey
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
              accountProvider.setAccount(newPrivateKey);
              permit2Provider.resetApprovals();
              window.location.reload();
            }
          }
        }}
      >
        Replace private key
      </Button>
    </Container>
  );
};

import { Abi } from '@defi.org/web3-candies';

export const abi: Abi = [
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'depositEtherFor',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
];

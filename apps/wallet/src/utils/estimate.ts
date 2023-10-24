import { network, median } from '@defi.org/web3-candies';
import BN from 'bignumber.js';
import Web3 from 'web3';

// TODO: add return type and handle errors
export async function estimateGasPrice(
  w3?: Web3,
  percentiles: number[] = [10, 50, 90],
  length = 5
) {
  const chain = network(137);
  const pending = chain.pendingBlocks ? 'pending' : 'latest';
  const [pendingBlock, history] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    w3!.eth.getBlock(pending),
    typeof w3!.eth.getFeeHistory !== 'function'
      ? w3!.eth.getFeeHistory(length, pending, percentiles)
      : Promise.resolve({ reward: [] }),
  ]);

  const baseFeePerGas = BN.max(
    pendingBlock.baseFeePerGas?.toString() || 0,
    chain.baseGasPrice,
    0
  );

  const slow = BN.max(
    1,
    median(history.reward.map((r) => BN(r[0].toString(), 16)))
  );
  const med = BN.max(
    1,
    median(history.reward.map((r) => BN(r[1].toString(), 16)))
  );
  const fast = BN.max(
    1,
    median(history.reward.map((r) => BN(r[2].toString(), 16)))
  );

  return {
    slow: {
      max: baseFeePerGas.times(1).plus(slow).integerValue(),
      tip: slow.integerValue(),
    },
    med: {
      max: baseFeePerGas.times(1.1).plus(med).integerValue(),
      tip: med.integerValue(),
    },
    fast: {
      max: baseFeePerGas.times(4).plus(fast).integerValue(),
      tip: fast.times(4).integerValue(),
    },
    baseFeePerGas,
    pendingBlockNumber: pendingBlock.number,
    pendingBlockTimestamp: BN(pendingBlock.timestamp.toString()).toNumber(),
  };
}

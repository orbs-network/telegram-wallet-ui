import BN from 'bignumber.js';
import {
  permit2Address,
  erc20,
  maxUint256,
  setWeb3Instance,
} from '@defi.org/web3-candies';

import { Multicall, ContractCallResults } from 'ethereum-multicall';

import { _TypedDataEncoder } from '@ethersproject/hash';

import {
  signTypedData,
  SignTypedDataVersion,
  TypedMessage,
  MessageTypes,
} from '@metamask/eth-sig-util';

import { PermitData } from '@uniswap/permit2-sdk/dist/domain';

import type { NonPayableTransactionObject } from '@defi.org/web3-candies/dist/abi/types';
import Web3 from 'web3';
import { estimateGasPrice } from '../utils/estimate';
import { BNComparable } from '../types';
import { getDebug } from './utils/debug';
import { Web3Account } from 'web3-eth-accounts';
import promiseRetry from 'promise-retry';

const debug = getDebug('Web3Provider');

export class Web3Provider {
  multicall: Multicall;

  constructor(private web3: Web3, public account: Web3Account) {
    setWeb3Instance(this.web3);
    this.multicall = new Multicall({ web3Instance: web3, tryAggregate: true });
  }

  private wrapToken(token: string) {
    return erc20('token', token);
  }

  private async signAndSend<T = unknown>(
    txn: NonPayableTransactionObject<T>,
    to: string
  ) {
    const [nonce, price] = await Promise.all([
      this.web3.eth.getTransactionCount(this.account.address),
      estimateGasPrice(this.web3),
    ]);

    debug(await txn.estimateGas({ from: this.account.address }));

    const gas = (
      Number(await txn.estimateGas({ from: this.account.address })) * 1.2
    ).toFixed(0);

    const gasMode = 'fast'; // TODO change to med

    const maxFeePerGas = price[gasMode].max.toString();
    const maxPriorityFeePerGas = price[gasMode].tip.toString();

    debug(
      `maxFeePerGas ${maxFeePerGas}, maxPriorityFeePerGas ${maxPriorityFeePerGas}`
    );

    const signed = await this.account.signTransaction({
      gas,
      maxFeePerGas: price[gasMode].max.toString(),
      maxPriorityFeePerGas: price[gasMode].tip.toString(),
      nonce: parseInt(nonce.toString()),
      from: this.account.address,
      to,
      data: txn.encodeABI(),
    });

    debug(`Sending signed tx`);
    const { transactionHash } = await this.web3.eth.sendSignedTransaction(
      signed.rawTransaction!
    );

    return String(transactionHash);
  }

  async transfer(token: string, to: string, amount: BNComparable) {
    const txn = this.wrapToken(token).methods.transfer(to, amount);
    return this.signAndSend(txn, token);
  }

  async approvePermit2(token: string) {
    debug('approvePermit2: %s', token);
    const txn = this.wrapToken(token).methods.approve(
      permit2Address,
      maxUint256
    );
    return this.signAndSend(txn, token);
  }

  async getPermit2AllowanceFor(token: string) {
    if (!this.account) throw new Error('getAllowanceFor: No account');

    const allowance = await this.wrapToken(token)
      .methods.allowance(this.account.address, permit2Address)
      .call();

    debug('getPermit2AllowanceFor: %s', allowance);
    return new BN(allowance);
  }

  async sign(data: PermitData) {
    if (!this.account) throw new Error('sign: No account');

    const typedMessage: TypedMessage<MessageTypes> =
      _TypedDataEncoder.getPayload(data.domain, data.types, data.values);

    return signTypedData<SignTypedDataVersion.V4, MessageTypes>({
      // Remove the 0x prefix
      privateKey: Buffer.from(this.account.privateKey.slice(2), 'hex'),
      data: typedMessage,
      version: SignTypedDataVersion.V4,
    });
  }

  async balanceOf(token: string) {
    return BN(
      await this.wrapToken(token).methods.balanceOf(this.account.address).call()
    );
  }

  private _id: number | null = null;

  async balancesOf(tokens: string[]) {
    // This hack is for two purposes:
    // Reduce calls to get the id of the network (why would it change?)
    // Return the correct format when multicall (otherwise it's bignumber and multicall doesn't handle that)
    if (this._id === null) {
      this._id = Number(await this.web3.eth.net.getId());

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.web3.eth.net.getId = () => this._id;
    }

    const results: ContractCallResults = await this.multicall.call(
      tokens.map((token) => {
        return {
          reference: token,
          contractAddress: token,
          abi: [
            {
              constant: true,
              inputs: [
                {
                  name: '_owner',
                  type: 'address',
                },
              ],
              name: 'balanceOf',
              outputs: [
                {
                  name: 'balance',
                  type: 'uint256',
                },
              ],
              payable: false,
              stateMutability: 'view',
              type: 'function',
            },
          ],
          calls: [
            {
              reference: 'balanceOf',
              methodName: 'balanceOf',
              methodParameters: [this.account.address],
              // methodParameters: ['0xE3682CCecefBb3C3fe524BbFF1598B2BBaC0d6E3'],
            },
          ],
        };
      })
    );

    return Object.fromEntries(
      Object.entries(results.results).map(([token, result]) => {
        return [
          token,
          BN(result.callsReturnContext[0].returnValues[0]?.hex ?? 0).toString(),
        ];
      })
    );
  }

  async balance() {
    return BN(
      (await this.web3.eth.getBalance(this.account.address)).toString()
    );
  }

  async waitForTransaction(txHash: string) {
    return promiseRetry(
      async (retry, retryNum) => {
        const { status } = await this.web3.eth
          .getTransactionReceipt(txHash)
          .catch(retry);

        if (!status) debug(`txn ${txHash} reverted`);

        return Boolean(status);
      },
      { retries: 5, factor: 1.6 }
    ).catch((e) => {
      debug(`txn ${txHash} not found`);
      return false;
    });
  }
}

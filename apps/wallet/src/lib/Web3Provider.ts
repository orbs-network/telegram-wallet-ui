import BN from 'bignumber.js';
import {
  permit2Address,
  erc20,
  maxUint256,
  setWeb3Instance,
} from '@defi.org/web3-candies';

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

const debug = getDebug('Web3Provider');

export class Web3Provider {
  constructor(private web3: Web3, public account: Web3Account) {
    setWeb3Instance(this.web3);
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

    return transactionHash;
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

  async getAllowanceFor(token: string) {
    if (!this.account) throw new Error('getAllowanceFor: No account');

    const allowance = await this.wrapToken(token)
      .methods.allowance(this.account.address, permit2Address)
      .call();
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
    if (!this.account) throw new Error('balanceOf: No account');

    return BN(
      await this.wrapToken(token).methods.balanceOf(this.account.address).call()
    );
  }

  async balance() {
    if (!this.account) throw new Error('balance: No account');

    return BN(
      (await this.web3.eth.getBalance(this.account.address)).toString()
    );
  }
}

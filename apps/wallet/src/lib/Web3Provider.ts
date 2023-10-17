import { Account } from "web3-core";
import BN from "bignumber.js";
import {
  permit2Address,
  erc20,
  maxUint256,
  setWeb3Instance,
} from "@defi.org/web3-candies";

import { _TypedDataEncoder } from "@ethersproject/hash";

import {
  signTypedData,
  SignTypedDataVersion,
  TypedMessage,
  MessageTypes,
} from "@metamask/eth-sig-util";

import { PermitData } from "@uniswap/permit2-sdk/dist/domain";

import type { NonPayableTransactionObject } from "@defi.org/web3-candies/dist/abi/types";
import Web3 from "web3";
import { estimateGasPrice } from "../utils/estimate";
import { BNComparable } from "../types";

export class Web3Provider {
  constructor(private web3: Web3, public account: Account) {
    setWeb3Instance(this.web3);
  }

  private wrapToken(token: string) {
    return erc20("token", token);
  }

  private async signAndSend<T = any>(
    txn: NonPayableTransactionObject<T>,
    to: string
  ) {
    const [nonce, price] = await Promise.all([
      this.web3.eth.getTransactionCount(this.account.address),
      estimateGasPrice(this.web3),
    ]);

    const signed = await this.account.signTransaction({
      // gas: (await txn.estimateGas()) * 1.2,
      gas: 100_000,
      maxFeePerGas: price["med"].max.toString(),
      maxPriorityFeePerGas: price["med"].tip.toString(),
      nonce: nonce,
      from: this.account.address,
      to,
      data: txn.encodeABI(),
    });

    await this.web3.eth.sendSignedTransaction(signed.rawTransaction!);
  }

  async transfer(token: string, to: string, amount: BNComparable) {
    const txn = this.wrapToken(token).methods.transfer(to, amount);
    return this.signAndSend(txn, token);
  }

  async approvePermit2(token: string) {
    const txn = this.wrapToken(token).methods.approve(
      permit2Address,
      maxUint256
    );
    return this.signAndSend(txn, token);
  }

  async getAllowanceFor(token: string) {
    const allowance = await this.wrapToken(token)
      .methods.allowance(this.account.address, permit2Address)
      .call();
    return new BN(allowance);
  }

  async sign(data: PermitData) {
    const typedMessage: TypedMessage<MessageTypes> =
      _TypedDataEncoder.getPayload(data.domain, data.types, data.values);

    return signTypedData<SignTypedDataVersion.V4, MessageTypes>({
      // Remove the 0x prefix
      privateKey: Buffer.from(this.account.privateKey.slice(2), "hex"),
      data: typedMessage,
      version: SignTypedDataVersion.V4,
    });
  }

  async balanceOf(token: string) {
    return this.wrapToken(token).methods.balanceOf(this.account.address).call();
  }

  async balance() {
    return this.web3.eth.getBalance(this.account.address);
  }
}

import promiseRetry from 'promise-retry';

import { erc20sData, sleep } from '@defi.org/web3-candies';
import { Web3Provider } from './Web3Provider';
import { abi as ethBridgeAbi } from './abi/ethBridgeContract';

import BN from 'bignumber.js';

import { LocalStorageProvider } from './LocalStorageProvider';
import {
  BridgeProviderConfig,
  BridgeStorage,
  SetBridgeDetails,
} from './BridgeProvider.types';
import { getDebug } from './utils/debug';

const BRIDGE_STORAGE_KEY = 'BRIDGE_STORAGE_KEY';
const debug = getDebug('BridgeProvider');

export class BridgeProvider {
  private readonly ethW3Provider: Web3Provider;
  private readonly polyW3Provider: Web3Provider;
  private readonly storage: LocalStorageProvider;
  private readonly MIN_REQUIRED_ETHER_BALANCE: BN;

  private POLL_INTERVAL = 10000;
  private shouldPoll = false;

  constructor(config: BridgeProviderConfig) {
    this.ethW3Provider = config.ethW3Provider;
    this.polyW3Provider = config.polyW3Provider;
    this.storage = config.storage;
    this.MIN_REQUIRED_ETHER_BALANCE = config.MIN_REQUIRED_ETHER_BALANCE;

    if (
      this.ethW3Provider.account.address !== this.polyW3Provider.account.address
    ) {
      throw new Error(
        'BridgeProvider: ethW3Provider and polyW3Provider must have the same address'
      );
    }

    // TODO: check with Shahar
    this.storage.setKeyPrefix('bridge');
    this.__getOrCreateBridgeDetails();
  }

  async checkBridgeProgress() {
    console.log('Bridge main starting');

    this.shouldPoll = true;

    while (this.shouldPoll) {
      const { inProgress } = this.__getOrCreateBridgeDetails();

      if (inProgress) {
        console.log('Bridge already in progress');

        await promiseRetry(
          async (retry, number) => {
            if (number === 5) {
              console.log('_monitorForWEthBalance failed 5 times. Exiting...');
              this.shouldPoll = false;
            }
            try {
              await this._monitorForWEthBalance();
            } catch (err) {
              console.error(
                `Error in _monitorForWEthBalance, retry ${number}:`,
                err
              );
              retry(err);
            }
          },
          {
            retries: 5,
            randomize: true,
          }
        );
      } else {
        console.log('Bridge not in progress');

        await promiseRetry(
          async (retry, number) => {
            if (number === 5) {
              console.log('_monitorForEtherDeposit failed 5 times. Exiting...');
              this.shouldPoll = false;
            }
            try {
              await this._monitorForEtherDeposit();
            } catch (err) {
              if (err instanceof ErrInsufficentEtherBalance) {
                throw err;
              }

              console.error(
                `Error in _monitorForEtherDeposit, retry ${number}:`,
                err
              );
              retry(err);
            }
          },
          {
            retries: 5,
            randomize: true,
          }
        );
      }
    }
  }

  private async _monitorForEtherDeposit() {
    console.log(
      'Checking native balance for address %s',
      this.ethW3Provider.account.address
    );

    const balance = await this.ethW3Provider.balance();

    if (balance.isZero()) {
      console.log('Ether balance is zero. Sleeping...');
      await sleep(this.POLL_INTERVAL);
      return;
    }

    if (balance.isLessThan(this.MIN_REQUIRED_ETHER_BALANCE)) {
      throw new ErrInsufficentEtherBalance({
        currentBalance: balance,
        requiredBalance: this.MIN_REQUIRED_ETHER_BALANCE,
      });
    }
    console.log('Ether received. Balance: %s', balance.toNumber());

    await this._transferToBridge(balance);
  }

  private async _transferToBridge(amount: BN) {
    const ethBridgeAddress = '0xA0c68C638235ee32657e8f720a23ceC1bFc77C77';

    const ethBridgeContract = await this.ethW3Provider.toContract(
      ethBridgeAddress,
      ethBridgeAbi
    );

    const txn = ethBridgeContract.methods.depositEtherFor(
      this.ethW3Provider.account.address
    );

    const { cost } = await this.ethW3Provider.estimateGasCost(txn);

    const amountMinusFeeAndTip = amount.minus(cost);

    const transactionHash = await this.ethW3Provider.signAndSend({
      txn,
      value: amountMinusFeeAndTip,
      to: ethBridgeAddress,
    });

    console.log('Sent to bridge. Transaction: ', transactionHash);

    this.__setBridgeDetails({
      inProgress: true,
      etherAmount: amountMinusFeeAndTip.toString(),
      transactionHash: transactionHash.toString(),
      wethBalance: (await this.__getWethBalance()).toString(),
    });
  }

  private async _monitorForWEthBalance() {
    const { etherAmount, wethBalance, ...props } =
      this.__getOrCreateBridgeDetails();

    const expectedBridgedEtherAmount = new BN(etherAmount);
    const previousWethBalance = new BN(wethBalance);
    const currentWethBalance = await this.__getWethBalance();

    if (currentWethBalance.isEqualTo(previousWethBalance)) {
      console.log('WETH balance unchanged. Sleeping...');
      await sleep(this.POLL_INTERVAL);
      return;
    }

    const expectedBalanceAfterBridge = previousWethBalance.plus(
      expectedBridgedEtherAmount
    );

    if (!currentWethBalance.isEqualTo(expectedBalanceAfterBridge)) {
      console.log(
        'WETH balance changed but still not received bridged funds. Updating local storage and sleeping...'
      );
      this.__setBridgeDetails({
        ...props,
        etherAmount: expectedBridgedEtherAmount.toString(),
        wethBalance: currentWethBalance.toString(),
      });
      await sleep(this.POLL_INTERVAL);
      return;
    }

    this.shouldPoll = false;
    this.storage.delete(BRIDGE_STORAGE_KEY);
    console.log('Received bridged funds. Exiting...');
  }

  private __setBridgeDetails({
    inProgress,
    etherAmount,
    transactionHash,
    wethBalance,
  }: SetBridgeDetails) {
    debug('Updating bridge details in local storage');

    this.storage.storeObject<BridgeStorage>(BRIDGE_STORAGE_KEY, {
      inProgress,
      transactionHash,
      etherAmount: etherAmount,
      wethBalance: wethBalance,
    });
  }

  private __getOrCreateBridgeDetails(): BridgeStorage {
    debug('Getting bridge details from local storage');

    const existing = this.storage.read<BridgeStorage | Record<string, never>>(
      BRIDGE_STORAGE_KEY
    );

    if (existing['inProgress'] === undefined) {
      debug('Bridge details not found. Creating new');

      const newDetails = {
        inProgress: false,
        transactionHash: '',
        etherAmount: '',
        wethBalance: '',
      };

      this.__setBridgeDetails(newDetails);

      return newDetails;
    }

    debug('Bridge details found');
    return existing as BridgeStorage;
  }

  private __getWethBalance(): Promise<BN> {
    debug('Getting WETH balance');

    return this.polyW3Provider.balanceOf(erc20sData.poly.WETH.address);
  }
}

/**
 * Error thrown when the user's Ether balance is insufficient to pay for the bridge transfer.
 */
export class ErrInsufficentEtherBalance extends Error {
  currentBalance: BN;
  requiredBalance: BN;

  constructor(balances: { currentBalance: BN; requiredBalance: BN }) {
    super(
      `Insufficent Ether balance. Got ${balances.currentBalance}, need ${balances.requiredBalance}`
    );
    this.name = 'ErrInsufficentEtherBalance';
    this.currentBalance = balances.currentBalance;
    this.requiredBalance = balances.requiredBalance;
  }
}

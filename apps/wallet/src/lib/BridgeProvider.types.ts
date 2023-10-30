import { Web3Provider } from './Web3Provider';
import { LocalStorageProvider } from './LocalStorageProvider';
import BN from 'bignumber.js';

export type BridgeStorage = {
  /** Is the user currently in the process of bridging? */
  inProgress: boolean;
  /** The Ethereum `depositEtherFor` transaction  */
  transactionHash: string;
  /** The amount of Ether that was sent to the bridge contract */
  etherAmount: string;
  /**
   * The user's current WETH balance on Polygon
   * Used to check if the user has received the WETH from the bridge contract
   * */
  wethBalance: string;
};

export type BridgeProviderConfig = {
  ethW3Provider: Web3Provider;
  polyW3Provider: Web3Provider;
  storage: LocalStorageProvider;
  MIN_REQUIRED_ETHER_BALANCE: BN;
};

export type SetBridgeDetails = {
  inProgress: boolean;
  etherAmount: string;
  transactionHash: string;
  wethBalance: string;
};

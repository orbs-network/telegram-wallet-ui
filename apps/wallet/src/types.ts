import { CryptoAsset } from './config';

export type User = {
  id: string;
  name: string;
  avatarUrl?: string;
  address: string;
  telegramId: string;
};

export type TransactionDirection = 'incoming' | 'outgoing';

export type TransactionStatus = 'completed' | 'pending';

export type TransactionType = 'deposit' | 'withdrawal' | 'trade' | 'transfer';

export type Transaction = {
  id: string;
  amount: string;
  date: Date;
  from?: User;
  direction: TransactionDirection;
  to?: User;
  status: TransactionStatus;
  type: TransactionType;
  asset: CryptoAsset;
};

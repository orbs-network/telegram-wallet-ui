import { TransactionEvent, User } from '../types';

export const mockUsers: User[] = [
  {
    id: '0x0000000',
    name: 'Alice',
    address: '0x0000000001',
    telegramId: '000000001',
  },
  {
    id: '0x0000001',
    name: 'Bob',
    address: '0x0000000002',
    telegramId: '000000002',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/1601531707072675841/TmRVWuA0_400x400.jpg',
  },
  {
    id: '0x0000002',
    name: 'Charlie',
    address: '0x0000000003',
    telegramId: '000000003',
    avatarUrl:
      'https://pbs.twimg.com/profile_images/956331551435960322/OaqR8pAB_400x400.jpg',
  },
];
export const mockTransactions: TransactionEvent[] = [
  {
    id: '0',
    amount: '0.1231445',
    date: new Date('2021-04-07T14:50:00.000Z'),
    from: mockUsers[1],
    direction: 'outgoing',
    to: mockUsers[0],
    status: 'completed',
    type: 'transfer',
    asset: 'MATIC',
  },
  {
    id: '1',
    amount: '0.12',
    date: new Date('2021-03-07T14:50:00.000Z'),
    from: mockUsers[0],
    direction: 'incoming',
    to: mockUsers[1],
    status: 'completed',
    type: 'transfer',
    asset: 'MATIC',
  },
  {
    id: '3',
    amount: '0.666345435',
    date: new Date('2023-09-07T11:50:00.000Z'),
    from: mockUsers[2],
    direction: 'incoming',
    to: mockUsers[1],
    status: 'completed',
    type: 'transfer',
    asset: 'MATIC',
  },
  {
    id: '4',
    amount: '10',
    date: new Date('2023-08-07T11:50:00.000Z'),
    direction: 'incoming',
    status: 'completed',
    type: 'deposit',
    asset: 'MATIC',
  },
  {
    id: '5',
    amount: '0.5',
    date: new Date('2023-08-19T11:50:00.000Z'),
    direction: 'outgoing',
    status: 'completed',
    type: 'withdrawal',
    asset: 'MATIC',
  },
  {
    id: '6',
    amount: '0.15',
    date: new Date('2023-03-19T11:50:00.000Z'),
    direction: 'incoming',
    status: 'completed',
    type: 'trade',
    asset: 'MATIC',
  },
];

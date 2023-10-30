import { User } from '../types';

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

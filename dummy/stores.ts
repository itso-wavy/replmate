import type { StoreDomain } from '@/types';

export const dummyStores: StoreDomain[] = [
  {
    id: 1,
    name: '쇼핑몰A',
    url: 'https://smartstore.naver.com/mangomarket',
    platform: 'naver-smartstore',
    status: 'active',
  },
  {
    id: 2,
    name: '쇼핑몰B',
    url: 'https://brandstore.naver.com/sorahome',
    platform: 'naver-brandstore',
    status: 'rejected',
  },
  {
    id: 3,
    name: '쇼핑몰C',
    url: 'https://smartstore.naver.com/rumiatelier',
    platform: 'naver-smartstore',
    status: 'deactivating',
  },
  {
    id: 4,
    name: '쇼핑몰D',
    url: 'https://smartstore.naver.com/dailylook',
    platform: 'naver-smartstore',
    status: 'inactive',
  },
  {
    id: 5,
    name: '쇼핑몰E',
    url: 'https://brandstore.naver.com/techworld',
    platform: 'naver-brandstore',
    status: 'pending',
  },
  // {
  //   id: 6,
  //   name: '쇼핑몰F',
  //   url: 'https://smartstore.naver.com/petparadise',
  //   platform: PlatformType.NAVER_SMART_STORE,
  //   isActive: true,
  //   isVerified: false,
  //   verifiedAt: null,
  //   lastProductSyncedAt: null,
  //   createdAt: '2024-08-10T16:45:00Z',
  //   updatedAt: '2024-08-10T16:45:00Z',
  //  status: 'deactivated'

  // },
  // {
  //   id: 7,
  //   name: '쇼핑몰G',
  //   url: 'https://brandstore.naver.com/beautylab',
  //   platform: PlatformType.NAVER_BRAND_STORE,
  //   isActive: false,
  //   isVerified: true,
  //   verifiedAt: '2024-05-20T13:00:00Z',
  //   lastProductSyncedAt: '2024-06-01T10:00:00Z',
  //   createdAt: '2024-05-15T11:30:00Z',
  //   updatedAt: '2024-06-01T10:00:00Z',
  //  status: 'deactivated'

  // },
  // {
  //   id: 8,
  //   name: '쇼핑몰H',
  //   url: 'https://smartstore.naver.com/campinglife',
  //   platform: PlatformType.NAVER_SMART_STORE,
  //   isActive: true,
  //   isVerified: true,
  //   verifiedAt: '2024-08-12T09:00:00Z',
  //   lastProductSyncedAt: '2024-08-13T14:20:00Z',
  //   createdAt: '2024-08-11T10:00:00Z',
  //   updatedAt: '2024-08-13T14:20:00Z',
  //  status: 'deactivated'
  // },
];

import { PlatformType, type StoreDomain } from '@/types';

export const dummyStores: StoreDomain[] = [
  {
    id: 1,
    name: '쇼핑몰A',
    url: 'https://smartstore.naver.com/mangomarket',
    platform: PlatformType.NAVER_SMART_STORE,
    status: 'active',
  },
  {
    id: 2,
    name: '쇼핑몰B',
    url: 'https://brandstore.naver.com/sorahome',
    platform: PlatformType.NAVER_BRAND_STORE,
    status: 'deactivating',
  },
  {
    id: 3,
    name: '쇼핑몰C',
    url: 'https://smartstore.naver.com/rumiatelier',
    platform: PlatformType.NAVER_SMART_STORE,
    status: 'active',
  },
  // {
  //   id: 4,
  //   name: '쇼핑몰D',
  //   url: 'https://smartstore.naver.com/dailylook',
  //   platform: PlatformType.NAVER_SMART_STORE,
  //   status: 'inactive',
  // },
  // {
  //   id: 5,
  //   name: '쇼핑몰E',
  //   url: 'https://brandstore.naver.com/techworld',
  //   platform: PlatformType.NAVER_BRAND_STORE,
  //   status: 'pending',
  // },
  // {
  //   id: 6,
  //   name: '쇼핑몰F',
  //   url: 'https://smartstore.naver.com/petparadise',
  //   platform: PlatformType.NAVER_SMART_STORE,
  //   status: 'active',
  // },
];

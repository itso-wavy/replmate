import { Alert, AlertType, PlatformType, StoreDto } from '@/types';

export const storeAlert: Alert = {
  id: '1',
  createdAt: new Date('2025-12-01'),
  variant: 'info',
  type: AlertType.PAYMENT_FAILED,
  title: '구독 플랜 변경으로 쇼핑몰 조정이 필요합니다.',
  description:
    '2025.01.01부터 무료 플랜(쇼핑몰 최대 1개 · 상품 최대 20개)이 적용됩니다.\n현재 쇼핑몰 2개, 상품 30개가 등록되어 있어 조정이 필요합니다. 기한 내 조정하지 않으실 경우, 최근 등록된 순서대로 자동 비활성화 처리됩니다.',
  // href: '/subscribe',
};

export const dummyStores: StoreDto[] = [
  {
    id: 1,
    name: '쇼핑몰A',
    url: 'https://smartstore.naver.com/mangomarket',
    platform: PlatformType.NAVER_SMART_STORE,
    isActive: true,
    isVerified: true,
    verifiedAt: '2024-07-01T09:15:00Z',
    lastProductSyncedAt: '2024-07-20T02:45:10Z',
    createdAt: '2024-06-15T10:00:00Z',
    updatedAt: '2024-07-20T02:45:10Z',
  },
  {
    id: 2,
    name: '쇼핑몰B',
    url: 'https://brandstore.naver.com/sorahome',
    platform: PlatformType.NAVER_BRAND_STORE,
    isActive: true,
    isVerified: false,
    verifiedAt: null,
    lastProductSyncedAt: '2024-07-18T13:22:40Z',
    createdAt: '2024-05-03T08:30:00Z',
    updatedAt: '2024-07-18T13:22:40Z',
  },
  {
    id: 3,
    name: '쇼핑몰C',
    url: 'https://smartstore.naver.com/rumiatelier',
    platform: PlatformType.NAVER_SMART_STORE,
    isActive: false,
    isVerified: true,
    verifiedAt: '2024-03-12T01:05:30Z',
    lastProductSyncedAt: '2024-04-02T23:11:05Z',
    createdAt: '2024-02-10T04:20:00Z',
    updatedAt: '2024-04-02T23:11:05Z',
  },
];

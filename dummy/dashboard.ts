import { DashboardReply } from '@/app/(private)/dashboard/_components';
import { Alert, AlertType, AuthProvider } from '@/types';

export const dummyAlerts: Alert[] = [
  {
    id: '1',
    createdAt: new Date('2025-12-01'),
    variant: 'error',
    type: AlertType.PAYMENT_FAILED,
    title:
      '정기 결제에 실패했습니다. D-2 후 무료 플랜으로 전환됩니다.\n원활한 서비스 이용을 위해 결제 정보를 확인해 주세요.',
    href: '/subscribe',
  },
  {
    id: '2',
    createdAt: new Date('2025-12-11'),
    variant: 'warning',
    type: AlertType.STORE_AUTH_REJECTED,
    title: '쇼핑몰 관리자 인증이 반려되었습니다.',
    href: '/stores',
  },
  {
    id: '3',
    createdAt: new Date('2025-12-12'),
    variant: 'warning',
    type: AlertType.STORE_LIMIT_EXCEEDED,
    title: '구독 플랜 변경으로 쇼핑몰 수 조정이 필요합니다.',
    href: '/stores',
  },
  {
    id: '4',
    createdAt: new Date('2025-12-30'),
    variant: 'warning',
    type: AlertType.PRODUCT_LIMIT_EXCEEDED,
    title: '구독 플랜 변경으로 상품 수 조정이 필요합니다.',
    href: '/products',
  },
];

export const dummyUser = {
  accessToken: '123',
  refreshToken: '123',
  user: {
    id: 1,
    email: 'user@replmae.com',
    name: '김리플',
    phoneNumber: '010-1234-5678',
    authProvider: AuthProvider.GOOGLE,
    authProviderId: '123',
    isVerified: false,
    verifiedAt: '2026-01-15',
    createdAt: '2026-01-15',
    updatedAt: '2026-01-15',
    needsTermsAgreement: true,
  },
};

export const dummyReplies: DashboardReply[] = [
  {
    id: 1,
    productName: '이바나 츄르비츠 가다랑어&참치맛',
    sentiment: { type: 'negative', score: 1 },
    content:
      '이바나 츄르비츠 가다랑어&참치 역시 맛있어서 고양이가 너무너무너무 좋아하구, 팔짝팔짝 뛰어요. 추천합니다.',
    createdAt: '2025.12.02',
  },
  {
    id: 2,
    productName: '로얄캐닌 키튼 고양이 사료',
    sentiment: { type: 'positive', score: 5 },
    content: '정말 맛있습니다! 고양이가 너무 좋아해요',
    createdAt: '2025.12.01',
  },
  {
    id: 3,
    productName: '고양이 장난감 낚시대',
    sentiment: { type: 'neutral', score: 3 },
    content: '괜찮은 제품이에요. 가격 대비 좋습니다.',
    createdAt: '2025.11.30',
  },
  {
    id: 4,
    productName: '캣타워 프리미엄',
    sentiment: { type: 'positive', score: 4 },
    content: '고양이가 정말 좋아해요! 추천합니다.',
    createdAt: '2025.11.29',
  },
  {
    id: 5,
    productName: '고양이 모래 벤토나이트',
    sentiment: { type: 'negative', score: 2 },
    content: '먼지가 좀 많이 날려서 아쉬워요',
    createdAt: '2025.11.28',
  },
];

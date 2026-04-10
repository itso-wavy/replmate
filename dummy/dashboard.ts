import type { DashboardReplyRow } from '@/types';
import type { UserDomain } from '@/types';
import { AuthProvider } from '@/types';

export const dummyUser: UserDomain = {
  id: 1,
  email: 'user@replmae.com',
  name: '김리플',
  phoneNumber: '010-1234-5678',
  authProvider: AuthProvider.GOOGLE,
  authProviderId: '123',
  isVerified: false,
  verifiedAt: null,
  createdAt: new Date('2026-01-15'),
  updatedAt: new Date('2026-01-15'),
  needsTermsAgreement: true,
};

export const dummyReplies: DashboardReplyRow[] = [
  {
    id: 1,
    productName: '이바나 츄르비츠 가다랑어&참치맛',
    sentiment: { type: 'negative', score: 1 },
    reviewContent:
      '이바나 츄르비츠 가다랑어&참치 역시 맛있어서 고양이가 너무너무너무 좋아하구, 팔짝팔짝 뛰어요. 추천합니다.',
    replyContent: '감사합니다! 다음에도 많은 관심 부탁드립니다.',
    createdAt: new Date('2025-12-02'),
  },
  {
    id: 2,
    productName: '로얄캐닌 키튼 고양이 사료',
    sentiment: { type: 'positive', score: 5 },
    reviewContent: '정말 맛있습니다! 고양이가 너무 좋아해요',
    replyContent: '좋은 리뷰 감사합니다!',
    createdAt: new Date('2025-12-01'),
  },
  {
    id: 3,
    productName: '고양이 장난감 낚시대',
    sentiment: { type: 'neutral', score: 3 },
    reviewContent: '괜찮은 제품이에요. 가격 대비 좋습니다.',
    replyContent: '소중한 의견 감사합니다.',
    createdAt: new Date('2025-11-30'),
  },
  {
    id: 4,
    productName: '캣타워 프리미엄',
    sentiment: { type: 'positive', score: 4 },
    reviewContent: '고양이가 정말 좋아해요! 추천합니다.',
    replyContent: '추천해주셔서 감사합니다!',
    createdAt: new Date('2025-11-29'),
  },
  {
    id: 5,
    productName: '고양이 모래 벤토나이트',
    sentiment: { type: 'negative', score: 2 },
    reviewContent: '먼지가 좀 많이 날려서 아쉬워요',
    replyContent: '불편을 드려 죄송합니다. 개선하겠습니다.',
    createdAt: new Date('2025-11-28'),
  },
];

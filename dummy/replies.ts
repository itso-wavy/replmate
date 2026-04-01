import type { ReplyDomain } from '@/types';

const baseProduct = {
  id: 1,
  name: '[80일분] 라이프 스타일러 올인원 종합 멀티비타민 80정 1박스',
  externalId: '1234567/89',
  price: 29900,
  currency: 'KRW',
  isTarget: true,
  avgRating: 4.8,
  reviewCount: 625,
  registeredAt: new Date('2025-11-01T00:00:00+09:00'),
};

export const dummyReplies: ReplyDomain[] = [
  {
    id: 1,
    review: {
      id: 101,
      reviewer: 'yu****',
      rating: 5,
      content:
        '하루 한 번만 챙겨 먹으면 돼서 정말 편해요. 여러 영양제를 따로 사지 않아도 돼서 만족합니다.',
      reviewedAt: new Date('2026-02-12T09:30:00+09:00'),
    },
    product: baseProduct,
    aiText:
      '정성스러운 후기 감사합니다.\n하루 한 번 간편하게 여러 영양을 챙기실 수 있도록 구성한 제품인데 만족해 주셔서 기쁩니다.\n앞으로도 꾸준히 편하게 섭취해 보시길 바랍니다.\n다음에도 찾아주세요.',
    sentimentLevel: 5,
    createdAt: new Date('2026-02-12T10:00:00+09:00'),
  },
  {
    id: 2,
    review: {
      id: 102,
      reviewer: 'jy****',
      rating: 5,
      content: '가성비 좋고 목 넘김도 무난해서 부담 없이 먹기 좋아요.',
      reviewedAt: new Date('2026-02-20T14:10:00+09:00'),
    },
    product: baseProduct,
    aiText:
      '좋은 후기 남겨주셔서 감사합니다.\n부담 없이 꾸준히 드시기 좋은 점을 알아봐 주셔서 정말 기쁩니다.\n앞으로도 만족스러운 품질로 보답하겠습니다.',
    sentimentLevel: 3.2,
    createdAt: new Date('2026-02-20T14:40:00+09:00'),
  },
  {
    id: 3,
    review: {
      id: 103,
      reviewer: 'sd03****',
      rating: 5,
      content:
        '부모님 선물로 구매했는데 한 번에 여러 영양 성분을 챙길 수 있어서 좋아하셨어요.',
      reviewedAt: new Date('2026-02-14T17:20:00+09:00'),
    },
    product: baseProduct,
    aiText:
      '소중한 선물로 선택해 주셔서 감사합니다.\n부모님께서 만족하셨다니 저희도 무척 기쁩니다.\n앞으로도 믿고 선택하실 수 있는 제품이 되겠습니다.',
    sentimentLevel: 5,
    createdAt: new Date('2026-02-14T18:00:00+09:00'),
  },
  {
    id: 4,
    review: {
      id: 104,
      reviewer: 'tngu*******',
      rating: 5,
      content: '배송이 빨라서 좋았고 포장도 깔끔했어요.\n재구매 의사 있습니다.',
      reviewedAt: new Date('2026-02-19T11:05:00+09:00'),
    },
    product: baseProduct,
    aiText:
      '빠른 배송과 포장 상태까지 만족해 주셔서 감사합니다.\n재구매 의사까지 전해 주셔서 큰 힘이 됩니다.\n다음 주문도 만족스럽게 받아보실 수 있도록 준비하겠습니다.',
    sentimentLevel: 4,
    createdAt: new Date('2026-02-19T11:40:00+09:00'),
  },
  {
    id: 5,
    review: {
      id: 105,
      reviewer: 'nhgi***',
      rating: 4,
      content: '며칠 더 먹어보고 괜찮으면 재구매할게요.',
      reviewedAt: new Date('2026-02-23T08:50:00+09:00'),
    },
    product: baseProduct,
    aiText:
      '구매 후기를 남겨주셔서 감사합니다.\n조금 더 드셔 보신 뒤에도 만족스러운 경험이 되길 바랍니다.\n사용하시면서 궁금한 점이 생기면 언제든 확인해 주세요.',
    sentimentLevel: 3,
    createdAt: new Date('2026-02-23T09:15:00+09:00'),
  },
  {
    id: 6,
    review: {
      id: 106,
      reviewer: 'clea*****',
      rating: 5,
      content: '80정이라 넉넉해서 좋고 매일 챙겨 먹기 편합니다.',
      reviewedAt: new Date('2026-02-22T20:00:00+09:00'),
    },
    product: baseProduct,
    aiText:
      '넉넉한 구성과 편한 복용감을 좋게 봐주셔서 감사합니다.\n매일 부담 없이 챙기실 수 있도록 만든 제품이라 더욱 뜻깊습니다.\n꾸준한 건강 관리에 도움이 되길 바랍니다.',
    sentimentLevel: 5,
    createdAt: new Date('2026-02-22T20:30:00+09:00'),
  },
];

export const dummyRecentReplies: ReplyDomain[] = [
  {
    id: 1,
    review: {
      id: 201,
      reviewer: 'cat***',
      rating: 5,
      content:
        '입맛 까다로운 아이가 바로 잘 먹어서 만족합니다. 냄새도 심하지 않고 한 번에 주기 좋은 양이에요.',
      reviewedAt: new Date('2026-04-02T09:00:00+09:00'),
    },
    product: {
      ...baseProduct,
      id: 11,
      name: '프리미엄 참치 고양이 간식',
      externalId: 'CAT-1001',
    },
    aiText:
      '소중한 후기 감사합니다. 기호성이 좋아 만족하셨다니 기쁩니다. 앞으로도 믿고 급여하실 수 있는 제품으로 보답하겠습니다.',
    sentimentLevel: 5,
    createdAt: new Date('2026-04-02T09:10:00+09:00'),
  },
  {
    id: 2,
    review: {
      id: 202,
      reviewer: 'dog***',
      rating: 3,
      content:
        '배송은 빨랐고 포장도 깔끔했어요. 다만 생각했던 것보다 스틱 길이가 조금 짧았습니다.',
      reviewedAt: new Date('2026-04-02T08:10:00+09:00'),
    },
    product: {
      ...baseProduct,
      id: 12,
      name: '부드러운 치킨 져키 스틱',
      externalId: 'DOG-2304',
    },
    aiText:
      '구매 후기 감사합니다. 배송과 포장 상태에 만족해 주셔서 감사합니다. 말씀해 주신 크기 부분도 참고해 더 좋은 만족을 드릴 수 있도록 하겠습니다.',
    sentimentLevel: 3,
    createdAt: new Date('2026-04-02T08:25:00+09:00'),
  },
  {
    id: 3,
    review: {
      id: 203,
      reviewer: 'mimi***',
      rating: 2,
      content:
        '응고력은 기대보다 약했고 먼지도 생각보다 있는 편이었어요. 다음에는 다른 제품도 비교해 보려고 합니다.',
      reviewedAt: new Date('2026-04-01T18:20:00+09:00'),
    },
    product: {
      ...baseProduct,
      id: 13,
      name: '천연 벤토나이트 고양이 모래 6kg',
      externalId: 'LIT-6006',
    },
    aiText:
      '불편을 드려 죄송합니다. 응고력과 먼지 부분에 대한 의견 감사드리며, 남겨주신 내용은 제품 개선에 참고하겠습니다.',
    sentimentLevel: 1,
    createdAt: new Date('2026-04-01T18:42:00+09:00'),
  },
  {
    id: 4,
    review: {
      id: 204,
      reviewer: 'paw***',
      rating: 4,
      content:
        '소음이 크지 않고 세척도 어렵지 않아서 만족합니다. 고양이도 설치한 날부터 바로 사용했어요.',
      reviewedAt: new Date('2026-04-01T13:40:00+09:00'),
    },
    product: {
      ...baseProduct,
      id: 14,
      name: '자동 반려동물 정수기',
      externalId: 'WAT-4100',
    },
    aiText:
      '만족스러운 사용 경험을 남겨주셔서 감사합니다. 소음과 세척 편의성까지 좋게 봐주셔서 기쁩니다. 앞으로도 편하게 사용해 주세요.',
    sentimentLevel: 4,
    createdAt: new Date('2026-04-01T14:05:00+09:00'),
  },
  {
    id: 5,
    review: {
      id: 205,
      reviewer: 'bone***',
      rating: 3,
      content:
        '전반적인 품질은 괜찮아 보이는데 개봉 후 보관할 때 봉투 밀봉력이 조금 더 좋았으면 합니다.',
      reviewedAt: new Date('2026-03-31T20:00:00+09:00'),
    },
    product: {
      ...baseProduct,
      id: 15,
      name: '덴탈 케어 강아지 껌 세트',
      externalId: 'DEN-7788',
    },
    aiText:
      '후기 남겨주셔서 감사합니다. 품질에 만족해 주셔서 감사드리며, 보관 편의성에 대한 의견도 함께 참고하겠습니다.',
    sentimentLevel: 3,
    createdAt: new Date('2026-03-31T20:30:00+09:00'),
  },
  {
    id: 6,
    review: {
      id: 206,
      reviewer: 'sal***',
      rating: 5,
      content:
        '간식으로도 좋고 사료에 토핑처럼 올려주기에도 편해요. 편식 심한 아이 반응이 좋아서 다시 주문할 예정입니다.',
      reviewedAt: new Date('2026-03-31T10:50:00+09:00'),
    },
    product: {
      ...baseProduct,
      id: 16,
      name: '동결건조 연어 큐브',
      externalId: 'SAL-0901',
    },
    aiText:
      '정성스러운 후기 감사합니다. 다양한 방식으로 활용하시기 좋았다니 기쁩니다. 재주문까지 고려해 주셔서 감사드립니다.',
    sentimentLevel: 5,
    createdAt: new Date('2026-03-31T11:15:00+09:00'),
  },
];

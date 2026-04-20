import type { TermsDto } from '@/types/api/term';
import type { NotificationSettingsDomain } from '@/types/domain/user';
import { TermsType } from '@/types/enums';

export const dummyNotificationSettings: NotificationSettingsDomain = {
  emailEnabled: true,
  smsEnabled: false,
  updatedAt: new Date('2025-01-10T05:30:00Z'),
};

export const dummyTermsList: TermsDto[] = [
  {
    id: 1,
    type: TermsType.TERMS_OF_SERVICE,
    title: '서비스 이용약관',
    content: '서비스 이용약관 전체 내용입니다.',
    contentDetail: '',
    isRequired: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 2,
    type: TermsType.PRIVACY_POLICY,
    title: '개인정보 처리방침',
    content: '개인정보 처리방침 전체 내용입니다.',
    contentDetail: '',
    isRequired: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 3,
    type: TermsType.PERSONAL_INFO_COLLECTION,
    title: '개인정보 수집 및 이용',
    content: '개인정보 수집 및 이용 동의 전체 내용입니다.',
    contentDetail: '',
    isRequired: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 4,
    type: TermsType.MARKETING_CONSENT,
    title: '마케팅 정보 수신 동의',
    content: '마케팅 정보 수신 동의 전체 내용입니다.',
    contentDetail: '',
    isRequired: false,
    createdAt: '2025-01-01T00:00:00Z',
  },
];

import { TermsType } from '@/types/enums';

export const TERMS_CONFIG = [
  {
    type: TermsType.TERMS_OF_SERVICE,
    label: '서비스 이용약관',
    required: true,
  },
  {
    type: TermsType.PRIVACY_POLICY,
    label: '개인정보 처리방침',
    required: true,
  },
  {
    type: TermsType.PERSONAL_INFO_COLLECTION,
    label: '개인정보 수집 및 이용',
    required: true,
  },
  {
    type: TermsType.MARKETING_CONSENT,
    label: '마케팅 정보 수신 동의',
    required: false,
  },
] as const;

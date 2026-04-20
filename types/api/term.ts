import { TermsType } from '../enums';

// ==========================================================
// 약관 (Terms)
// ==========================================================

// GET /api/v1/terms 약관 목록 조회 API
export interface TermsDto {
  id: number;
  type: TermsType;
  title: string;
  content: string;
  contentHtml: string;
  isRequired: boolean;
  createdAt: string;
}

// POST /api/v1/users/me/terms-agreements 약관 동의 응답
export interface AgreedTermDto {
  termsId: number;
  title: string;
  isRequired: boolean;
  agreedAt: string;
}

// POST /api/v1/users/me/terms-agreements 약관 동의 응답 데이터
export interface AgreeTermsResponseData {
  agreedTerms: AgreedTermDto[];
}

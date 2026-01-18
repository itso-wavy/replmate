import { TermsType } from './enums';

// ============================================================================
// 약관 (Terms)
// ============================================================================

// GET /api/v1/terms 약관 목록 조회 API
export interface Term {
  id: number;
  type: TermsType; // TODO: 추가 부분
  title: string;
  content: string;
  is_required: boolean;
  created_at: string;
}

// POST /api/v1/users/me/terms-agreements
// export interface UserTermsAgreement {
//   id: number;
//   userId: number;
//   termsId: number;
//   agreedAt: string;
// }

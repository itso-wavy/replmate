import { api } from '@/lib/api';
import { TERMS_ENDPOINTS } from '@/lib/endpoints';
import type { TermsDto } from '@/types/api/term';
import type { TermsType } from '@/types/enums';

/**
 * 약관 목록 조회
 */
export async function getTermsList(): Promise<TermsDto[]> {
  const response = await api.get<TermsDto[]>(TERMS_ENDPOINTS.GET_TERMS_LIST);
  return response.data;
}

/**
 * 약관 타입 목록 조회
 * GET /api/v1/terms/types → string[]
 */
export async function getTermsTypes(): Promise<string[]> {
  const response = await api.get<string[]>(TERMS_ENDPOINTS.GET_TERMS_TYPES);
  return response.data;
}

/**
 * 약관 타입별 조회
 */
export async function getTermsByType(type: TermsType): Promise<TermsDto> {
  const response = await api.get<TermsDto>(
    TERMS_ENDPOINTS.GET_TERMS_BY_TYPE(type)
  );
  return response.data;
}

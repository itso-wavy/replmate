import type { LoginResponse } from '@/types/api/auth';

import type { UserDomain } from './user';

// ============================================================================
// 인증 도메인
// ============================================================================

/**
 * 로그인 응답 도메인
 */
export interface LoginResponseDomain {
  user: UserDomain;
  accessToken: string;
  refreshToken: string;
}

/**
 * LoginResponse → LoginResponseDomain 변환
 * 참고: user는 별도로 toUserDomain()을 통해 변환 필요
 */
export function toLoginResponseDomain(
  response: LoginResponse,
  userDomain: UserDomain
): LoginResponseDomain {
  return {
    user: userDomain,
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
  };
}

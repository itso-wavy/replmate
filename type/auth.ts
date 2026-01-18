import { AuthProvider } from './enums';

// ============================================================================
// 사용자 (User)
// ============================================================================

export interface User {
  id: number;
  email: string;
  name: string;
  phone_number: string | null;
  auth_provider: AuthProvider;
  auth_provider_id: string;
  is_verified: boolean;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
  needs_terms_agreement: boolean;
  is_del: boolean;
  deleted_at: string | null;
}

// ============================================================================
// 인증 토큰 (next-auth 통합용)
// ============================================================================

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  sessionId: string; // 백엔드 Redis 세션 ID
}

export interface AuthState extends AuthTokens {
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    accessToken: string;
    refreshToken: string;
    sessionId: string;
    user: User;
  }) => void;
  clearAuth: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

// ============================================================================
// 백엔드 로그인 응답
// ============================================================================

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  sessionId: string;
  user: User;
}

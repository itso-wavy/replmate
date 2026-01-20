import { AuthProvider } from './enums';

// ============================================================================
// 사용자 (User)
// ============================================================================

export interface User {
  id: number;
  email: string;
  name: string;
  phoneNumber: string | null;
  authProvider: AuthProvider;
  authProviderId: string;
  isVerified: boolean;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt: string;
  needsTermsAgreement: boolean;
}

// ============================================================================
// 인증 토큰 (next-auth 통합용)
// ============================================================================

export interface AuthState {
  user: User | null;
  isAuthenticated?: boolean;
  accessToken: string;
  refreshToken: string;
  // sessionId: string,
}

export interface AuthAction {
  setAuth: (data: {
    user: User;
    accessToken: string;
    refreshToken: string;
    // sessionId: string;
  }) => void;
  clearAuth: () => void;
}

// ============================================================================
// 백엔드 로그인 응답
// ============================================================================

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  // sessionId: string;
  user: User;
}

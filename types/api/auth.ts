import { AuthProvider } from '../enums';
import { UserDto } from './user';

// ============================================================================
// 백엔드 로그인 응답
// ============================================================================

export interface LoginResponse {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
  // sessionId: string;
}

import { UserDto } from '@/types/api/user';

// isVerified/verifiedAt은 session에 저장하지 않음.
// single source of truth = GET /users/me (useUser 쿼리).
type SessionUserDto = Omit<UserDto, 'isVerified' | 'verifiedAt'>;

declare module 'next-auth' {
  // User에 UserDto 필드 병합 (id는 string 유지)
  interface User extends Omit<UserDto, 'id'> {}

  interface Session {
    user: SessionUserDto;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: SessionUserDto;
  }
}

import { UserDto } from '@/types/api/user';

declare module 'next-auth' {
  // User에 UserDto 필드 병합 (id는 string 유지)
  interface User extends Omit<UserDto, 'id'> {}

  interface Session {
    user: UserDto;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    user?: UserDto;
  }
}

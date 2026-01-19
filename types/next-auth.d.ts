import { DefaultSession } from 'next-auth';

import { User } from '@/type/auth';

declare module 'next-auth' {
  interface Session {
    backendAuth: {
      accessToken: string;
      refreshToken: string;
      // sessionId: string;
    };
    user: User;
  }

  interface Account {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendSessionId?: string;
    backendUser?: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendAccessToken?: string;
    backendRefreshToken?: string;
    backendSessionId?: string;
    backendUser?: User;
  }
}

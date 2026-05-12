'use client';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { UserStore } from '@/store/userStore';
import { toUserDomain } from '@/types';

function AuthSessionSync() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = UserStore.useActions();
  const isAuthenticated = UserStore.useIsAuthenticated();

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user && !isAuthenticated) {
      // session에는 isVerified/verifiedAt 없음 (single source = /users/me).
      // Zustand UserDomain 타입 충족용 기본값 보강. 이 값은 신뢰하지 말 것.
      setUser(
        toUserDomain({
          ...session.user,
          isVerified: false,
          verifiedAt: null,
        })
      );
    } else if (status === 'unauthenticated' && isAuthenticated) {
      console.warn('[auth] NextAuth 세션 없음 → clearUser', {
        status,
        session,
      });
      clearUser();
    }
  }, [session, status]);

  return null;
}

export default AuthSessionSync;

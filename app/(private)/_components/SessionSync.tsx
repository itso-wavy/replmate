'use client';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { UserStore } from '@/store/userStore';
import { toUserDomain } from '@/types/domain/user';

function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = UserStore.useActions();
  const isAuthenticated = UserStore.useIsAuthenticated();

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user && !isAuthenticated) {
      setUser(toUserDomain(session.user));
    } else if (status === 'unauthenticated' && isAuthenticated) {
      console.warn('[auth] NextAuth 세션 없음 → clearUser', { status, session });
      clearUser();
    }
  }, [session, status]);

  return null;
}

export default SessionSync;

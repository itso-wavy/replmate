'use client';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { AuthStore } from '@/store/authStore';
import { toUserDomain } from '@/types/domain/user';

function SessionSync() {
  const { data: session, status } = useSession();
  const { setAuth, clearAuth } = AuthStore.useActions();
  const isAuthenticated = AuthStore.useIsAuthenticated();

  useEffect(() => {
    if (status === 'loading') return;
    if (session?.user && !isAuthenticated) {
      setAuth({
        user: toUserDomain(session.user),
      });
    } else if (status === 'unauthenticated' && isAuthenticated) {
      clearAuth();
    }
  }, [session, status]);

  return null;
}

export default SessionSync;

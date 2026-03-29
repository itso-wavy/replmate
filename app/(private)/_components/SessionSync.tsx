'use client';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { dummyUsers } from '@/dummy';
import { UserStore } from '@/store/userStore';
import { toUserDomain } from '@/types/domain/user';

const IS_DESIGN_MODE = process.env.NEXT_PUBLIC_DESIGN_MODE === 'true';

function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser, clearUser } = UserStore.useActions();
  const isAuthenticated = UserStore.useIsAuthenticated();

  useEffect(() => {
    if (IS_DESIGN_MODE) {
      setUser(dummyUsers[0]);
      return;
    }

    if (status === 'loading') return;
    if (session?.user && !isAuthenticated) {
      setUser(toUserDomain(session.user));
    } else if (status === 'unauthenticated' && isAuthenticated) {
      clearUser();
    }
  }, [session, status]);

  return null;
}

export default SessionSync;

'use client';

import { useRouter } from 'next/navigation';

import { useEffect } from 'react';

import { useSession } from 'next-auth/react';

import { useAuthStore } from '@/store/authStore';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const setAuth = useAuthStore((state) => state.actions.setAuth);

  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'authenticated' && session?.backendAuth) {
      // next-auth 세션에서 백엔드 JWT + sessionId를 가져와 Zustand에 저장
      setAuth({
        accessToken: session.backendAuth.accessToken,
        refreshToken: session.backendAuth.refreshToken,
        user: session.user,
      });

      // Dashboard로 리다이렉트
      router.push('/dashboard');
    } else {
      // 인증 실패 시 로그인 페이지로
      router.push('/login');
    }
  }, [status, session, setAuth, router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold'>로그인 처리 중...</h2>
        <p className='text-muted-foreground mt-2'>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

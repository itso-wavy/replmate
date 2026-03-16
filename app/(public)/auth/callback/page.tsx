'use client';

import { useEffect } from 'react';

import { signIn } from 'next-auth/react';

import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const res = await api.get(ENDPOINTS.USER.GET_USER);
        const user = res.data.data;

        await signIn('backend-session', {
          user: JSON.stringify(user),
          redirect: false,
        });

        if (window.opener) {
          window.opener.location.replace('/dashboard');
          window.close();
        } else {
          window.location.replace('/dashboard');
        }
      } catch {
        if (window.opener) {
          window.opener.location.replace('/login');
          window.close();
        } else {
          window.location.replace('/login');
        }
      }
    };

    handleCallback();
  }, []);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <div className='text-center'>
        <h2 className='text-2xl font-semibold'>로그인 처리 중...</h2>
        <p className='text-muted-foreground mt-2'>잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

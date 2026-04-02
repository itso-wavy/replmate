'use client';

import { useEffect } from 'react';

import { signIn } from 'next-auth/react';

import { AUTH_PROVIDER_ID } from '@/constants/auth';
import { ROUTES } from '@/constants/nav-menu';
import api from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { UserDto } from '@/types';

export default function AuthCallbackPage() {
  useEffect(() => {
    const handleCallback = async () => {
      try {
        const res = await api.get<UserDto>(ENDPOINTS.USER.GET_USER);
        const user = res.data;

        await signIn(AUTH_PROVIDER_ID.BACKEND_SESSION, {
          user: JSON.stringify(user),
          redirect: false,
        });

        const destination = user.needsTermsAgreement
          ? ROUTES.TERMS_AGREEMENT
          : ROUTES.DASHBOARD;

        if (window.opener) {
          window.opener.location.replace(destination);
          window.close();
        } else {
          window.location.replace(destination);
        }
      } catch {
        if (window.opener) {
          window.opener.location.replace(ROUTES.LOGIN);
          window.close();
        } else {
          window.location.replace(ROUTES.LOGIN);
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

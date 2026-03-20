'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import googleIcon from '@/assets/png/google.png';
import kakaoIcon from '@/assets/png/kakao.png';
import { NaverSvg } from '@/assets/svg';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ENDPOINTS } from '@/lib/endpoints';
import { UserStore } from '@/store/userStore';
import { AuthProvider } from '@/types';

import { PublicHeader } from '../_components';

export const LoginPage = () => {
  const router = useRouter();

  const isAuthenticated = UserStore.useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else setIsLoading(false);
  }, [isAuthenticated]);

  const loginUrls: Record<AuthProvider, string> = {
    [AuthProvider.GOOGLE]: ENDPOINTS.OAUTH.GOOGLE_LOGIN,
    [AuthProvider.KAKAO]: ENDPOINTS.OAUTH.KAKAO_LOGIN,
    [AuthProvider.NAVER]: ENDPOINTS.OAUTH.NAVER_LOGIN,
  };

  const handleSocialLogin = (provider: AuthProvider) => {
    window.open(
      loginUrls[provider],
      'social login', // 팝업 창 이름
      'width=500,height=600,left=400,top=200' // 팝업 옵션(크기/위치)
    );
  };

  return (
    <div className='flex flex-1 flex-col bg-gradient-to-b from-white to-gray-50'>
      {/* Background Elements */}
      <div className='absolute inset-0 isolate'>
        {/* Subtle Grid Pattern */}
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:36px_36px]' />
        {/* Rainbow Pattern */}
        <div className='absolute top-[250px] left-1/2 size-[80px] -translate-x-1/2 -translate-y-1/2 scale-x-[1.6] opacity-10'>
          <div className='absolute -inset-24 bg-[conic-gradient(from_0deg,var(--color-brand-400)_0deg,var(--color-brand-green)_123deg,transparent_200deg,var(--color-brand-200)_270deg,var(--color-brand-yellow)_300deg,var(--color-brand-400)_340deg)] mix-blend-overlay blur-[50px] saturate-[2]' />
        </div>
      </div>

      <PublicHeader />

      <main className='wrapper flex flex-1 items-center justify-center'>
        {isLoading && (
          <div className='grid place-content-center'>
            <Spinner />
          </div>
        )}

        {!isLoading && (
          <div className='relative flex w-[320px] max-w-[350px] flex-col text-center'>
            <div>
              <h1 className='text-foreground typo-display-32'>로그인</h1>
              <p className='typo-body-16 text-muted-foreground pt-2'>
                로그인 후 평생 무료 플랜을 이용해보세요!
              </p>
            </div>
            <div className='mt-14 flex w-full flex-col items-center space-y-2'>
              <Button
                className='border-border text-foreground hover:bg-input/30 relative w-full gap-2 bg-white'
                onClick={() => handleSocialLogin(AuthProvider.GOOGLE)}
              >
                <Image
                  alt='google-logo'
                  src={googleIcon}
                  width={22}
                  height={22}
                  className='absolute left-[20px]'
                />
                <span>구글 로그인</span>
              </Button>

              <Button
                className='bg-kakao-theme relative w-full gap-2 text-[#000000d8] hover:bg-[hsl(57,100%,50%)]'
                onClick={() => handleSocialLogin(AuthProvider.KAKAO)}
              >
                <Image
                  alt='kakao-logo'
                  src={kakaoIcon}
                  width={22}
                  height={20}
                  className='absolute left-[20px]'
                />
                <span>카카오 로그인</span>
              </Button>

              <Button
                className='bg-naver-theme relative w-full gap-2 hover:bg-[hsl(138,80%,42%)]'
                onClick={() => handleSocialLogin(AuthProvider.NAVER)}
              >
                <NaverSvg className='absolute left-[20px] text-white' />
                <span>네이버 로그인</span>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default LoginPage;

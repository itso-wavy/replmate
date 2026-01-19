'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { CheckIcon } from '@phosphor-icons/react/dist/ssr';
import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

import googleIcon from '@/assets/png/google.png';
import kakaoIcon from '@/assets/png/kakao.png';
import { NaverSvg } from '@/assets/svg';
import TermDialog from '@/components/modal/TermDialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { dummyUser } from '@/dummy/dashboard';
import { useIsAuthenticated, useSetAuth } from '@/store/authStore';
import { AuthProvider, TermsType } from '@/types';

import { PublicHeader } from '../_components';

// import { OAUTH_ENDPOINTS } from '@/services/api';

export const LoginPage = () => {
  const router = useRouter();
  const setAuth = useSetAuth();
  // const
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(true);
  const [showTermOfUseModal, setShowTermOfUseModal] = useState(false);
  const [showPrivacyTermModal, setShowPrivacyTermModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else setIsLoading(false);
  }, [isAuthenticated]);

  const handleSocialLogin = async (provider: AuthProvider) => {
    try {
      // await signIn(provider, {
      //   callbackUrl: '/auth/callback',
      //   redirect: false,
      // });

      setAuth(dummyUser);

      router.push('/dashboard');
    } catch (err) {
      toast.error('SNS 로그인에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return (
    <div className='flex flex-1 flex-col bg-gradient-to-b from-white to-gray-50'>
      {/* Background Elements */}
      <div className='absolute inset-0 isolate'>
        {/* Subtle Grid Pattern */}
        <div className='absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:36px_36px]' />
        {/* Rainbow Pattern */}
        <div className='absolute top-[250px] left-1/2 size-[80px] -translate-x-1/2 -translate-y-1/2 scale-x-[1.6] opacity-10'>
          <div className='absolute -inset-24 bg-[conic-gradient(from_0deg,var(--color-brand-1)_0deg,var(--color-brand-9)_123deg,transparent_200deg,var(--color-brand-2)_270deg,var(--color-brand-11)_300deg,var(--color-brand-1)_340deg)] mix-blend-overlay blur-[50px] saturate-[2]' />
        </div>
      </div>

      <PublicHeader />

      <div className='wrapper flex flex-1 items-center justify-center'>
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

            {/* Legal Disclaimer & Links */}
            <div className='mt-10'>
              <p className='typo-body-14 text-muted-foreground mb-3'>
                계속 진행하면 다음 약관에 동의한 것으로 간주합니다.
              </p>
              <div className='typo-caption-12 text-muted-foreground flex justify-center gap-6 text-center font-medium'>
                <button
                  type='button'
                  onClick={() => setShowTermOfUseModal(true)}
                  className='group flex cursor-pointer items-center gap-1.5 transition-colors'
                >
                  <CheckIcon size={10} strokeWidth={3} />
                  <span className='group-hover:decoration-foreground underline decoration-gray-300 underline-offset-4'>
                    이용 약관
                  </span>
                </button>
                <button
                  type='button'
                  onClick={() => setShowPrivacyTermModal(true)}
                  className='group flex cursor-pointer items-center gap-1.5 transition-colors'
                >
                  <CheckIcon size={10} strokeWidth={3} />
                  <span className='group-hover:decoration-foreground underline decoration-gray-300 underline-offset-4'>
                    개인정보 처리방침
                  </span>
                </button>
                <TermDialog
                  id={TermsType.TERMS}
                  open={showTermOfUseModal}
                  onOpenChange={setShowTermOfUseModal}
                />
                <TermDialog
                  id={TermsType.PRIVACY}
                  open={showPrivacyTermModal}
                  onOpenChange={setShowPrivacyTermModal}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

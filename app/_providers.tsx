'use client';

import { useState } from 'react';

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AxiosError } from 'axios';
import { SessionProvider } from 'next-auth/react';
import { toast } from 'sonner';

const getErrorMessage = (error: unknown): string => {
  /*  FIXME: 에러 핸들링 계층 보완 필요
  - QueryCache, MutationCache의 onError에 Sonner toast 연결
  - AxiosError의 messageKo 필드를 우선 표시, 없으면 기본 메시지 fallback
  - 개별 훅에서 onError 핸들러 없이도 API 에러 자동 toast 처리
  */
  if (error instanceof AxiosError) {
    return error.response?.data?.messageKo ?? '오류가 발생했습니다.';
  }
  return '오류가 발생했습니다.';
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
        mutationCache: new MutationCache({
          onError: (error) => toast.error(getErrorMessage(error)),
        }),
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60,
            gcTime: 1000 * 60 * 5,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>{children}</SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;

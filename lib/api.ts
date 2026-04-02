import axios, { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';

import { ROUTES } from '@/constants/nav-menu';
import { useUserStore } from '@/store/userStore';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // session_id 쿠키 자동 전송
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => {
    // BaseResponse<T> 래퍼에서 data 필드 추출
    // 백엔드 응답 구조: { data: T | null, httpStatus, messageKo, error, errorCode, devNote }
    // → response.data를 T로 변환하여 서비스 레이어에서 직접 사용 가능
    if (
      response.data !== null &&
      typeof response.data === 'object' &&
      'data' in response.data
    ) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined' && !isRedirecting) {
        isRedirecting = true;
        console.warn('[auth] 401 수신 → 강제 로그아웃', {
          url: error.config?.url,
          method: error.config?.method,
        });
        useUserStore.getState().actions.clearUser(); // Zustand + localStorage 초기화
        signOut({ callbackUrl: ROUTES.LOGIN }); // NextAuth 쿠키 제거 + 리다이렉트
      }
    }
    return Promise.reject(error);
  }
);

export default api;

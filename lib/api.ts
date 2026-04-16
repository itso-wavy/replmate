import axios, { AxiosError } from 'axios';
import { signOut } from 'next-auth/react';

import { ROUTES } from '@/constants/nav-menu';
import { API_BASE_V1 } from '@/lib/endpoints';
import { useUserStore } from '@/store/userStore';
import { ApiResponse } from '@/types';

export const api = axios.create({
  baseURL: `${API_BASE_V1}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // session_id 쿠키 자동 전송
});

let isRedirecting = false;

api.interceptors.response.use(
  (response) => {
    const data = response.data as ApiResponse<unknown>;

    if (data !== null && typeof data === 'object' && 'data' in data) {
      response.data = data.data;
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

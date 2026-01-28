import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import { UserDomain } from '@/types';

export interface AuthState {
  user: UserDomain | null;
  isAuthenticated?: boolean;
  accessToken: string;
  refreshToken: string;
  // sessionId: string,
}

export interface AuthAction {
  setAuth: (data: {
    user: UserDomain;
    accessToken: string;
    refreshToken: string;
    // sessionId: string;
  }) => void;
  clearAuth: () => void;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: '',
  refreshToken: '',
  // sessionId: '',
};

export const useAuthStore = create<AuthState & AuthAction>()(
  devtools(
    persist(
      (set, _get) => ({
        ...initialState,
        setAuth: (data) => {
          set({
            ...data,
            isAuthenticated: true,
          });
        },
        clearAuth: () => {
          set({
            ...initialState,
          });
        },
      }),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          // sessionId: state.sessionId,
        }),
      }
    )
  )
);

export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () =>
  useAuthStore((state) => state.isAuthenticated);
export const useAccessToken = () => useAuthStore((state) => state.accessToken);
export const useRefreshToken = () =>
  useAuthStore((state) => state.refreshToken);
// export const useSessionId = () => useAuthStore((state) => state.sessionId);
export const useSetAuth = () => useAuthStore((state) => state.setAuth);
export const useClearAuth = () => useAuthStore((state) => state.clearAuth);

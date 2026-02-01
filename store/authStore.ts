import { create } from 'zustand';
import { combine, devtools, persist } from 'zustand/middleware';

import { UserDomain } from '@/types';

interface AuthState {
  user: UserDomain | null;
  isAuthenticated?: boolean;
  accessToken: string;
  refreshToken: string;
  // sessionId: string,
}

interface AuthAction {
  actions: {
    setAuth: (data: {
      user: UserDomain;
      accessToken: string;
      refreshToken: string;
      // sessionId: string;
    }) => void;
    clearAuth: () => void;
  };
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
      combine(
        initialState,

        (set, _get) => ({
          actions: {
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
          },
        })
      ),
      {
        name: 'auth-store',
        partialize: (state) => ({
          user: state.user,
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          // sessionId: state.sessionId,
        }),
      }
    ),
    {
      name: 'auth-storage',
    }
  )
);

const useUser = () => useAuthStore((state) => state.user);
const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
const useAccessToken = () => useAuthStore((state) => state.accessToken);
const useRefreshToken = () => useAuthStore((state) => state.refreshToken);
//  const useSessionId = () => useAuthStore((state) => state.sessionId);
const useAuthActions = () => useAuthStore((state) => state.actions);

export const AuthStore = {
  useUser,
  useIsAuthenticated,
  useAccessToken,
  useRefreshToken,
  useActions: useAuthActions,
} as const;

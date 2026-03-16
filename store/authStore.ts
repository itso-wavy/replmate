import { create } from 'zustand';
import { combine, devtools, persist } from 'zustand/middleware';

import { UserDomain } from '@/types';

interface AuthState {
  user: UserDomain | null;
  isAuthenticated?: boolean;
}

interface AuthAction {
  actions: {
    setAuth: (data: { user: UserDomain }) => void;
    clearAuth: () => void;
  };
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
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
const useAuthActions = () => useAuthStore((state) => state.actions);

export const AuthStore = {
  useUser,
  useIsAuthenticated,
  useActions: useAuthActions,
} as const;

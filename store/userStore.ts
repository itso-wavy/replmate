import { create } from 'zustand';
import { combine, createJSONStorage, devtools, persist } from 'zustand/middleware';

import { PlanDto, SubscriptionDto, UserDomain } from '@/types';

interface UserState {
  user: UserDomain | null;
  planInfo: PlanDto | null;
  subscription: SubscriptionDto | null;
}

interface UserAction {
  actions: {
    setUser: (user: UserDomain) => void;
    setPlanInfo: (data: { plan: PlanDto; subscription: SubscriptionDto }) => void;
    clearUser: () => void;
  };
}

const initialState: UserState = {
  user: null,
  planInfo: null,
  subscription: null,
};

export const useUserStore = create<UserState & UserAction>()(
  devtools(
    persist(
      combine(initialState, (set, _get) => ({
        actions: {
          setUser: (user: UserDomain) => set({ user }),
          setPlanInfo: (data: { plan: PlanDto; subscription: SubscriptionDto }) =>
            set({
              planInfo: data.plan,
              subscription: data.subscription,
            }),
          clearUser: () => set({ user: null, planInfo: null, subscription: null }),
        },
      })),
      {
        name: 'user-store',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({ user: state.user }), // user만 localStorage 영속
      }
    ),
    { name: 'user-storage' }
  )
);

const useUser = () => useUserStore((state) => state.user);
const useIsAuthenticated = () => useUserStore((state) => state.user !== null);
const usePlanInfo = () => useUserStore((state) => state.planInfo);
const useSubscription = () => useUserStore((state) => state.subscription);
const useUserActions = () => useUserStore((state) => state.actions);

export const UserStore = {
  useUser,
  useIsAuthenticated,
  usePlanInfo,
  useSubscription,
  useActions: useUserActions,
} as const;

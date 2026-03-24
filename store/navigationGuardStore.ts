import { create } from 'zustand';
import { combine, devtools } from 'zustand/middleware';

interface NavigationGuardState {
  isDirty: boolean;
  pendingUrl: string | null;
  onSave: (() => Promise<void>) | null;
}

const initialState: NavigationGuardState = {
  isDirty: false,
  pendingUrl: null,
  onSave: null,
};

const useNavigationGuardStore = create<
  NavigationGuardState & {
    actions: {
      setGuard: (isDirty: boolean, onSave: () => Promise<void>) => void;
      clearGuard: () => void;
      setPendingUrl: (url: string) => void;
      clearPending: () => void;
    };
  }
>()(
  devtools(
    combine(initialState, (set) => ({
      actions: {
        setGuard: (isDirty: boolean, onSave: () => Promise<void>) => {
          set({ isDirty, onSave });
        },
        clearGuard: () => {
          set({ isDirty: false, pendingUrl: null, onSave: null });
        },
        setPendingUrl: (url: string) => {
          set({ pendingUrl: url });
        },
        clearPending: () => {
          set({ pendingUrl: null });
        },
      },
    })),
    { name: 'navigation-guard' }
  )
);

const useIsDirty = () => useNavigationGuardStore((s) => s.isDirty);
const usePendingUrl = () => useNavigationGuardStore((s) => s.pendingUrl);
const useOnSave = () => useNavigationGuardStore((s) => s.onSave);
const useActions = () => useNavigationGuardStore((s) => s.actions);

export const NavigationGuardStore = {
  useIsDirty,
  usePendingUrl,
  useOnSave,
  useActions,
} as const;

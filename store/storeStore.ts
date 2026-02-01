import { create } from 'zustand';
import {
  combine,
  createJSONStorage,
  devtools,
  persist,
} from 'zustand/middleware';

import { StoreDto } from '@/types';

type StoreIdType = StoreDto['id'];

interface StoreState {
  selectedStoreId: StoreIdType | null;
}
interface StoreActions {
  actions: {
    setSelectedStore: (storeId: StoreIdType) => void;
  };
}

const initialState: StoreState = {
  selectedStoreId: null,
};

const useStoreStore = create<StoreState & StoreActions>()(
  devtools(
    persist(
      combine(initialState, (set, _get) => ({
        actions: {
          setSelectedStore: (storeId) => {
            set({
              selectedStoreId: storeId,
            });
          },
        },
      })),
      {
        name: 'store-store',
        storage: createJSONStorage(() => sessionStorage),
        partialize: (state) => ({
          selectedStoreId: state.selectedStoreId,
        }),
      }
    ),
    {
      name: 'store-storage',
    }
  )
);

const useSelectedStoreId = () =>
  useStoreStore((state) => state.selectedStoreId);
const useStoreActions = () => useStoreStore((state) => state.actions);

export const StoreStore = {
  useSelectedStoreId,
  useActions: useStoreActions,
} as const;

// /**
//  * @deprecated
//  * 이 스토어는 더 이상 사용하지 않습니다.
//  * 상품 선택 상태는 StoreProductsTable 컴포넌트 내부에서 useState로 관리합니다.
//  * - 서버 데이터가 source of truth
//  * - 클라이언트는 변경분(added/removed)만 추적
//  * - 저장 성공 시 캐시 무효화 → 서버 데이터 재조회 → 로컬 상태 리셋
//  */

// import { create } from 'zustand';
// import { combine, devtools } from 'zustand/middleware';

// import { ProductDomain, StoreDomain } from '@/types';

// interface ProductState {
//   // 스토어별 초기 상태 (서버에서 가져온 상태)
//   initialIdsByStore: Record<StoreDomain['id'], Set<ProductDomain['id']>>;
//   // 스토어별 선택된 상품 ID Set
//   selectedIdsByStore: Record<StoreDomain['id'], Set<ProductDomain['id']>>;
// }

// interface ProductAction {
//   actions: {
//     // 스토어 초기화 (페이지 진입 시 서버 데이터로 세팅)
//     initializeStore: (storeId: number, productIds: number[]) => void;
//     // 상품 선택 (한도 체크는 호출부에서)
//     selectProduct: (storeId: number, productId: number) => void;
//     // 상품 해제
//     deselectProduct: (storeId: number, productId: number) => void;
//     // 저장 성공 시 현재 상태를 초기 상태로 복사
//     syncInitialState: (storeId: number) => void;
//     // 변경 취소 (초기 상태로 되돌리기)
//     revertChanges: (storeId: number) => void;
//   };
// }

// const initialState: ProductState = {
//   initialIdsByStore: {},
//   selectedIdsByStore: {},
// };

// export const useProductStore = create<ProductState & ProductAction>()(
//   devtools(
//     combine(initialState, (set, get) => ({
//       actions: {
//         initializeStore: (storeId: number, productIds: number[]) => {
//           const idSet = new Set(productIds);
//           set({
//             initialIdsByStore: {
//               ...get().initialIdsByStore,
//               [storeId]: new Set(idSet),
//             },
//             selectedIdsByStore: {
//               ...get().selectedIdsByStore,
//               [storeId]: new Set(idSet),
//             },
//           });
//         },

//         selectProduct: (storeId: number, productId: number) => {
//           set((state) => {
//             const currentSet = state.selectedIdsByStore[storeId] ?? new Set();
//             const newSet = new Set(currentSet);
//             newSet.add(productId);

//             return {
//               selectedIdsByStore: {
//                 ...state.selectedIdsByStore,
//                 [storeId]: newSet,
//               },
//             };
//           });
//         },

//         deselectProduct: (storeId: number, productId: number) => {
//           set((state) => {
//             const currentSet = state.selectedIdsByStore[storeId] ?? new Set();
//             const newSet = new Set(currentSet);
//             newSet.delete(productId);

//             return {
//               selectedIdsByStore: {
//                 ...state.selectedIdsByStore,
//                 [storeId]: newSet,
//               },
//             };
//           });
//         },

//         syncInitialState: (storeId: number) => {
//           const currentSelected = get().selectedIdsByStore[storeId] ?? new Set();
//           set({
//             initialIdsByStore: {
//               ...get().initialIdsByStore,
//               [storeId]: new Set(currentSelected),
//             },
//           });
//         },

//         revertChanges: (storeId: number) => {
//           const initialSet = get().initialIdsByStore[storeId] ?? new Set();
//           set({
//             selectedIdsByStore: {
//               ...get().selectedIdsByStore,
//               [storeId]: new Set(initialSet),
//             },
//           });
//         },
//       },
//     })),
//     { name: 'product-storage' }
//   )
// );

// // 셀렉터 훅들
// const useSelectedIds = (storeId: number | null) =>
//   useProductStore((state) =>
//     storeId !== null
//       ? (state.selectedIdsByStore[storeId] ?? new Set<number>())
//       : new Set<number>()
//   );

// const useSelectedCount = (storeId: number | null) =>
//   useProductStore((state) =>
//     storeId !== null ? (state.selectedIdsByStore[storeId]?.size ?? 0) : 0
//   );

// const useTotalSelectedCount = (storeIds: number[]) =>
//   useProductStore((state) =>
//     storeIds.reduce(
//       (total, id) => total + (state.selectedIdsByStore[id]?.size ?? 0),
//       0
//     )
//   );

// const useHasChanges = (storeId: number | null) =>
//   useProductStore((state) => {
//     if (storeId === null) return false;

//     const current = state.selectedIdsByStore[storeId] ?? new Set();
//     const initial = state.initialIdsByStore[storeId] ?? new Set();

//     if (current.size !== initial.size) return true;

//     for (const id of current) {
//       if (!initial.has(id)) return true;
//     }
//     return false;
//   });

// const useProductActions = () => useProductStore((state) => state.actions);

// export const ProductStore = {
//   useSelectedIds,
//   useSelectedCount,
//   useTotalSelectedCount,
//   useHasChanges,
//   useActions: useProductActions,
// } as const;

import { StoreDomain } from '@/types';

export const getActiveStoreList = (stores: StoreDomain[]) => {
  // 활성 상태의 쇼핑몰만 걸러내는 함수
  // 스토어 상태가 활성화이거나, 비활성화 예정
  return stores.filter(
    (store) => store.status === 'active' || store.status === 'deactivating'
  );
};

export const getRegisteredStoreList = (stores: StoreDomain[]) => {
  // 연동 상태의 쇼핑몰만 걸러내는 함수
  // 스토어 상태가 활성화이거나, 비활성화 예정, 연동 대기
  return stores.filter(
    (store) =>
      store.status === 'active' ||
      store.status === 'deactivating' ||
      store.status === 'pending'
  );
};

export const sortStoreList = (stores: StoreDomain[]) => {
  /*
  ∙ 기본 정렬: 쇼핑몰명 가나다순 (ASC)
 */
  return [...stores].sort((a, b) => a.name.localeCompare(b.name));
};

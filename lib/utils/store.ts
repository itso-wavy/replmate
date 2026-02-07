import { StoreDomain } from '@/types';

export const getActiveStoreList = (stores: StoreDomain[]) => {
  // 활성 상태의 쇼핑몰만 걸러내는 함수
  return stores.filter((store) => store.status === 'active');
};

export const sortStoreList = (stores: StoreDomain[]) => {
  /*
  ∙ 기본 정렬: 쇼핑몰명 가나다순 (ASC)
 */
  return [...stores].sort((a, b) => a.name.localeCompare(b.name));
};

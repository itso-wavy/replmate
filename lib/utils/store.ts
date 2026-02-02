import { StoreDomain } from '@/types';

export const getActiveStoreList = (stores: StoreDomain[]) => {
  // 활성 상태의 쇼핑몰만 걸러내는 함수
  return stores.filter((store) => store.isActive && store.isVerified);
};

export const sortStoreList = (stores: StoreDomain[]) => {
  /* 
  ∙ 기본 정렬: 등록일 최신순 (DESC)
  ∙ 2차 정렬: 쇼핑몰명 가나다순 (ASC)
 */
  return [...stores].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();

    if (dateA !== dateB) return dateB - dateA;
    return a.name.localeCompare(b.name);
  });
};

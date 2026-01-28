import { StoreDto } from '@/types';

export const sortStoreList = (stores: StoreDto[]) => {
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

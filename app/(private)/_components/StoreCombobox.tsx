'use client';

import { useEffect, useMemo } from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { dummyStores } from '@/dummy/stores';
import { getActiveStoreList, sortStoreList } from '@/lib/utils';
import { StoreStore } from '@/store/storeStore';

const StoreCombobox = () => {
  /*
   * 초기 선택값은 아래 우선순위에 따라 자동 선택
   * 1순위 (컨텍스트): 이전 페이지(쇼핑몰 연동/대시보드)에서 특정 쇼핑몰의 '바로가기'를 눌러서 들어온 경우, 그 쇼핑몰이 선택됨(storeId prop으로 받기)
   * 2순위 (마지막 선택): 해당 브라우저 세션에서 사용자가 마지막으로 작업했던 쇼핑몰 유지  *
   * 3순위 (최신 등록): 위 조건이 없으면, 목록의 가장 첫 번째(최신 등록) 쇼핑몰 선택
   * 변경 시 해당 쇼핑몰의 상품 리스트로 갱신 */
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { setSelectedStore } = StoreStore.useActions();

  const activeStores = sortStoreList(getActiveStoreList(dummyStores));

  // 초기값 설정 로직 (우선순위: 마지막 선택 > 최신 등록)
  const initialStoreId = useMemo(() => {
    // 1순위: sessionStorage에 저장된 마지막 선택값
    if (selectedStoreId && activeStores.some((s) => s.id === selectedStoreId)) {
      return selectedStoreId;
    }

    // 2순위: 최신 등록 (정렬 목록의 첫 번째)
    return activeStores[0]?.id ?? null;
  }, [activeStores]);

  // initialStoreId가 변경되면 Zustand에도 반영
  useEffect(() => {
    if (!!initialStoreId && initialStoreId !== selectedStoreId) {
      setSelectedStore(initialStoreId);
    }
  }, [initialStoreId, selectedStoreId, setSelectedStore]);

  // Combobox의 onChange 핸들러 추가 필요
  const handleValueChange = (storeId: number | null) => {
    if (storeId !== null) {
      setSelectedStore(storeId);
    }
  };

  // 선택된 스토어의 name 가져오기
  const selectedStore = activeStores.find(
    (store) => store.id === selectedStoreId
  );
  const displayValue = selectedStore?.name ?? '';

  return (
    <Combobox
      items={activeStores}
      value={selectedStoreId}
      onValueChange={handleValueChange}
    >
      <ComboboxInput
        placeholder='쇼핑몰을 선택해 주세요.'
        value={displayValue}
        readOnly
      />
      <ComboboxContent>
        <ComboboxEmpty className='mt-3'>
          <p className='my-2'>연동된 쇼핑몰이 없습니다.</p>
        </ComboboxEmpty>
        <ComboboxGroup>
          <ComboboxList>
            {(store) => (
              <ComboboxItem key={store.id} value={store.id}>
                {store.name}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxGroup>
      </ComboboxContent>
    </Combobox>
  );
};

export default StoreCombobox;

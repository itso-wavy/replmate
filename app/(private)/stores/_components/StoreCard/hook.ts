import React, { useRef, useState } from 'react';

import { toast } from 'sonner';

import { ProgressSvgProps } from '@/assets/svg';
import { useUpdateStore } from '@/hooks/useStores';
import { PlatformType, type StoreDomain } from '@/types';

const getPlatformConfig = (platformType: PlatformType | null) => {
  switch (platformType) {
    case PlatformType.SMARTSTORE:
      return {
        name: '네이버 스마트스토어',
        platformStyle: 'text-smart-store-theme/90',
      };
    case PlatformType.BRANDSTORE:
      return {
        name: '네이버 브랜드스토어',
        platformStyle: 'text-brand-store-theme/90',
      };
    /*  case 'naver_smart_store':
      return {
        name: '네이버 스마트스토어',
        platformStyle:
          'bg-smart-store-theme/10 rounded-[4px] px-2 py-0.5 w-fit',
      };
    case 'naver_brand_store':
      return {
        name: '네이버 브랜드스토어',
        platformStyle:
          'bg-brand-store-theme/10 rounded-[4px] px-2 py-0.5 w-fit',
      }; */
    default:
      return {
        name: '',
        platformStyle: '',
        cardStyle: '',
      };
  }
};

const getConnectionStatus = (store: StoreDomain) => {
  let iconStatus: ProgressSvgProps['status'] | null = null;
  let statusLabel: string = '';
  let badgeStyle: string = '';
  switch (store.status) {
    case 'deactivating':
      iconStatus = 'active';
      statusLabel = '비활성화 예정';
      badgeStyle = 'border-brand-200 border-2 text-foreground bg-background';
      break;
    case 'pending':
      iconStatus = 'waiting';
      statusLabel = '승인 대기';
      badgeStyle = 'text-background bg-foreground [&_svg]:animate-spin';
      break;
    case 'rejected':
      iconStatus = 'inactive';
      statusLabel = '반려';
      badgeStyle = 'text-destructive bg-foreground';
      break;
    case 'inactive':
      iconStatus = 'inactive';
      statusLabel = '비활성';
      badgeStyle = 'bg-foreground text-background';
      break;
    default:
      iconStatus = 'active';
      statusLabel = '활성';
      badgeStyle = 'bg-brand-200 text-foreground';
  }

  const isActive = iconStatus === 'active';

  return {
    isActive,
    statusLabel,
    badgeStyle,
    iconStatus,
  };
};

export const useStoreCard = (store: StoreDomain) => {
  const [isNameEditMode, setIsNameEditMode] = useState(false);
  const [editValue, setEditValue] = useState(store.name);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updateStore, isPending: isLoading } = useUpdateStore();

  const config = getPlatformConfig(store.platformType);
  const connection = getConnectionStatus(store);

  // 입력 가능한 문자 검증: 한글, 영문, 숫자, 하이픈, 언더스코어, 괄호, 공백
  const isValidCharacter = (char: string) => {
    const validPattern = /^[가-힣ㄱ-ㅎㅏ-ㅣa-zA-Z0-9\s\-_()]*$/;
    return validPattern.test(char);
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 15 && isValidCharacter(newValue)) {
      setEditValue(newValue);
    }
  };

  const handleSaveName = async () => {
    const trimmedValue = editValue.trim();

    const isInvalid =
      trimmedValue.length < 2 ||
      trimmedValue.length > 15 ||
      !isValidCharacter(trimmedValue);
    if (isInvalid) {
      if (trimmedValue.length < 2) {
        toast.error('별칭은 2자 이상 입력해 주세요.');
      }
      if (trimmedValue.length > 15) {
        toast.error('최대 15자까지 입력 가능합니다.');
      }
      if (!isValidCharacter(trimmedValue)) {
        toast.error('허용되지 않은 문자가 포함되어 있습니다.');
      }

      setEditValue(store.name);
      setIsNameEditMode(false);
      return;
    }

    if (trimmedValue === store.name) {
      setIsNameEditMode(false);
      return;
    }

    if (isLoading) return;

    try {
      await updateStore({ storeId: store.id, data: { name: trimmedValue } });
      setIsNameEditMode(false);
      toast.success('별칭이 수정되었습니다.');
    } catch {
      // 실패 시 기존 값으로 복구
      setEditValue(store.name);
      setIsNameEditMode(false);
      toast.error('별칭 수정에 실패했습니다.');
    }
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    } else if (e.key === 'Escape') {
      setEditValue(store.name);
      setIsNameEditMode(false);
    }
  };

  return {
    // 상태
    isNameEditMode,
    editValue,
    isLoading,
    isUnlinkModalOpen,
    inputRef,

    // 핸들러
    handleNameInputChange,
    handleSaveName,
    handleNameKeyDown,
    setIsNameEditMode,
    setIsUnlinkModalOpen,

    // 계산된 값
    config,
    connection,
  };
};

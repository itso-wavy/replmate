import { useRef, useState } from 'react';

import { toast } from 'sonner';

import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { StoreDto } from '@/types';

const getPlatformConfig = (platform: string) => {
  switch (platform) {
    case 'naver_smart_store':
      return {
        name: '네이버 스마트스토어',
        textStyle: 'text-smart-store-theme',
      };
    case 'naver_brand_store':
      return {
        name: '네이버 브랜드스토어',
        textStyle: 'text-brand-store-theme',
      };
    default:
      return {
        name: '',
        textStyle: '',
      };
  }
};

const getConnectionStatus = (store: StoreDto) => {
  // TODO: 백엔드 스키마 확정 후 조건식 구체화 필요. 넷 중 하나의 조건만 가질 수 있음
  const isVerified = store.id === 2; // 활성
  const isWaiting = store.id === 3; // 인증 대기 중
  const isRejected = store.id === 4; // 인증 반려
  const isDeactivationScheduled = store.id === 5; // 비활성화 예정
  const isDeactivated = store.id === 1; // 비활성

  return {
    isVerified,
    isWaiting,
    isRejected,
    isDeactivationScheduled,
    isDeactivated,
  };
};

export const useStoreCard = (store: StoreDto) => {
  const [isNameEditMode, setIsNameEditMode] = useState(false);
  const [editValue, setEditValue] = useState(store.name);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const config = getPlatformConfig(store.platform);
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
      setIsLoading(true);
      await api.patch(ENDPOINTS.STORE.UPDATE_STORE_STATUS(store.id), {
        name: trimmedValue,
      });
      setIsNameEditMode(false);
      toast.success('별칭이 수정되었습니다.');
    } catch (error) {
      // 실패 시 기존 값으로 복구
      setEditValue(store.name);
      setIsNameEditMode(false);
      toast.error('별칭 수정에 실패했습니다.');
    } finally {
      setIsLoading(false);
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

  const statusBadges = [
    {
      condition: connection.isWaiting,
      label: '승인 대기',
      className: 'border-primary text-primary font-semibold',
    },
    {
      condition: connection.isVerified,
      label: '활성',
      className: 'text-background bg-primary font-medium',
    },
    {
      condition: connection.isRejected,
      label: '반려',
      className: 'bg-foreground text-orange-300 font-medium',
    },
    {
      condition: connection.isDeactivationScheduled,
      label: '비활성화 예정',
      className: 'border-destructive text-destructive font-medium',
    },
    {
      condition: connection.isDeactivated,
      label: '비활성',
      className: 'bg-foreground text-brand-100 font-medium',
    },
  ];
  const statusLabels = [
    {
      condition: connection.isWaiting,
      label: '승인 대기',
      className: 'text-primary font-semibold',
    },
    {
      condition: connection.isVerified,
      label: '활성',
      className: 'text-brand-500 font-medium',
    },
    {
      condition: connection.isRejected,
      label: '반려',
      className: 'text-foreground font-medium',
    },
    {
      condition: connection.isDeactivationScheduled,
      label: '비활성화 예정',
      className: 'border-destructive text-destructive font-medium',
    },
    {
      condition: connection.isDeactivated,
      label: '비활성',
      className: 'bg-foreground text-brand-100 font-medium',
    },
  ];

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
    statusBadges,
    statusLabels,
  };
};

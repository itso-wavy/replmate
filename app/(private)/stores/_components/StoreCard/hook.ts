import { useRef, useState } from 'react';

import { toast } from 'sonner';

import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import type { ActiveStatus, DetailStatus, StoreDto } from '@/types';

const getPlatformConfig = (platform: string) => {
  switch (platform) {
    case 'naver_smart_store':
      return {
        name: '네이버 스마트스토어',
        textStyle: 'text-smart-store-theme/90',
      };
    case 'naver_brand_store':
      return {
        name: '네이버 브랜드스토어',
        textStyle: 'text-brand-store-theme/90',
      };
    default:
      return {
        name: '',
        textStyle: '',
        cardStyle: '',
      };
  }
};

const getConnectionStatus = (store: StoreDto) => {
  // TODO: 백엔드 스키마 확정 후 조건식 구체화
  // 예시: store.status 값으로 판단

  // 임시: UI 테스트용: store.id를 시드로 사용하여 일관된 랜덤 상태 생성
  const statuses: DetailStatus[] = [
    'normal',
    'deactivation_pending',
    'approval_pending',
    'rejected',
    'deactivated',
  ];
  const detailStatus: DetailStatus = statuses[store.id % statuses.length];

  // 대분류는 세부 상태에서 파생
  const activeStatus: ActiveStatus =
    detailStatus === 'normal' || detailStatus === 'deactivation_pending'
      ? 'active'
      : 'inactive';

  // 링크 버튼 활성화 여부
  const isActive = activeStatus === 'active';

  // 강조 표시 여부 (반려, 비활성화 예정)
  const isHighlighted =
    detailStatus === 'rejected' || detailStatus === 'deactivation_pending';

  return {
    isActive,
    detailStatus, // 세부 상태
    isHighlighted, // 강조 표시 필요 여부
  };
};

type IconStatus = 'waiting' | 'inactive' | 'active' | 'half';

export const statusConfig: Record<
  DetailStatus,
  { label: string; iconStatus: IconStatus; isActive: boolean }
> = {
  normal: {
    label: '활성',
    iconStatus: 'active',
    isActive: true,
  },
  deactivation_pending: {
    label: '비활성화 예정',
    iconStatus: 'half',
    isActive: true,
  },
  approval_pending: {
    label: '승인 대기',
    iconStatus: 'waiting',
    isActive: false,
  },
  rejected: {
    label: '반려',
    iconStatus: 'inactive',
    isActive: false,
  },
  deactivated: {
    label: '비활성',
    iconStatus: 'inactive',
    isActive: false,
  },
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
    statusConfig,
  };
};

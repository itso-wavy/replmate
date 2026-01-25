'use client';

import Link from 'next/link';

import { useRef, useState } from 'react';

import {
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  SquarePen,
  Unlink,
} from 'lucide-react';
import { toast } from 'sonner';

import UnlinkStoreConfirmModal from '@/components/modal/UnlinkStoreConfirmModal';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api';
import { ENDPOINTS } from '@/lib/endpoints';
import { cn } from '@/lib/utils';
import { StoreDto } from '@/types';

const getPlatformConfig = (platform: string) => {
  switch (platform) {
    case 'naver_smart_store':
      return {
        name: '네이버 스마트스토어',
        // cardStyle: 'to-smart-store-theme/10',
        textStyle: 'text-smart-store-theme',
      };
    case 'naver_brand_store':
      return {
        name: '네이버 브랜드스토어',
        // cardStyle: 'to-brand-store-theme/10',
        textStyle: 'text-brand-store-theme',
      };
    default:
      return {
        name: '',
        //  cardStyle: '',
        textStyle: '',
      };
  }
};

const StoreCard = ({ store }: { store: StoreDto }) => {
  const [isNameEditMode, setIsNameEditMode] = useState(false);
  const [editValue, setEditValue] = useState(store.name);
  const [isLoading, setIsLoading] = useState(false);
  const [isUnlinkModalOpen, setIsUnlinkModalOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const config = getPlatformConfig(store.platform);

  // 입력 가능한 문자 검증: 한글, 영문, 숫자, 하이픈, 언더스코어, 괄호, 공백
  const isValidCharacter = (char: string) => {
    const validPattern = /^[a-zA-Z0-9가-힣\s\-_()]*$/;
    return validPattern.test(char);
  };

  const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 31 && isValidCharacter(newValue)) {
      setEditValue(newValue);
    }
  };

  const handleSaveName = async () => {
    const trimmedValue = editValue.trim();

    if (trimmedValue.length < 2) {
      toast.error('별칭은 2자 이상 입력해주세요.');
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
  const connection = getConnectionStatus(store);

  const statusBadges = [
    {
      condition: connection.isWaiting,
      label: '승인 대기',
      // className: 'typo-14 border-brand-11 text-brand-10 font-semibold',
      className: 'typo-14 border-primary text-primary font-semibold',
    },
    {
      condition: connection.isVerified,
      label: '활성',
      className: 'text-background bg-primary font-medium',
    },
    {
      condition: connection.isRejected,
      label: '반려',
      // className: 'bg-brand-11 text-foreground font-semibold',
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
      className: 'bg-foreground text-brand-3 font-medium',
    },
  ];

  return (
    <Card
      className={cn(
        'group/card from-warmgray-100/10 relative gap-0 bg-gradient-to-b hover:shadow-md',
        // config.cardStyle
        'to-gray-50'
      )}
    >
      <CardHeader className='flex items-start justify-between'>
        <div>
          <p className={cn('typo-eyebrow-12', config.textStyle)}>
            {config.name}
          </p>
          {/* <div className='typo-caption-12 text-muted-foreground mt-0.5 flex items-center gap-1'>
            <Clock className='size-3' />
            <span>2시간 전 연동됨</span>
          </div> */}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='hover:text-warmgray-600 text-warmgray-600 hover:bg-warmgray-900/5 inline-flex size-10 rotate-90 items-center justify-center rounded-full transition-all duration-200'>
              <MoreHorizontal className='size-5' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsUnlinkModalOpen(true)}>
                <Unlink className='text-warmgray-600 size-4' />
                <span>연동 해제</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className='my-1.5'>
        {isNameEditMode ? (
          <Input
            ref={inputRef}
            type='text'
            value={editValue}
            onChange={handleNameInputChange}
            onBlur={handleSaveName}
            onKeyDown={handleNameKeyDown}
            autoFocus
            maxLength={31}
            className='typo-heading-24! mb-px rounded-[8px] bg-transparent px-0 text-gray-900'
          />
        ) : (
          <button
            type='button'
            onClick={() => setIsNameEditMode(true)}
            className='relative mb-2 flex items-end py-1'
          >
            <div className='typo-heading-24 truncate text-gray-900'>
              {store.name}
            </div>

            <SquarePen className='text-ring relative bottom-1.5 left-1.5 hidden size-4 group-hover/card:block' />
          </button>
        )}
        <div className='mt-6 space-y-4'>
          <div>
            <span className='mb-1 block text-xs font-medium text-gray-400'>
              Store URL
            </span>
            <a
              href={store.url}
              target='_blank'
              rel='noreferrer'
              className='flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline'
            >
              <span className='truncate'>{store.url}</span>
              <ExternalLink className='h-3 w-3' />
            </a>
          </div>

          <div>
            <span className='mb-2 block text-xs font-medium text-gray-400'>
              Status
            </span>
            <div className='flex flex-wrap items-center gap-2'>
              {statusBadges.map(
                (badge) =>
                  badge.condition && (
                    <Badge
                      key={badge.label}
                      size='md'
                      className={badge.className}
                    >
                      {badge.label}
                    </Badge>
                  )
              )}
            </div>
            {connection.isRejected && (
              <p className='text-destructive typo-body-14 mt-3 leading-none font-medium'>
                * 삭제 후 다시 등록해 주세요.
              </p>
            )}
          </div>
        </div>
      </CardContent>

      {/* <Button
        variant='link'
        className='group hover:bg-background flex-1 gap-2 border border-transparent bg-gray-900 px-3.5 font-semibold transition-all duration-300 hover:flex-2 hover:border-gray-200 hover:text-gray-900'
      >
        상품 관리
        <ChevronRight className='h-4 w-4 text-gray-400 group-hover:ml-auto' />
      </Button> */}
      {/* Primary Action: Black */}
      {/* <button className='flex h-12 flex-2 items-center justify-center gap-2 rounded-2xl bg-gray-900 text-sm font-semibold text-white transition-colors hover:bg-black'/> */}
      {/* Secondary Action: Outline */}
      {/* <button className='flex h-12 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50'/> */}

      <CardFooter className='mt-auto flex gap-2'>
        <Link
          href={`/products?storeId=${store.id}`}
          className='typo-button-14 group border-border inline-flex h-11 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-4xl border bg-white px-3.5 font-semibold whitespace-nowrap text-gray-900 transition-all duration-300 hover:flex-2 hover:bg-gray-50'
        >
          상품 관리
          <ChevronRight className='h-4 w-4 text-gray-400 group-hover:ml-auto' />
        </Link>
        <Link
          href={`/options?storeId=${store.id}`}
          className='typo-button-14 group border-border inline-flex h-11 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-4xl border bg-white px-3.5 font-semibold whitespace-nowrap text-gray-900 transition-all duration-300 hover:flex-2 hover:bg-gray-50'
        >
          리플 옵션
          <ChevronRight className='h-4 w-4 text-gray-400 group-hover:ml-auto' />
        </Link>
        <Link
          href={`/replys?storeId=${store.id}`}
          className='typo-button-14 group border-border inline-flex h-11 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-4xl border bg-white px-3.5 font-semibold whitespace-nowrap text-gray-900 transition-all duration-300 hover:flex-2 hover:bg-gray-50'
        >
          리플 확인
          <ChevronRight className='h-4 w-4 text-gray-400 group-hover:ml-auto' />
        </Link>
      </CardFooter>

      <UnlinkStoreConfirmModal
        open={isUnlinkModalOpen}
        onOpenChange={setIsUnlinkModalOpen}
      />
    </Card>
  );
};

export default StoreCard;

'use client';

import { useRouter } from 'next/navigation';

import {
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  SquarePen,
  Unlink,
} from 'lucide-react';

import { ProgressSvg } from '@/assets/svg';
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
import { cn } from '@/lib/utils';
import { StoreStore } from '@/store/storeStore';
import { StoreDomain } from '@/types';

import { useStoreCard } from './hook';

interface ActionLinkButtonProps {
  href: string;
  storeId: number;
  disabled?: boolean;
  children: React.ReactNode;
}

const ActionLinkButton = ({
  href,
  storeId,
  disabled = false,
  children,
}: ActionLinkButtonProps) => {
  const router = useRouter();
  const { setSelectedStore } = StoreStore.useActions();

  const handleClick = () => {
    if (disabled) return;
    setSelectedStore(storeId);
    router.push(href);
  };

  {
    /* <Button
        variant='link'
        className='group hover:bg-background flex-1 gap-2 border border-transparent bg-gray-900 px-3.5 font-semibold transition-all duration-300 hover:flex-2 hover:border-gray-200 hover:text-gray-900'
      >
        상품 관리
        <ChevronRight className='h-4 w-4 text-gray-400 group-hover:ml-auto' />
      </Button> */
  }
  {
    /* Primary Action: Black */
  }
  {
    /* <button className='flex h-12 flex-2 items-center justify-center gap-2 rounded-2xl bg-gray-900 text-sm font-semibold text-white transition-colors hover:bg-black'/> */
  }
  {
    /* Secondary Action: Outline */
  }
  {
    /* <button className='flex h-12 flex-1 items-center justify-center rounded-2xl border border-gray-200 bg-white text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50'/> */
  }

  return (
    <button
      type='button'
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        'typo-link-14 group border-border text-foreground inline-flex h-11 flex-1 shrink-0 cursor-auto items-center justify-center gap-1.5 rounded-4xl border bg-gray-100 px-3.5 font-semibold whitespace-nowrap transition-all duration-300',
        !disabled && 'cursor-pointer bg-white hover:flex-2 hover:bg-gray-50'
      )}
    >
      {children}
      <ChevronRight
        className={cn(
          'h-4 w-4 text-gray-400',
          !disabled && 'group-hover:ml-auto'
        )}
      />
    </button>
  );
};

const StoreCard = ({ store }: { store: StoreDomain }) => {
  const {
    isNameEditMode,
    editValue,
    isUnlinkModalOpen,
    inputRef,
    handleNameInputChange,
    handleSaveName,
    handleNameKeyDown,
    setIsNameEditMode,
    setIsUnlinkModalOpen,
    config,
    connection,
  } = useStoreCard(store);

  // const activeBadge = statusBadges.find((badge) => badge.condition);

  return (
    <Card
      className={cn(
        'group/card from-background relative gap-0 bg-gradient-to-b to-gray-100 hover:shadow-md'
        // config.cardStyle
      )}
    >
      <CardHeader className='flex items-center justify-between'>
        <div className='flex flex-col'>
          {isNameEditMode ? (
            <Input
              ref={inputRef}
              type='text'
              value={editValue}
              onChange={handleNameInputChange}
              onBlur={handleSaveName}
              onKeyDown={handleNameKeyDown}
              autoFocus
              maxLength={15}
              className='typo-heading-24! text-foreground mb-px rounded-[8px] bg-transparent px-0'
            />
          ) : (
            <button
              type='button'
              onClick={() => setIsNameEditMode(true)}
              className='relative flex items-end py-1'
            >
              <div className='typo-heading-24 text-foreground truncate'>
                {store.name}
              </div>

              <SquarePen className='text-brand-500 relative bottom-1.5 left-1.5 hidden size-4 group-hover/card:block' />
            </button>
          )}

          {/* Store URL */}
          <div>
            <a
              href={store.url}
              target='_blank'
              rel='noreferrer'
              className='typo-link-14 text-foreground-description-muted flex items-center gap-1 underline-offset-4 hover:underline'
            >
              <span className='truncate'>{store.url}</span>
              <ExternalLink className='h-3 w-3' />
            </a>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <div className='inline-flex size-10 rotate-90 items-center justify-center rounded-full text-zinc-500 transition-all duration-200 hover:bg-zinc-900/5 hover:text-zinc-500'>
              <MoreHorizontal className='size-5' />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => setIsUnlinkModalOpen(true)}>
                <Unlink className='size-4 text-zinc-500' />
                <span>연동 해제</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className='my-1.5'>
        <div className='mt-6 space-y-4'>
          {/* Platform */}
          <div>
            <span className='typo-eyebrow-12 text-foreground-description-muted mb-1 block font-medium'>
              Platform
            </span>
            <p className={cn('typo-button-14', config.platformStyle)}>
              {config.name}
            </p>
            {/* <div className='typo-caption-12 text-muted-foreground mt-0.5 flex items-center gap-1'>
              <Clock className='size-3' />
              <span>2시간 전 연동됨</span>
            </div> */}
          </div>

          {/* Status */}
          <div>
            <span className='typo-eyebrow-12 text-foreground-description-muted mb-1 block font-medium'>
              Status
            </span>

            <div className='flex flex-wrap items-center'>
              <div className='flex items-center gap-2'>
                <Badge
                  size='md'
                  className={cn('mt-1 gap-1.5', connection.badgeStyle)}
                >
                  <ProgressSvg
                    status={connection.iconStatus}
                    className='size-3.5'
                  />
                  {connection.statusLabel}
                </Badge>

                {store.status === 'rejected' && (
                  <p className='text- typo-body-16 text-destructive mt-2 leading-none font-medium'>
                    * 연동 해제 후 다시 등록해 주세요.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className='mt-auto flex gap-2'>
        <ActionLinkButton
          href='/products'
          storeId={store.id}
          disabled={!connection.isActive}
        >
          상품 관리
        </ActionLinkButton>
        <ActionLinkButton
          href='/options'
          storeId={store.id}
          disabled={!connection.isActive}
        >
          리플 옵션
        </ActionLinkButton>
        <ActionLinkButton
          href='/replys'
          storeId={store.id}
          disabled={!connection.isActive}
        >
          리플 확인
        </ActionLinkButton>
      </CardFooter>

      <UnlinkStoreConfirmModal
        storeId={store.id}
        open={isUnlinkModalOpen}
        onOpenChange={setIsUnlinkModalOpen}
      />
    </Card>
  );
};

export default StoreCard;

'use client';

import Link from 'next/link';

import {
  ChevronRight,
  ExternalLink,
  MoreHorizontal,
  SquarePen,
  Unlink,
} from 'lucide-react';

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
import { StoreDto } from '@/types';

import { useStoreCard } from './hook';

interface ActionLinkButtonProps {
  href: string;
  children: React.ReactNode;
}

const ActionLinkButton = ({ href, children }: ActionLinkButtonProps) => {
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
    <Link
      href={href}
      className='typo-button-14 group border-border inline-flex h-11 flex-1 shrink-0 items-center justify-center gap-1.5 rounded-4xl border bg-white px-3.5 font-semibold whitespace-nowrap text-gray-900 transition-all duration-300 hover:flex-2 hover:bg-gray-50'
    >
      {children}
      <ChevronRight className='h-4 w-4 text-gray-400 group-hover:ml-auto' />
    </Link>
  );
};

const StoreCard = ({ store }: { store: StoreDto }) => {
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
    statusBadges,
  } = useStoreCard(store);

  return (
    <Card
      className={cn(
        'group/card from-warmgray-100/10 relative gap-0 bg-gradient-to-b hover:shadow-md',
        // config.cardStyle
        'to-gray-100'
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
            <div className='flex flex-wrap items-center'>
              {statusBadges.map(
                (badge) =>
                  badge.condition && (
                    <div className='flex items-center gap-2'>
                      <Badge
                        key={badge.label}
                        size='md'
                        className={badge.className}
                      >
                        {badge.label}
                      </Badge>

                      {connection.isRejected && (
                        <p className='text-destructive typo-body-14 leading-none font-medium'>
                          * 삭제 후 다시 등록해 주세요.
                        </p>
                      )}
                    </div>
                  )
              )}
            </div>
            {/* {connection.isRejected && (
              <p className='text-destructive typo-body-14 mt-3 leading-none font-medium'>
                * 삭제 후 다시 등록해 주세요.
              </p>
            )} */}
          </div>
        </div>
      </CardContent>

      <CardFooter className='mt-auto flex gap-2'>
        <ActionLinkButton href={`/products?storeId=${store.id}`}>
          상품 관리
        </ActionLinkButton>
        <ActionLinkButton href={`/options?storeId=${store.id}`}>
          리플 옵션
        </ActionLinkButton>
        <ActionLinkButton href={`/replys?storeId=${store.id}`}>
          리플 확인
        </ActionLinkButton>
      </CardFooter>

      <UnlinkStoreConfirmModal
        open={isUnlinkModalOpen}
        onOpenChange={setIsUnlinkModalOpen}
      />
    </Card>
  );
};

export default StoreCard;

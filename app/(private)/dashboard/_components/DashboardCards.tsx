'use client';

import { useRouter } from 'next/navigation';

import {
  CreditCard,
  ListChecks,
  MessageSquareHeart,
  MoveUpRight,
  Store,
} from 'lucide-react';

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from '@/components/ui/item';
import { Progress } from '@/components/ui/progress';
import { ROUTES } from '@/constants/nav-menu';
import { getActiveStoreList } from '@/lib/utils';
import type { StoreDomain, UsageQuotaSubscriptionDomain } from '@/types';

interface DashboardCardProps {
  isIdentifyed?: boolean;
  subscription: UsageQuotaSubscriptionDomain;
}

const DashboardPlanCard = ({
  isIdentifyed = false,
  subscription,
}: DashboardCardProps) => {
  const router = useRouter();
  const getDday = (updateDateTimestamp: string): number => {
    const today = new Date();
    const updateDate = new Date(updateDateTimestamp);
    const diff = Math.floor(
      (updateDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(diff, 0);
  };

  return (
    <Item
      variant='muted'
      onClick={() =>
        router.push(!isIdentifyed ? ROUTES.ACCOUNT : ROUTES.SUBSCRIBE)
      }
      className='group relative cursor-pointer p-6 transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-foreground-description'>
            <CreditCard size={14} />
          </div>
          <span className='typo-button-14! text-foreground-description font-medium!'>
            이용 중인 플랜
          </span>
        </ItemTitle>

        <ItemContent>
          <ItemDescription className='mt-6'>
            <span className='text-foreground typo-heading-24 font-medium'>
              {subscription.planName}
            </span>
            {!isIdentifyed && (
              <span className='typo-caption-14 text-foreground-description'>
                {' '}
                (본인 인증 필요)
              </span>
            )}
          </ItemDescription>

          <ItemFooter>
            <div className='text-foreground-description typo-caption-12 mt-2'>
              <span>다음 갱신일: </span>
              <span>
                {isIdentifyed
                  ? `${subscription.updatedAt.toISOString().split('T')[0]} (D-${getDday(subscription.updatedAt.toISOString())})`
                  : '-'}
              </span>
            </div>
          </ItemFooter>
        </ItemContent>
      </div>

      <div className='absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2 text-zinc-400 group-hover:bg-zinc-200/60'>
        <MoveUpRight className='duration-1000 group-hover:scale-110' />
      </div>
    </Item>
  );
};

const DashboardTodayCard = ({
  todayReplyCount,
}: {
  todayReplyCount: number;
}) => {
  const router = useRouter();

  return (
    <Item
      variant='muted'
      onClick={() => router.push(ROUTES.REPLYS)}
      className='group relative flex cursor-pointer transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-foreground-description'>
            <ListChecks size={14} />
          </div>
          <span className='text-foreground-description typo-button-14! font-medium!'>
            오늘의 작업
          </span>
        </ItemTitle>

        <ItemContent>
          <ItemDescription className='text-foreground mt-6'>
            <span className='typo-heading-24 font-medium'>
              {todayReplyCount}
            </span>
            <span className='typo-caption-14 font-medium'> 건</span>
          </ItemDescription>

          <ItemFooter>
            <div className='text-foreground-description typo-caption-12 mt-2'>
              {!todayReplyCount
                ? '작성된 리플이 없습니다.'
                : '작성된 리플을 확인해보세요!'}
            </div>
          </ItemFooter>
        </ItemContent>
      </div>
      <div className='absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2 text-zinc-400 group-hover:bg-zinc-200/60'>
        <MoveUpRight className='duration-1000 group-hover:scale-110' />
      </div>
    </Item>
  );
};

const DashboardReplyCard = ({ subscription }: DashboardCardProps) => {
  const router = useRouter();
  const { replyQuotaTotal, replyQuotaUsed } = subscription;
  const replyQuotaRest = replyQuotaTotal - replyQuotaUsed;

  return (
    <Item
      variant='muted'
      onClick={() => router.push(ROUTES.SUBSCRIBE)}
      className='group relative cursor-pointer transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-foreground-description'>
            <MessageSquareHeart size={14} />
          </div>
          <span className='text-foreground-description typo-button-14! font-medium!'>
            잔여 리플
          </span>
        </ItemTitle>

        <ItemContent className='w-full'>
          <ItemDescription className='text-foreground mt-6'>
            <span className='typo-heading-24 font-medium'>
              <span>{replyQuotaRest | 0}</span>
              <span className='mx-0.5 inline text-[16px]'>/</span>
              <span>{replyQuotaTotal | 0}</span>
            </span>
            <span className='typo-caption-14 font-medium'> 건</span>
          </ItemDescription>

          <ItemFooter>
            <Progress
              value={(replyQuotaRest / replyQuotaTotal) * 100}
              className='w-full'
              trackClassName='bg-gray-900/8'
              indicatorClassName='bg-primary'
            />
          </ItemFooter>
        </ItemContent>
      </div>

      <div className='absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2 text-zinc-400 group-hover:bg-zinc-200/60'>
        <MoveUpRight className='duration-1000 group-hover:scale-110' />
      </div>
    </Item>
  );
};

const DashboardStoresCard = ({ stores }: { stores: StoreDomain[] }) => {
  const router = useRouter();
  const activeStores = getActiveStoreList(stores);

  return (
    <Item
      variant='muted'
      onClick={() => router.push(ROUTES.STORES)}
      className='group relative cursor-pointer transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-foreground-description'>
            <Store size={14} />
          </div>
          <span className='text-foreground-description typo-button-14! font-medium!'>
            연동된 쇼핑몰
          </span>
        </ItemTitle>

        <ItemContent>
          <ItemDescription className='text-foreground mt-6'>
            <span className='typo-heading-24 font-medium'>
              {/* 연동된 쇼핑몰 → 쇼핑몰 연동 페이지 (쇼핑몰 수는 활성 쇼핑몰(ACTIVE_SHOPS) 합산( ‘활성/비활성화 예정’ 상태의 쇼핑몰)) */}
              {activeStores.length || 0}
            </span>
            <span className='typo-caption-14 font-medium'> 건</span>
          </ItemDescription>

          <ItemFooter>
            <div className='text-foreground-description typo-caption-12 mt-2'>
              {'현재 정상 연동 중입니다.'}
            </div>
          </ItemFooter>
        </ItemContent>
      </div>

      <div className='absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2 text-zinc-400 group-hover:bg-zinc-200/60'>
        <MoveUpRight className='duration-1000 group-hover:scale-110' />
      </div>
    </Item>
  );
};

export {
  DashboardPlanCard,
  DashboardTodayCard,
  DashboardReplyCard,
  DashboardStoresCard,
};

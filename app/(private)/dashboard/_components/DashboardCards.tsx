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
import { UsageQuotaSubscription } from '@/types';

interface DashboardCardProps {
  isIdentifyed?: boolean;
  subscription: UsageQuotaSubscription;
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
      onClick={() => router.push(!isIdentifyed ? '/account' : '/subscribe')}
      className='group relative cursor-pointer p-6 transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-warmgray-600 rounded-full'>
            <CreditCard size={14} />
          </div>
          <span className='text-muted-foreground typo-button-14! font-medium!'>
            이용 중인 플랜
          </span>
        </ItemTitle>

        <ItemContent>
          <ItemDescription className='mt-6'>
            <span className='text-foreground typo-heading-24 font-medium'>
              {subscription.planName}
            </span>
            {!isIdentifyed && (
              <span className='typo-caption-14 text-muted-foreground'>
                {' '}
                (본인 인증 필요)
              </span>
            )}
          </ItemDescription>

          <ItemFooter>
            <div className='text-muted-foreground typo-caption-12 mt-2'>
              <span>다음 갱신일: </span>
              <span>
                {isIdentifyed
                  ? `${subscription.updatedAt} (D-${getDday(subscription.updatedAt)})`
                  : '-'}
              </span>
            </div>
          </ItemFooter>
        </ItemContent>
      </div>

      <div className='group-hover:bg-warmgray-100/30 text-warmgray-400 absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2'>
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
      onClick={() => router.push('/replys')}
      className='group relative flex cursor-pointer transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-warmgray-600 rounded-full'>
            <ListChecks size={14} />
          </div>
          <span className='text-muted-foreground typo-button-14! font-medium!'>
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
            <div className='text-muted-foreground typo-caption-12 mt-2'>
              {!todayReplyCount
                ? '작성된 리플이 없습니다.'
                : '작성된 리플을 확인해보세요!'}
            </div>
          </ItemFooter>
        </ItemContent>
      </div>
      <div className='group-hover:bg-warmgray-100/30 text-warmgray-400 absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2'>
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
      onClick={() => router.push('/subscribe')}
      className='group relative cursor-pointer transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-warmgray-600 rounded-full'>
            <MessageSquareHeart size={14} />
          </div>
          <span className='text-muted-foreground typo-button-14! font-medium!'>
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
              trackClassName='bg-gray-900/5'
              indicatorClassName='bg-brand-10'
            />
          </ItemFooter>
        </ItemContent>
      </div>

      <div className='group-hover:bg-warmgray-100/30 text-warmgray-400 absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2'>
        <MoveUpRight className='duration-1000 group-hover:scale-110' />
      </div>
    </Item>
  );
};

const DashboardStoresCard = ({ subscription }: DashboardCardProps) => {
  const router = useRouter();

  return (
    <Item
      variant='muted'
      onClick={() => router.push('/subscribe')}
      className='group relative cursor-pointer transition-all duration-300 hover:scale-[102%]'
    >
      <div className='flex w-full flex-col justify-between'>
        <ItemTitle>
          <div className='text-warmgray-600 rounded-full'>
            <Store size={14} />
          </div>
          <span className='text-muted-foreground typo-button-14! font-medium!'>
            연동된 쇼핑몰
          </span>
        </ItemTitle>

        <ItemContent>
          <ItemDescription className='text-foreground mt-6'>
            <span className='typo-heading-24 font-medium'>
              {subscription.storeQuotaUsed}
            </span>
            <span className='typo-caption-14 font-medium'> 건</span>
          </ItemDescription>

          <ItemFooter>
            <div className='text-muted-foreground typo-caption-12 mt-2'>
              {'현재 정상 연동 중입니다.'}
            </div>
          </ItemFooter>
        </ItemContent>
      </div>

      <div className='group-hover:bg-warmgray-100/30 text-warmgray-400 absolute top-3.5 right-3.5 mb-auto ml-auto rotate-6 rounded-full p-2'>
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

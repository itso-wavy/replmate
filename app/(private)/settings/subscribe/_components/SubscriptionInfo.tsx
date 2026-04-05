'use client';
import { useRouter } from 'next/navigation';

import { CheckCircle2, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/nav-menu';
import { formatDate } from '@/lib/utils';
import { SubscriptionStatus, type UserPlanDomain } from '@/types';

// 결제 수단 더미 (실제 API 미제공)
const DUMMY_PAYMENT = { last4: '1234', brand: 'KB 국민카드' };

interface SubscriptionInfoProps {
  userPlan: UserPlanDomain;
  isVerified: boolean;
  onPlanChange: () => void;
  onPaymentChange: () => void;
  onReactivate: () => void;
}

const UnverifiedInfo = () => {
  const router = useRouter();
  return (
    <div className='bg-muted/50 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center'>
      <p className='typo-body-14 text-muted-foreground mb-3'>
        본인인증 후 평생 무료 플랜을 이용해 보세요!
      </p>
      <Button onClick={() => router.push(ROUTES.ACCOUNT)} variant='outline'>
        본인인증하러 가기
      </Button>
    </div>
  );
};

const PendingCancelInfo = ({
  userPlan,
  onReactivate,
  onPlanChange,
}: Pick<
  SubscriptionInfoProps,
  'userPlan' | 'onReactivate' | 'onPlanChange'
>) => (
  <div className='rounded-xl border border-amber-200 bg-amber-50 p-5'>
    <div className='mb-2 flex items-center gap-2'>
      <Clock size={16} className='text-amber-500' />
      <span className='typo-body-14 font-semibold text-amber-700'>
        {userPlan.plan.title} 해지 예약됨
      </span>
    </div>
    <p className='typo-body-14 mb-1 text-amber-600'>
      바로 이후로 무료 플랜으로 전환됩니다.
    </p>
    <p className='typo-caption-12 text-muted-foreground mb-5'>
      해지 예정일:{' '}
      {formatDate(userPlan.subscription.currentPeriodEnd, 'yyyy년 M월 d일')}
    </p>
    <div className='flex gap-2'>
      <Button onClick={onReactivate} variant='outline' className='flex-1'>
        해지 취소
      </Button>
      <Button onClick={onPlanChange} variant='outline' className='flex-1'>
        플랜 변경하기
      </Button>
    </div>
  </div>
);

const FreeInfo = ({
  userPlan,
  onPlanChange,
}: Pick<SubscriptionInfoProps, 'userPlan' | 'onPlanChange'>) => (
  <div className='rounded-xl border border-emerald-200 bg-emerald-50 p-5'>
    <div className='mb-4 flex items-center gap-2'>
      <CheckCircle2 size={16} className='text-emerald-500' />
      <span className='typo-body-14 font-semibold text-emerald-700'>
        FREE 플랜 이용 중
      </span>
      <span className='typo-caption-12 text-muted-foreground'>월 0원</span>
    </div>
    <div className='typo-body-14 text-muted-foreground mb-5 flex items-center gap-1.5'>
      <span>다음 갱신일</span>
      <span className='text-foreground font-medium'>
        {formatDate(userPlan.subscription.currentPeriodEnd, 'yyyy년 M월 d일')}
      </span>
    </div>
    <Button onClick={onPlanChange} className='w-full'>
      플랜 구독하기
    </Button>
  </div>
);

const ActiveInfo = ({
  userPlan,
  onPlanChange,
  onPaymentChange,
}: Pick<
  SubscriptionInfoProps,
  'userPlan' | 'onPlanChange' | 'onPaymentChange'
>) => (
  <div className='rounded-xl border border-emerald-200 bg-emerald-50 p-5'>
    <div className='mb-4 flex items-center gap-2'>
      <CheckCircle2 size={16} className='text-emerald-500' />
      <span className='typo-body-14 font-semibold text-emerald-700'>
        {userPlan.plan.title} 이용 중
      </span>
      <span className='typo-caption-12 text-muted-foreground'>
        월 {userPlan.plan.monthlyPrice.toLocaleString()}원
      </span>
    </div>
    <div className='mb-5 flex flex-wrap gap-x-6 gap-y-2'>
      <div className='typo-body-14 text-muted-foreground flex items-center gap-1.5'>
        <span>다음 갱신일</span>
        <span className='text-foreground font-medium'>
          {formatDate(userPlan.subscription.currentPeriodEnd, 'yyyy년 M월 d일')}
        </span>
      </div>
      <div className='typo-body-14 text-muted-foreground flex items-center gap-1.5'>
        <span>결제 수단</span>
        <span className='text-foreground font-medium'>
          **** {DUMMY_PAYMENT.last4} ({DUMMY_PAYMENT.brand})
        </span>
      </div>
    </div>
    <div className='flex gap-2'>
      <Button onClick={onPlanChange} variant='outline' className='flex-1'>
        플랜 변경하기
      </Button>
      <Button onClick={onPaymentChange} variant='outline' className='flex-1'>
        결제 정보 변경
      </Button>
    </div>
  </div>
);

const SubscriptionInfo = ({
  userPlan,
  isVerified,
  onPlanChange,
  onPaymentChange,
  onReactivate,
}: SubscriptionInfoProps) => {
  const isFree = userPlan.planStatus === SubscriptionStatus.FREE;
  const isPendingCancel = userPlan.subscription.cancelAtPeriodEnd;

  if (!isVerified) return <UnverifiedInfo />;
  if (isPendingCancel)
    return (
      <PendingCancelInfo
        userPlan={userPlan}
        onReactivate={onReactivate}
        onPlanChange={onPlanChange}
      />
    );
  if (isFree)
    return <FreeInfo userPlan={userPlan} onPlanChange={onPlanChange} />;
  return (
    <ActiveInfo
      userPlan={userPlan}
      onPlanChange={onPlanChange}
      onPaymentChange={onPaymentChange}
    />
  );
};

export default SubscriptionInfo;

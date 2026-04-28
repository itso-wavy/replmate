'use client';

import { useRouter } from 'next/navigation';

import {
  Calendar,
  CircleDollarSign,
  Info,
  Leaf,
  PiggyBank,
} from 'lucide-react';

import { InnerPageRow } from '@/app/(private)/settings/_components';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/nav-menu';
import { formatDate } from '@/lib/utils';
import { SubscriptionStatus, type UserPlanDomain } from '@/types';

interface SubscriptionInfoProps {
  userPlan: UserPlanDomain;
  onPaymentChange: () => void;
  onReactivate: () => void;
  onCancelPlan: () => void;
  onCancelDowngrade: () => void;
}
interface UnverifiedInfoProps {
  goToAccount: () => void;
}
// ─────────────────────────────────────────────
// 미인증 — dashed card
// ─────────────────────────────────────────────
const UnverifiedInfo = ({ goToAccount }: UnverifiedInfoProps) => {
  return (
    <div className='bg-muted/50 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center'>
      <p className='typo-body-16 text-muted-foreground mb-3'>
        본인인증 후 평생 무료 플랜을 이용해 보세요!
      </p>
      <Button onClick={goToAccount}>본인인증하러 가기</Button>
    </div>
  );
};

// ─────────────────────────────────────────────
// 메인 컴포넌트
// ─────────────────────────────────────────────
const SubscriptionInfo = ({
  userPlan,
  onPaymentChange,
  onReactivate,
  onCancelPlan,
  onCancelDowngrade,
}: SubscriptionInfoProps) => {
  const router = useRouter();

  const { planStatus, plan, subscription, downgrade } = userPlan;

  const isUnverified = planStatus === SubscriptionStatus.UNVERIFIED;
  const isFree = planStatus === SubscriptionStatus.FREE;
  const isPaid = !isFree;
  const isActive = planStatus === SubscriptionStatus.PAID_ACTIVE;
  const isCancelScheduled =
    planStatus === SubscriptionStatus.PAID_CANCEL_SCHEDULED;
  const isDowngradeScheduled =
    planStatus === SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED;

  // const nextRenewalDate = new Date(
  //   subscription.currentPeriodEnd.getTime() + 86400 * 1000
  // );

  const goToAccountPage = () => router.push(ROUTES.ACCOUNT);
  const goToPlansPage = () => router.push(ROUTES.PLANS);

  if (isUnverified) return <UnverifiedInfo goToAccount={goToAccountPage} />;

  return (
    <div className='-mt-2 space-y-2'>
      {/* status 안내 문구 */}
      {isCancelScheduled && (
        <Alert className='border-brand-100 bg-gray-50'>
          <Info />
          해지 예정일까지는 현재 플랜 이용이 가능합니다. 이후 자동으로 무료
          플랜으로 전환됩니다.
        </Alert>
      )}
      {isDowngradeScheduled && (
        <Alert className='border-brand-100 bg-gray-50'>
          <Info />
          다음 결제일까지는 현재 플랜 이용이 가능합니다.
        </Alert>
      )}

      <div className='flex items-center justify-between'>
        {/* 구독 플랜 헤더 */}
        <InnerPageRow
          label={
            <div className='flex items-center'>
              <Leaf size={13} />
              <span className='ml-1'>구독 플랜</span>
            </div>
          }
          className='*:first:text-muted-foreground mx-3 items-center'
        >
          <p className='typo-heading-18 font-medium'>
            {plan.name} 플랜 이용 중
          </p>
        </InnerPageRow>

        <div className='flex shrink-0 items-center gap-2'>
          {/* 액션 버튼 */}
          {isFree && (
            <Button
              onClick={goToPlansPage}
              variant='ghost'
              className='min-w-[80px] shrink-0 border border-violet-300/40 bg-gradient-to-br from-blue-400 to-purple-300/80 px-4 text-white transition-colors hover:from-blue-300/95 hover:to-purple-300/70 hover:text-white'
            >
              플랜 구독하기
            </Button>
          )}
          {isActive && (
            <>
              <Button
                onClick={goToPlansPage}
                variant='outline'
                className='bg-input/30 text-brand-500 hover:text-brand-500/80 min-w-[80px] shrink-0 px-4'
              >
                플랜 변경하기
              </Button>
              <Button
                onClick={onPaymentChange}
                variant='outline'
                className='bg-input/30 min-w-[80px] px-4'
              >
                결제 정보 변경
              </Button>
              <Button
                onClick={onCancelPlan}
                variant='link'
                className='text-foreground-description-muted hover:text-foreground-description -ml-1 underline underline-offset-[6px]'
              >
                구독 해지
              </Button>
            </>
          )}
          {isCancelScheduled && (
            <>
              <Button
                onClick={onReactivate}
                variant='ghost'
                className='min-w-[80px] shrink-0 border border-violet-300/40 bg-gradient-to-br from-blue-400/90 to-purple-300/80 px-4 text-white transition-colors hover:from-blue-300/95 hover:to-purple-300/70 hover:text-white'
              >
                해지 취소
              </Button>
              <Button
                onClick={goToPlansPage}
                variant='outline'
                className='bg-input/30 min-w-[80px] px-4'
              >
                플랜 변경하기
              </Button>
            </>
          )}
          {isDowngradeScheduled && (
            <>
              <Button
                onClick={onCancelDowngrade}
                variant='ghost'
                className='min-w-[80px] shrink-0 border border-violet-300/40 bg-gradient-to-br from-blue-400/90 to-purple-300/80 px-4 text-white transition-colors hover:from-blue-300/95 hover:to-purple-300/70 hover:text-white'
              >
                예약 취소
              </Button>
              <Button
                onClick={onPaymentChange}
                variant='outline'
                className='bg-input/30 min-w-[80px] px-4'
              >
                결제 정보 변경
              </Button>
              <Button
                onClick={onCancelPlan}
                variant='link'
                className='text-foreground-description-muted hover:text-foreground-description -ml-1 underline underline-offset-[6px]'
              >
                구독 해지
              </Button>
            </>
          )}
        </div>
      </div>

      {/* 정보 박스 */}
      <div className='rounded-xl border px-4 py-3.5'>
        <div className='space-y-2.5'>
          <InnerPageRow
            label={
              <div className='flex items-center'>
                <CircleDollarSign size={13} />
                <span className='ml-1'>월 금액</span>
              </div>
            }
            className='*:first:text-muted-foreground'
          >
            {plan.monthlyPrice.toLocaleString()}원
          </InnerPageRow>

          <InnerPageRow
            label={
              <div className='flex items-center'>
                <Calendar size={13} />
                <span className='ml-1'>
                  {!isCancelScheduled ? '다음 갱신일' : '해지 예정일'}
                </span>
              </div>
            }
            className='*:first:text-muted-foreground'
          >
            {formatDate(
              subscription.currentPeriodEnd,
              // isCancelScheduled
              //   ? subscription.currentPeriodEnd
              //   : nextRenewalDate,
              'yyyy년 M월 d일'
            ) ?? '-'}
          </InnerPageRow>

          {isPaid && (
            <InnerPageRow
              label={
                <div className='flex items-center'>
                  <PiggyBank size={13} />
                  <span className='ml-1'>결제 수단</span>
                </div>
              }
              className='*:first:text-muted-foreground'
            >
              {/* FIXME: 결제 수단 실데이터 연동 필요:
               **** {plan.paymentMethod.last4} ({plan.paymentMethod.brand}) */}
              {'-'}
            </InnerPageRow>
          )}
        </div>

        {/* 플랜 비교 블록 (DOWNGRADE_SCHEDULED만) */}
        {isDowngradeScheduled && downgrade && (
          <div className='mt-4 flex gap-3 border-t pt-4'>
            <div className='bg-brand-700/5 flex-1 rounded-xl p-4'>
              <p className='typo-caption-12 text-muted-foreground'>현재 플랜</p>
              <p className='typo-heading-18 mt-1 font-medium'>
                {plan.title ?? plan.name}
              </p>
              <p className='typo-body-14 text-foreground-description mt-0.5'>
                월 {plan.monthlyPrice.toLocaleString()}원
              </p>
              <p className='typo-caption-12 text-muted-foreground mt-3'>
                {formatDate(subscription.currentPeriodEnd, 'yyyy년 M월 d일')}
                까지 이용 가능
              </p>
            </div>
            <div className='bg-muted/50 flex-1 rounded-xl p-4'>
              <p className='typo-caption-12 text-muted-foreground'>다음 플랜</p>
              <p className='typo-heading-18 mt-1 font-medium'>
                {downgrade.plan.title ?? downgrade.plan.name}
              </p>
              <p className='typo-body-14 text-foreground-description mt-0.5'>
                월 {downgrade.plan.monthlyPrice.toLocaleString()}원
              </p>
              <p className='typo-caption-12 text-muted-foreground mt-3'>
                {formatDate(downgrade.effectiveDate, 'yyyy년 M월 d일')}부터 자동
                적용
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscriptionInfo;

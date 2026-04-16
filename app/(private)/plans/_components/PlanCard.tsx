'use client';

import { CheckIcon } from '@phosphor-icons/react/dist/ssr';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { PlanDomain } from '@/types';
import { SubscriptionStatus } from '@/types/enums';

// FIXME: 플랜 도메인 필드로 기능 목록 생성=> 백엔드에서 제공하는 목록으로 교체해야 함
const getDummyPlanFeatures = (plan: PlanDomain): string[] => {
  const features = [
    `월 ${plan.monthlyReplyQuota.toLocaleString()}건 답글 생성`,
    `상품 ${plan.maxProductPerStore.toLocaleString()}개 집중 관리`,
    `쇼핑몰 ${plan.maxStoreCount}개 연동`,
    '문맥 파악 AI 엔진',
    '브랜드 톤앤매너 설정',
  ];
  if (plan.maxStoreCount >= 2) features.splice(4, 0, '다중 몰 관리');
  return features;
};

interface PlanCardProps {
  plan: PlanDomain;
  currentPlanId: number;
  currentPlanPrice: number;
  currentPlanStatus: SubscriptionStatus;
  onSelect: (plan: PlanDomain) => void;
}

const PlanCard = ({
  plan,
  currentPlanId,
  currentPlanPrice,
  currentPlanStatus,
  onSelect,
}: PlanCardProps) => {
  // 파생 변수
  const isUserFree = currentPlanStatus === SubscriptionStatus.FREE;
  const isCancelScheduled =
    currentPlanStatus === SubscriptionStatus.PAID_CANCEL_SCHEDULED;
  const isCurrentPlan = plan.id === currentPlanId;
  const isFreePlan = plan.monthlyPrice === 0;
  const isUpgradePlan = plan.monthlyPrice > currentPlanPrice;
  const isHighlighted = isCurrentPlan && !isUserFree; // 카드 강조 여부 (현재 플랜 또는 추천 플랜)

  // ─── 버튼 렌더링 (mt 대신 subgrid gap이 적용됨) ───────
  const renderButton = () => {
    if (isCancelScheduled) {
      return (
        <Button onClick={() => onSelect(plan)}>이 플랜으로 계속하기</Button>
      );
    }

    if (isCurrentPlan) {
      return (
        <Button disabled className='pointer-events-none'>
          현재 플랜
        </Button>
      );
    }

    if (isUpgradePlan) {
      return <Button onClick={() => onSelect(plan)}>업그레이드하기</Button>;
    }

    return (
      <Button variant='outline' onClick={() => onSelect(plan)}>
        전환하기
      </Button>
    );
  };

  return (
    <div
      className={cn(
        // 공통
        'relative flex flex-col gap-4 rounded-2xl border bg-white p-6 transition-shadow',
        // md: 부모 그리드의 row track 상속 (subgrid)
        'md:row-span-5 md:grid md:grid-rows-subgrid',
        isHighlighted
          ? 'border-brand-500 ring-brand-500/20 shadow-lg ring-2'
          : 'hover:border-muted-foreground/30 hover:shadow-sm'
      )}
    >
      {/* 현재 플랜 뱃지 (absolute — grid flow 영향 없음) */}
      {isHighlighted && (
        <span className='bg-brand-500 absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap text-white'>
          현재 플랜
        </span>
      )}

      {/* Row 1: 플랜명 */}
      <p className='typo-heading-24 self-start'>{plan.name.toUpperCase()}</p>

      {/* Row 2: 설명 (없을 경우 빈 영역 유지로 정렬 보장) */}
      <p className='typo-body-14 text-muted-foreground -mt-2 self-start'>
        {plan.title ?? '\u00A0'}
      </p>

      {/* Row 3: 가격 */}
      <div className='flex items-baseline gap-1 self-end'>
        {isFreePlan ? (
          <span className='typo-heading-28 font-bold'>평생 무료</span>
        ) : (
          <>
            <span className='typo-heading-28 font-bold'>
              {plan.monthlyPrice.toLocaleString()}
            </span>
            <span className='typo-body-14 text-muted-foreground'>
              원/월 (VAT 포함)
            </span>
          </>
        )}
      </div>

      {/* Row 4: CTA 버튼 */}
      <div className='*:w-full'>{renderButton()}</div>

      {/* Row 5: 기능 목록 */}
      <ul className='space-y-2.5 self-start'>
        {getDummyPlanFeatures(plan).map((feature) => (
          <li key={feature} className='flex items-start gap-2.5'>
            <span className='bg-brand-500/10 mt-0.5 flex shrink-0 rounded-full p-1'>
              <CheckIcon size={10} className='text-brand-500' />
            </span>
            <span className='typo-body-14 text-foreground'>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlanCard;

'use client';

import { ArrowRight, CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatDate } from '@/lib/utils';
import type { PlanDomain } from '@/types';

import ReactivatePlanModal from './ReactivatePlanModal';

// ─── 모달 상태 타입 ───────────────────────────────────────
export type PlanModalState =
  | 'reactivate'
  | 'subscribe'
  | 'upgrade'
  | 'downgrade'
  | 'downgradeSuccess';

// ─── 공통 서브 컴포넌트 ───────────────────────────────────
const InfoRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className='typo-body-14 flex items-center justify-between'>
    <span className='text-muted-foreground'>{label}</span>
    <span className='font-medium'>{children}</span>
  </div>
);

const PlanChangeRow = ({ from, to }: { from: PlanDomain; to: PlanDomain }) => (
  <div className='flex items-center gap-3'>
    <div className='bg-muted/50 flex-1 rounded-xl p-4 text-center'>
      <p className='typo-caption-12 text-muted-foreground mb-1'>현재 플랜</p>
      <p className='typo-heading-16'>{from.name.toUpperCase()}</p>
      <p className='typo-body-14 text-muted-foreground'>
        월 {from.monthlyPrice.toLocaleString()}원
      </p>
    </div>
    <ArrowRight size={18} className='text-muted-foreground shrink-0' />
    <div className='bg-brand-500/8 border-brand-500/20 flex-1 rounded-xl border p-4 text-center'>
      <p className='typo-caption-12 text-muted-foreground mb-1'>변경 플랜</p>
      <p className='typo-heading-16'>{to.name.toUpperCase()}</p>
      <p className='typo-body-14 text-muted-foreground'>
        월 {to.monthlyPrice.toLocaleString()}원
      </p>
    </div>
  </div>
);

const SinglePlanCard = ({ plan }: { plan: PlanDomain }) => (
  <div className='bg-brand-500/5 border-brand-500/10 rounded-xl border p-4 text-center'>
    <p className='typo-caption-12 text-muted-foreground mb-1'>변경 플랜</p>
    <p className='typo-heading-16'>{plan.name.toUpperCase()}</p>
    <p className='typo-body-14 text-muted-foreground'>
      월 {plan.monthlyPrice.toLocaleString()}원
    </p>
  </div>
);

const PaymentAmountBox = ({
  amount,
  caption,
}: {
  amount: number;
  caption?: string;
}) => (
  <div className='rounded-xl border p-4'>
    <div className='flex items-baseline justify-between'>
      <span className='typo-body-14'>결제 금액</span>
      <span className='typo-heading-18 font-bold'>
        {amount.toLocaleString()}원
      </span>
    </div>
    {caption && (
      <p className='typo-caption-12 text-muted-foreground mt-1'>{caption}</p>
    )}
  </div>
);

const InstantAvailableBox = ({ quota }: { quota: number }) => (
  <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
    <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
    <div>
      <p className='typo-body-14 font-medium'>즉시 사용 가능</p>
      <p className='typo-caption-12 text-muted-foreground'>
        업그레이드 시 {quota.toLocaleString()}건이 바로 제공됩니다
      </p>
    </div>
  </div>
);

const NextBillingNoticeBox = () => (
  <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
    <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
    <div>
      <p className='typo-body-14 font-medium'>다음 결제일 적용</p>
      <p className='typo-caption-12 text-muted-foreground'>
        이전까지 현재 플랜을 계속해서 이용하실 수 있습니다
      </p>
    </div>
  </div>
);

const NextBillingInfoBox = ({ plan }: { plan: PlanDomain }) => (
  <div className='bg-muted/40 space-y-2 rounded-xl p-4'>
    <p className='typo-caption-12 font-medium'>다음 결제 안내</p>
    {/* TODO: 결제일은 API 연동 후 표시 */}
    <InfoRow label='결제일'>{formatDate(new Date(), 'yyyy년 M월 d일')}</InfoRow>
    <InfoRow label='결제 금액'>{plan.monthlyPrice.toLocaleString()}원</InfoRow>
    <InfoRow label='리플 제공 한도'>
      {plan.monthlyReplyQuota.toLocaleString()}건 (전체)
    </InfoRow>
  </div>
);

// ─── 모달 콘텐츠 컴포넌트 ─────────────────────────────────
interface ConfirmProps {
  plan: PlanDomain;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

interface ChangeConfirmProps extends ConfirmProps {
  currentPlan: PlanDomain;
}

const SubscribeConfirm = ({ plan, onConfirm, isPending }: ConfirmProps) => (
  <>
    <DialogHeader>
      <DialogTitle className='typo-heading-20!'>
        {plan.name.toUpperCase()} 플랜 구독
      </DialogTitle>
    </DialogHeader>
    <div className='space-y-3'>
      <SinglePlanCard plan={plan} />
      <PaymentAmountBox amount={plan.monthlyPrice} />
      <InstantAvailableBox quota={plan.monthlyReplyQuota} />
      <NextBillingInfoBox plan={plan} />
    </div>
    <DialogFooter>
      <Button onClick={onConfirm} isPending={isPending} className='w-full'>
        구독하기
      </Button>
    </DialogFooter>
  </>
);

const UpgradeConfirm = ({
  currentPlan,
  plan,
  onConfirm,
  isPending,
}: ChangeConfirmProps) => {
  // TODO: 차액은 API 응답값으로 교체
  const diff = plan.monthlyPrice - currentPlan.monthlyPrice;

  return (
    <>
      <DialogHeader>
        <DialogTitle className='typo-heading-20!'>
          {plan.name.toUpperCase()} 플랜으로 업그레이드
        </DialogTitle>
      </DialogHeader>
      <div className='space-y-3'>
        <PlanChangeRow from={currentPlan} to={plan} />
        <PaymentAmountBox
          amount={diff}
          caption='※ 남은 기간에 대한 일할 계산 차액만 결제됩니다'
        />
        <InstantAvailableBox quota={plan.monthlyReplyQuota} />
        <NextBillingInfoBox plan={plan} />
      </div>
      <DialogFooter>
        <Button onClick={onConfirm} isPending={isPending} className='w-full'>
          업그레이드하기
        </Button>
      </DialogFooter>
    </>
  );
};

const DowngradeConfirm = ({
  currentPlan,
  plan,
  onConfirm,
  isPending,
}: ChangeConfirmProps) => (
  <>
    <DialogHeader>
      <DialogTitle className='typo-heading-20!'>
        {plan.name.toUpperCase()} 플랜으로 변경
      </DialogTitle>
    </DialogHeader>
    <div className='space-y-3'>
      <PlanChangeRow from={currentPlan} to={plan} />
      <NextBillingNoticeBox />
      <NextBillingInfoBox plan={plan} />
    </div>
    <DialogFooter>
      <Button onClick={onConfirm} isPending={isPending} className='w-full'>
        변경 예약하기
      </Button>
    </DialogFooter>
  </>
);

const DowngradeSuccess = ({
  plan,
  onClose,
}: {
  plan: PlanDomain;
  onClose: () => void;
}) => (
  <>
    <div className='flex flex-col items-center gap-3 py-4 text-center'>
      <div className='bg-brand-500/10 flex size-16 items-center justify-center rounded-full'>
        <CheckCircle size={32} className='text-brand-500' />
      </div>
      <div>
        <p className='typo-heading-20 font-bold'>변경 예약 완료!</p>
        <p className='typo-body-14 text-muted-foreground mt-1'>
          다음 결제일까지는 현재 플랜 이용 가능합니다
        </p>
      </div>
    </div>
    <div className='bg-muted/40 space-y-1.5 rounded-xl p-4'>
      {/* TODO: 결제일 / 결제 금액은 API 연동 후 표시 */}
      <InfoRow label='다음 결제일'>—</InfoRow>
      <InfoRow label='다음 결제 금액'>
        {plan.monthlyPrice.toLocaleString()}원
      </InfoRow>
    </div>
    <Button className='w-full' onClick={onClose}>
      확인
    </Button>
  </>
);

// ─── 라우터 컴포넌트 ──────────────────────────────────────
interface PlanChangeModalsProps {
  state: PlanModalState;
  selectedPlan: PlanDomain;
  currentPlan: PlanDomain;
  periodEnd: Date | undefined;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  onReactivate: () => void | Promise<void>;
  isConfirmPending?: boolean;
  isReactivatePending?: boolean;
}

const PlanChangeModals = ({
  state,
  selectedPlan,
  currentPlan,
  periodEnd,
  onClose,
  onConfirm,
  onReactivate,
  isConfirmPending,
  isReactivatePending,
}: PlanChangeModalsProps) => {
  const onDialogOpenChange = (open: boolean) => !open && onClose();

  if (state === 'reactivate') {
    if (!periodEnd) return null;
    return (
      <ReactivatePlanModal
        open
        onOpenChange={(open) => !open && onClose()}
        periodEnd={periodEnd}
        onConfirm={onReactivate}
        isPending={isReactivatePending}
      />
    );
  }

  const renderBody = () => {
    switch (state) {
      case 'subscribe':
        return (
          <SubscribeConfirm
            plan={selectedPlan}
            onConfirm={onConfirm}
            isPending={isConfirmPending}
          />
        );
      case 'upgrade':
        return (
          <UpgradeConfirm
            currentPlan={currentPlan}
            plan={selectedPlan}
            onConfirm={onConfirm}
            isPending={isConfirmPending}
          />
        );
      case 'downgrade':
        return (
          <DowngradeConfirm
            currentPlan={currentPlan}
            plan={selectedPlan}
            onConfirm={onConfirm}
            isPending={isConfirmPending}
          />
        );
      case 'downgradeSuccess':
        return <DowngradeSuccess plan={selectedPlan} onClose={onClose} />;
    }
  };

  return (
    <Dialog open onOpenChange={onDialogOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>{renderBody()}</DialogContent>
    </Dialog>
  );
};

export default PlanChangeModals;

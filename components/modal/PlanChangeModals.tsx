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
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/lib/utils';
import type { PlanDomain } from '@/types';
import type { ChangePlanPreviewDomain } from '@/types/domain/user';

// ─── 모달 상태 타입 ───────────────────────────────────────
export type PlanModalState =
  | 'keepSubscription'
  | 'subscribe'
  | 'upgrade'
  | 'downgrade'
  | 'upgradeSuccess'
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
      <p className='typo-heading-16'>{from.name}</p>
      <p className='typo-body-14 text-muted-foreground'>
        월 {from.monthlyPrice.toLocaleString()}원
      </p>
    </div>
    <ArrowRight size={18} className='text-muted-foreground shrink-0' />
    <div className='bg-brand-500/8 border-brand-500/20 flex-1 rounded-xl border p-4 text-center'>
      <p className='typo-caption-12 text-muted-foreground mb-1'>변경 플랜</p>
      <p className='typo-heading-16'>{to.name}</p>
      <p className='typo-body-14 text-muted-foreground'>
        월 {to.monthlyPrice.toLocaleString()}원
      </p>
    </div>
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

const InstantAvailableBox = ({
  quota,
  showCancelNotice = false,
}: {
  quota: number;
  showCancelNotice?: boolean;
}) => (
  <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
    <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
    <div>
      <p className='typo-body-14 font-medium'>즉시 사용 가능</p>
      <p className='typo-caption-12 text-muted-foreground'>
        업그레이드 시 {quota.toLocaleString()}건이 바로 제공됩니다.
      </p>
      {showCancelNotice && (
        <p className='typo-caption-12 text-muted-foreground'>
          해지 예약이 설정된 경우, 자동으로 취소됩니다.
        </p>
      )}
    </div>
  </div>
);

const NextBillingNoticeBox = ({
  showCancelNotice = false,
}: {
  showCancelNotice?: boolean;
}) => (
  <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
    <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
    <div>
      <p className='typo-body-14 font-medium'>다음 결제일 적용</p>
      <p className='typo-caption-12 text-muted-foreground'>
        이전까지 현재 플랜을 계속해서 이용하실 수 있습니다.
      </p>
      {showCancelNotice && (
        <p className='typo-caption-12 text-muted-foreground'>
          해지 예약이 설정된 경우, 자동으로 취소됩니다.
        </p>
      )}
    </div>
  </div>
);

const NextBillingInfoBox = ({
  billingDate,
  amount,
  quotaLimit,
  isLoading,
}: {
  billingDate?: Date | null;
  amount: number;
  quotaLimit: number;
  isLoading?: boolean;
}) => (
  <div className='bg-muted/40 space-y-2 rounded-xl p-4'>
    <p className='typo-caption-12 font-medium'>다음 결제 안내</p>
    <InfoRow label='결제일'>
      {isLoading ? (
        <Skeleton className='h-4 w-24' />
      ) : billingDate ? (
        formatDate(billingDate, 'yyyy년 M월 d일')
      ) : (
        '—'
      )}
    </InfoRow>
    <InfoRow label='결제 금액'>
      {isLoading ? (
        <Skeleton className='h-4 w-16' />
      ) : (
        `${amount.toLocaleString()}원`
      )}
    </InfoRow>
    <InfoRow label='리플 제공 한도'>
      {quotaLimit.toLocaleString()}건 (전체)
    </InfoRow>
  </div>
);

// ─── 모달 콘텐츠 컴포넌트 ─────────────────────────────────
interface ConfirmProps {
  plan: PlanDomain;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
  preview?: ChangePlanPreviewDomain | null;
  isPreviewLoading?: boolean;
  /** 현재 구독 종료일 — 다음 결제일 표시 용 (Subscribe/Upgrade) */
  currentPeriodEnd?: Date | null;
}

interface ChangeConfirmProps extends ConfirmProps {
  currentPlan: PlanDomain;
  isCancelScheduled?: boolean;
}

const SubscribeConfirm = ({
  plan,
  onConfirm,
  isPending,
  preview,
  isPreviewLoading,
  currentPeriodEnd,
}: ConfirmProps) => {
  const nextPayment = preview?.nextPayment;
  const instantQuota =
    nextPayment?.immediateAvailableReplyQuota ?? plan.monthlyReplyQuota;
  const payAmount = nextPayment?.amount ?? plan.monthlyPrice;

  return (
    <>
      <DialogHeader>
        <DialogTitle className='typo-heading-20!'>
          {plan.name} 플랜 구독
        </DialogTitle>
      </DialogHeader>
      <div className='space-y-3'>
        <PaymentAmountBox amount={payAmount} />
        <InstantAvailableBox
          quota={instantQuota}
          showCancelNotice={preview?.cancelAtPeriodEndScheduled}
        />
        <NextBillingInfoBox
          billingDate={currentPeriodEnd}
          amount={plan.monthlyPrice}
          quotaLimit={plan.monthlyReplyQuota}
          isLoading={isPreviewLoading}
        />
      </div>
      <DialogFooter>
        <Button onClick={onConfirm} isPending={isPending} className='w-full'>
          구독하기
        </Button>
      </DialogFooter>
    </>
  );
};

const UpgradeConfirm = ({
  currentPlan,
  plan,
  onConfirm,
  isPending,
  isCancelScheduled,
  preview,
  isPreviewLoading,
  currentPeriodEnd,
}: ChangeConfirmProps) => {
  const nextPayment = preview?.nextPayment;
  const diff =
    nextPayment?.amount ?? plan.monthlyPrice - currentPlan.monthlyPrice;
  const instantQuota =
    nextPayment?.immediateAvailableReplyQuota ?? plan.monthlyReplyQuota;
  const showCancelNotice =
    preview?.cancelAtPeriodEndScheduled ?? isCancelScheduled;

  return (
    <>
      <DialogHeader>
        <DialogTitle className='typo-heading-20!'>
          {plan.name} 플랜으로 업그레이드
        </DialogTitle>
      </DialogHeader>
      <div className='space-y-3'>
        <PlanChangeRow from={currentPlan} to={plan} />
        <PaymentAmountBox
          amount={diff}
          caption={`※ 남은 기간 ${preview?.remainingDays}일에 대한 일할 계산 차액만 결제됩니다.`}
        />
        <InstantAvailableBox
          quota={instantQuota}
          showCancelNotice={showCancelNotice}
        />
        <NextBillingInfoBox
          billingDate={currentPeriodEnd}
          amount={plan.monthlyPrice}
          quotaLimit={plan.monthlyReplyQuota}
          isLoading={isPreviewLoading}
        />
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
  isCancelScheduled,
  preview,
  isPreviewLoading,
}: ChangeConfirmProps) => {
  const nextPayment = preview?.nextPayment;
  const showCancelNotice =
    preview?.cancelAtPeriodEndScheduled ?? isCancelScheduled;

  return (
    <>
      <DialogHeader>
        <DialogTitle className='typo-heading-20!'>
          {plan.name.toUpperCase()} 플랜으로 변경
        </DialogTitle>
      </DialogHeader>
      <div className='space-y-3'>
        <PlanChangeRow from={currentPlan} to={plan} />
        <NextBillingNoticeBox showCancelNotice={showCancelNotice} />
        <NextBillingInfoBox
          billingDate={nextPayment?.billingDate}
          amount={nextPayment?.amount ?? plan.monthlyPrice}
          quotaLimit={nextPayment?.replyQuotaLimit ?? plan.monthlyReplyQuota}
          isLoading={isPreviewLoading}
        />
      </div>
      <DialogFooter>
        <Button onClick={onConfirm} isPending={isPending} className='w-full'>
          변경 예약하기
        </Button>
      </DialogFooter>
    </>
  );
};

const UpgradeSuccess = ({
  plan,
  onClose,
  nextBillingDate,
  instantQuota,
}: {
  plan: PlanDomain;
  onClose: () => void;
  nextBillingDate?: Date | null;
  instantQuota?: number | null;
}) => (
  <>
    <div className='flex flex-col items-center gap-3 py-4 text-center'>
      <div className='bg-brand-500/10 flex size-16 items-center justify-center rounded-full'>
        <CheckCircle size={32} className='text-brand-500' />
      </div>
      <div>
        <p className='typo-heading-20 font-bold'>업그레이드 완료!</p>
        <p className='typo-body-14 text-muted-foreground mt-1'>
          지금 바로 {plan.name} 플랜의
          <br />
          모든 기능을 사용하실 수 있습니다.
        </p>
      </div>
    </div>
    <div className='bg-muted/40 space-y-3 rounded-xl p-4'>
      <div className='text-center'>
        <p className='typo-caption-12 text-muted-foreground'>즉시 사용 가능</p>
        <p className='typo-heading-20 font-bold'>
          {(instantQuota ?? plan.monthlyReplyQuota).toLocaleString()}건
        </p>
      </div>
      <div className='border-muted border-t' />
      <InfoRow label='다음 결제일'>
        {nextBillingDate ? formatDate(nextBillingDate, 'yyyy년 M월 d일') : '—'}
      </InfoRow>
      <InfoRow label='다음 결제 금액'>
        {plan.monthlyPrice.toLocaleString()}원
      </InfoRow>
    </div>
    <Button className='w-full' onClick={onClose}>
      확인
    </Button>
  </>
);

const DowngradeSuccess = ({
  plan,
  onClose,
  scheduledAt,
}: {
  plan: PlanDomain;
  onClose: () => void;
  scheduledAt?: Date | null;
}) => (
  <>
    <div className='flex flex-col items-center gap-3 py-4 text-center'>
      <div className='bg-brand-500/10 flex size-16 items-center justify-center rounded-full'>
        <CheckCircle size={32} className='text-brand-500' />
      </div>
      <div>
        <p className='typo-heading-20 font-bold'>변경 예약 완료!</p>
        <p className='typo-body-14 text-muted-foreground mt-1'>
          다음 결제일까지는 현재 플랜 이용 가능합니다.
        </p>
      </div>
    </div>
    <div className='bg-muted/40 space-y-1.5 rounded-xl p-4'>
      <InfoRow label='다음 결제일'>
        {scheduledAt ? formatDate(scheduledAt, 'yyyy년 M월 d일') : '—'}
      </InfoRow>
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
  state: Exclude<PlanModalState, 'keepSubscription'>;
  selectedPlan: PlanDomain;
  currentPlan: PlanDomain;
  isCancelScheduled?: boolean;
  preview?: ChangePlanPreviewDomain | null;
  isPreviewLoading?: boolean;
  /** 현재 구독 종료일 — 업그레이드 confirm/success 다음 결제일 표시 용 */
  currentPeriodEnd?: Date | null;
  /** 다운그레이드 예약 시 전환 예정일 (ChangePlanDomain.scheduledAt) */
  downgradeScheduledAt?: Date | null;
  /** confirm 시점 preview의 immediateAvailableReplyQuota 스냅샷 — success 모달이 사용자가 본 값 유지 */
  instantQuotaSnapshot?: number | null;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  isConfirmPending?: boolean;
}

const PlanChangeModals = ({
  state,
  selectedPlan,
  currentPlan,
  isCancelScheduled,
  preview,
  isPreviewLoading,
  currentPeriodEnd,
  downgradeScheduledAt,
  instantQuotaSnapshot,
  onClose,
  onConfirm,
  isConfirmPending,
}: PlanChangeModalsProps) => {
  // 결제 처리 중에는 배경 클릭(outside-press) / ESC(escape-key)로 닫히지 않도록 차단.
  // X 버튼(close-press)은 일반 닫기로 동작 — 폴링은 페이지 훅에서 별도 유지.
  const onDialogOpenChange = (
    open: boolean,
    details: { reason: string; cancel: () => void }
  ) => {
    if (open) return;
    if (
      isConfirmPending &&
      (details.reason === 'outside-press' || details.reason === 'escape-key')
    ) {
      details.cancel();
      return;
    }
    onClose();
  };

  return (
    <Dialog open onOpenChange={onDialogOpenChange}>
      <DialogContent className='sm:max-w-[425px]'>
        {state === 'subscribe' && (
          <SubscribeConfirm
            plan={selectedPlan}
            onConfirm={onConfirm}
            isPending={isConfirmPending}
            preview={preview}
            isPreviewLoading={isPreviewLoading}
            currentPeriodEnd={currentPeriodEnd}
          />
        )}
        {state === 'upgrade' && (
          <UpgradeConfirm
            currentPlan={currentPlan}
            plan={selectedPlan}
            onConfirm={onConfirm}
            isPending={isConfirmPending}
            isCancelScheduled={isCancelScheduled}
            preview={preview}
            isPreviewLoading={isPreviewLoading}
            currentPeriodEnd={currentPeriodEnd}
          />
        )}
        {state === 'downgrade' && (
          <DowngradeConfirm
            currentPlan={currentPlan}
            plan={selectedPlan}
            onConfirm={onConfirm}
            isPending={isConfirmPending}
            isCancelScheduled={isCancelScheduled}
            preview={preview}
            isPreviewLoading={isPreviewLoading}
          />
        )}
        {state === 'upgradeSuccess' && (
          <UpgradeSuccess
            plan={selectedPlan}
            onClose={onClose}
            nextBillingDate={currentPeriodEnd}
            instantQuota={instantQuotaSnapshot}
          />
        )}
        {state === 'downgradeSuccess' && (
          <DowngradeSuccess
            plan={selectedPlan}
            onClose={onClose}
            scheduledAt={downgradeScheduledAt}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PlanChangeModals;

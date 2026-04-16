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

import { CommonModalProps } from './types';

interface PlanChangeModalProps extends CommonModalProps {
  currentPlan: PlanDomain;
  selectedPlan: PlanDomain;
  step: 'confirm' | 'upgrade-complete' | 'downgrade-complete';
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

// ─── 업그레이드 완료 ──────────────────────────────────────
const UpgradeCompleteContent = ({
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
        <p className='typo-heading-20 font-bold'>업그레이드 완료!</p>
        <p className='typo-body-14 text-muted-foreground mt-1'>
          지금 바로 {plan.name.toUpperCase()} 플랜의
          <br />
          모든 기능을 사용하실 수 있습니다
        </p>
      </div>
    </div>

    <div className='bg-muted/40 space-y-2 rounded-xl p-4'>
      <div className='text-center'>
        <p className='typo-caption-12 text-muted-foreground'>즉시 사용 가능</p>
        <p className='typo-heading-28 font-bold'>
          {plan.monthlyReplyQuota.toLocaleString()}건
        </p>
      </div>
      <div className='space-y-1.5 border-t pt-2'>
        {/* TODO: 결제일 / 결제 금액은 API 연동 후 표시 */}
        <InfoRow label='다음 결제일'>—</InfoRow>
        <InfoRow label='다음 결제 금액'>
          {plan.monthlyPrice.toLocaleString()}원
        </InfoRow>
      </div>
    </div>

    <Button className='w-full' onClick={onClose}>
      확인
    </Button>
  </>
);

// ─── 다운그레이드 완료 ────────────────────────────────────
const DowngradeCompleteContent = ({
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

// ─── 공통 서브 컴포넌트 ───────────────────────────────────
const PlanChangeRow = ({ from, to }: { from: PlanDomain; to: PlanDomain }) => (
  <div className='flex items-center gap-3'>
    <div className='bg-muted/50 flex-1 rounded-xl p-4 text-center'>
      <p className='typo-caption-12 text-muted-foreground mb-1'>현재 플랜</p>
      <p className='typo-heading-16 font-semibold'>{from.name.toUpperCase()}</p>
      <p className='typo-body-14 text-muted-foreground'>
        월 {from.monthlyPrice.toLocaleString()}원
      </p>
    </div>
    <ArrowRight size={18} className='text-muted-foreground shrink-0' />
    <div className='bg-brand-500/8 border-brand-500/20 flex-1 rounded-xl border p-4 text-center'>
      <p className='typo-caption-12 text-muted-foreground mb-1'>변경 플랜</p>
      <p className='typo-heading-16 font-semibold'>{to.name.toUpperCase()}</p>
      <p className='typo-body-14 text-muted-foreground'>
        월 {to.monthlyPrice.toLocaleString()}원
      </p>
    </div>
  </div>
);

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

const PlanConfirmModal = ({
  isFreeStatus,
  selectedPlan,
  currentPlan,
  onConfirm,
  isPending,
}: {
  isFreeStatus: boolean;
  selectedPlan: PlanDomain;
  currentPlan: PlanDomain;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}) => {
  const isUpgrade = currentPlan.monthlyPrice < selectedPlan.monthlyPrice;
  // TODO: 차액은 API 응답값으로 교체
  const diff = selectedPlan.monthlyPrice - currentPlan.monthlyPrice;

  return (
    <>
      <DialogHeader>
        <DialogTitle className='typo-heading-20!'>
          {isFreeStatus
            ? `${selectedPlan.name.toUpperCase()} 플랜 구독`
            : `${selectedPlan.name.toUpperCase()} 플랜으로 변경`}
        </DialogTitle>
      </DialogHeader>

      {/* 플랜 신규 구독 */}
      {isFreeStatus && (
        <div className='space-y-3'>
          {/* 변경 플랜 */}
          <div className='bg-brand-500/5 border-brand-500/10 rounded-xl border p-4 text-center'>
            <p className='typo-caption-12 text-muted-foreground mb-1'>
              변경 플랜
            </p>
            <p className='typo-heading-16 font-semibold'>
              {selectedPlan.name.toUpperCase()}
            </p>
            <p className='typo-body-14 text-muted-foreground'>
              월 {selectedPlan.monthlyPrice.toLocaleString()}원
            </p>
          </div>

          {/* 결제 금액 */}
          <div className='rounded-xl border p-4'>
            <div className='flex items-baseline justify-between'>
              <span className='typo-body-14'>결제 금액</span>
              <span className='typo-heading-18 font-bold'>
                {selectedPlan.monthlyPrice.toLocaleString()}원
              </span>
            </div>
          </div>

          {/* 즉시 사용 가능 */}
          <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
            <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
            <div>
              <p className='typo-body-14 font-medium'>즉시 사용 가능</p>
              <p className='typo-caption-12 text-muted-foreground'>
                업그레이드 시 {selectedPlan.monthlyReplyQuota.toLocaleString()}
                건이 바로 제공됩니다
              </p>
            </div>
          </div>

          {/* 다음 결제 안내 */}
          <div className='bg-muted/40 space-y-2 rounded-xl p-4'>
            <p className='typo-caption-12 font-medium'>다음 결제 안내</p>
            {/* TODO: 결제일은 API 연동 후 표시 */}
            <InfoRow label='결제일'>
              {formatDate(new Date(), 'yyyy년 M월 d일')}
            </InfoRow>
            <InfoRow label='결제 금액'>
              {selectedPlan.monthlyPrice.toLocaleString()}원
            </InfoRow>
            <InfoRow label='리플 제공 한도'>
              {selectedPlan.monthlyReplyQuota.toLocaleString()}건 (전체)
            </InfoRow>
          </div>
        </div>
      )}

      {/* 업그레이드 */}
      {!isFreeStatus && isUpgrade && (
        <div className='space-y-3'>
          {/* 플랜 변경 표시 */}
          <PlanChangeRow from={currentPlan} to={selectedPlan} />

          {/* 결제 금액 */}
          <div className='rounded-xl border p-4'>
            <div className='flex items-baseline justify-between'>
              <span className='typo-body-14'>결제 금액</span>
              <span className='typo-heading-18 font-bold'>
                {diff.toLocaleString()}원
              </span>
            </div>
            <p className='typo-caption-12 text-muted-foreground mt-1'>
              ※ 남은 기간에 대한 일할 계산 차액만 결제됩니다
            </p>
          </div>

          {/* 즉시 사용 가능 */}
          <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
            <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
            <div>
              <p className='typo-body-14 font-medium'>즉시 사용 가능</p>
              <p className='typo-caption-12 text-muted-foreground'>
                업그레이드 시 {selectedPlan.monthlyReplyQuota.toLocaleString()}
                건이 바로 제공됩니다
              </p>
            </div>
          </div>

          {/* 다음 결제 안내 */}
          <div className='bg-muted/40 space-y-2 rounded-xl p-4'>
            <p className='typo-caption-12 font-medium'>다음 결제 안내</p>
            {/* TODO: 결제일은 API 연동 후 표시 */}
            <InfoRow label='결제 금액'>
              {selectedPlan.monthlyPrice.toLocaleString()}원
            </InfoRow>
            <InfoRow label='리플 제공 한도'>
              {selectedPlan.monthlyReplyQuota.toLocaleString()}건 (전체)
            </InfoRow>
          </div>
        </div>
      )}

      {/* 다운그레이드 */}
      {!isFreeStatus && !isUpgrade && (
        <div className='space-y-3'>
          {/* 플랜 변경 표시 */}
          <PlanChangeRow from={currentPlan} to={selectedPlan} />

          {/* 다음 결제일 적용 안내 */}
          <div className='bg-brand-500/5 flex items-start gap-2 rounded-xl p-4'>
            <CheckCircle size={16} className='text-brand-500 mt-0.5 shrink-0' />
            <div>
              <p className='typo-body-14 font-medium'>다음 결제일 적용</p>
              <p className='typo-caption-12 text-muted-foreground'>
                이전까지 현재 플랜을 계속해서 이용하실 수 있습니다
              </p>
            </div>
          </div>

          {/* 다음 결제 안내 */}
          <div className='bg-muted/40 space-y-2 rounded-xl p-4'>
            <p className='typo-caption-12 font-medium'>다음 결제 안내</p>
            {/* TODO: 결제일은 API 연동 후 표시 */}
            <InfoRow label='결제 금액'>
              {selectedPlan.monthlyPrice.toLocaleString()}원
            </InfoRow>
            <InfoRow label='리플 제공 한도'>
              {selectedPlan.monthlyReplyQuota.toLocaleString()}건 (전체)
            </InfoRow>
          </div>
        </div>
      )}

      <DialogFooter>
        <Button onClick={onConfirm} isPending={isPending} className='w-full'>
          {isUpgrade ? '업그레이드하기' : '변경 예약하기'}
        </Button>
      </DialogFooter>
    </>
  );
};
// ─── 메인 모달 ────────────────────────────────────────────
const PlanChangeModal = ({
  open,
  onOpenChange,
  currentPlan,
  selectedPlan,
  step,
  onConfirm,
  isPending,
}: PlanChangeModalProps) => {
  const isFreeStatus = currentPlan.monthlyPrice === 0;
  const handleClose = () => onOpenChange(false);

  const renderContent = () => {
    if (step === 'confirm') {
      return (
        <PlanConfirmModal
          isFreeStatus={isFreeStatus}
          currentPlan={currentPlan}
          selectedPlan={selectedPlan}
          onConfirm={onConfirm}
          isPending={isPending}
        />
      );
    }
    if (step === 'upgrade-complete') {
      return (
        <UpgradeCompleteContent plan={selectedPlan} onClose={handleClose} />
      );
    }
    if (step === 'downgrade-complete') {
      return (
        <DowngradeCompleteContent plan={selectedPlan} onClose={handleClose} />
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className='sm:max-w-[425px]'>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default PlanChangeModal;

import { formatDate } from '@/lib/utils';
import { PlanDomain, SubscriptionDomain } from '@/types';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { CommonModalProps } from './types';

interface CancelSubscriptionModalProps extends CommonModalProps {
  currentPlan: PlanDomain;
  periodEnd: SubscriptionDomain['currentPeriodEnd'];
  nextPlanName?: string | null;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

// 구독 해지 모달(유료ver / 다운그레이드 예정ver)
const CancelSubscriptionModal = ({
  open,
  onOpenChange,
  currentPlan,
  periodEnd,
  nextPlanName,
  onConfirm,
  isPending,
}: CancelSubscriptionModalProps) => {
  const nextRenewalDate = new Date(periodEnd.getTime() + 86400 * 1000);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>구독 해지</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center whitespace-pre-line'>
            {nextPlanName
              ? `구독을 해지하시겠습니까?\n현재 ${nextPlanName} 플랜으로의 변경 예약이 즉시 취소되며,\n${formatDate(nextRenewalDate, 'yyyy년 M월 d일')}부터 무료 플랜으로 전환됩니다.`
              : `구독을 해지하시겠습니까?\n다음 결제일부터 아래의 혜택이 사라집니다.`}
          </AlertDialogDescription>

          {!nextPlanName && (
            <ul className='border-border bg-muted/50 typo-body-14 *:before:bg-destructive/70 mx-auto mt-3 w-full space-y-2 rounded-xl border px-5 py-4 text-left *:flex *:items-center *:before:mr-2 *:before:inline-block *:before:size-1 *:before:shrink-0 *:before:rounded-full'>
              <li className='text-muted-foreground'>
                쇼핑몰 {currentPlan.maxStoreCount}개 등록
              </li>
              <li className='text-muted-foreground'>
                상품 {currentPlan.maxProductPerStore}개 등록
              </li>
              <li className='text-muted-foreground'>
                리플 자동 작성 월{' '}
                {currentPlan.monthlyReplyQuota.toLocaleString()}회
              </li>
            </ul>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>유지하기</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            해지 요청
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelSubscriptionModal;

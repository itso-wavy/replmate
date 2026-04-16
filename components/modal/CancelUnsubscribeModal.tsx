import { formatDate } from '@/lib/utils';
import { DowngradeDomain, SubscriptionDomain } from '@/types';

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

interface CancelUnsubscribeModalProps extends CommonModalProps {
  periodEnd: SubscriptionDomain['currentPeriodEnd'];
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

// 해지 예약 취소 모달
const CancelUnsubscribeModal = ({
  open,
  onOpenChange,
  periodEnd,
  onConfirm,
  isPending,
}: CancelUnsubscribeModalProps) => {
  const nextRenewalDate = new Date(periodEnd.getTime() + 86400 * 1000);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>해지 취소</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            {`해지 요청을 취소하시겠습니까?\n해지를 취소하시면 기존 구독이 유지되며, 다음 결제일(${formatDate(nextRenewalDate)})에 정상적으로 결제가 진행됩니다.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>닫기</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            해지 취소
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelUnsubscribeModal;

import { formatDate } from '@/lib/utils';

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

interface ReactivatePlanModalProps extends CommonModalProps {
  periodEnd: Date;
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

const ReactivatePlanModal = ({
  open,
  onOpenChange,
  periodEnd,
  onConfirm,
  isPending,
}: ReactivatePlanModalProps) => {
  const nextRenewalDate = new Date(periodEnd.getTime() + 86400 * 1000);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>구독 유지</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            {`이 플랜은 현재 이용 중인 플랜입니다.\n계속 진행하시면 예약된 구독 해지가 취소되며, 다음 결제일(${formatDate(nextRenewalDate)})에 정상적으로 결제가 진행됩니다.\n구독을 계속 유지하시겠습니까?`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>닫기</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            구독 유지
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ReactivatePlanModal;

import { formatDate } from '@/lib/utils';
import { DowngradeDomain } from '@/types';

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

interface CancelDowngradeModalProps extends CommonModalProps {
  nextPlanName: string;
  nextRenewalDate: DowngradeDomain['effectiveDate'];
  onConfirm: () => void | Promise<void>;
  isPending?: boolean;
}

// 다운그레이드 변경 예약 취소 모달
const CancelDowngradeModal = ({
  open,
  onOpenChange,
  nextPlanName,
  nextRenewalDate,
  onConfirm,
  isPending,
}: CancelDowngradeModalProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>변경 예약 취소</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center whitespace-pre-line'>
            {`${nextPlanName} 플랜으로의 변경 예약을 취소하시겠습니까?\n예약을 취소하시면 기존 구독이 유지되며,\n다음 결제일(${formatDate(nextRenewalDate)})에 정상적으로 결제가 진행됩니다.`}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>유지하기</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            취소하기
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelDowngradeModal;

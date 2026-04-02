import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/nav-menu';
import type { SubscriptionStatusType } from '@/lib/utils';

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

interface WithdrawModalProps extends CommonModalProps {
  status: SubscriptionStatusType;
  onWithdraw: () => void;
  isDeleting?: boolean;
}

const MODAL_CONFIG: Record<
  SubscriptionStatusType,
  { description: string; actionLabel: string }
> = {
  free: {
    description:
      '회원탈퇴시 계정 정보와 이용 데이터가 모두 삭제되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?',
    actionLabel: '탈퇴하기',
  },
  canceling: {
    description:
      '회원탈퇴시 남아있는 이용 기간과 데이터는 모두 즉시 소멸되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?',
    actionLabel: '탈퇴하기',
  },
  active: {
    description:
      '현재 유료 구독이 활성화되어 있어 회원탈퇴가 불가능합니다.\n탈퇴를 원하시면 먼저 구독을 해지해 주세요.',
    actionLabel: '구독 해지하기',
  },
};

const WithdrawModal = ({
  open,
  onOpenChange,
  status,
  onWithdraw,
  isDeleting,
}: WithdrawModalProps) => {
  const router = useRouter();
  const { description, actionLabel } = MODAL_CONFIG[status];

  const handleAction = () => {
    if (status === 'active') {
      router.push(ROUTES.SUBSCRIBE);
      onOpenChange(false);
    } else {
      onWithdraw();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-center'>회원탈퇴</AlertDialogTitle>
          <AlertDialogDescription className='text-center whitespace-pre-line'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} disabled={isDeleting}>
            {actionLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WithdrawModal;

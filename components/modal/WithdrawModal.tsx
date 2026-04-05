import { SubscriptionStatus } from '@/types';

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
  subscriptionStatus: SubscriptionStatus;
  onWithdraw?: () => void;
  onGoToSubscribe?: () => void; // 추가
  isDeleting?: boolean;
}

type WithdrawConfig = { description: string; canWithdraw: boolean };

const WITHDRAW_CONFIG = {
  default: {
    description:
      '회원탈퇴시 계정 정보와 이용 데이터가 모두 삭제되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?',
    canWithdraw: true,
  },
  blocked: {
    description:
      '현재 유료 구독이 활성화되어 있어 회원탈퇴가 불가능합니다.\n탈퇴를 원하시면 먼저 구독을 해지해 주세요.',
    canWithdraw: false,
  },
  cancelScheduled: {
    description:
      '회원탈퇴시 남아 있는 이용 기간과 데이터는\n모두 즉시 소멸되며 복구할 수 없습니다.\n정말 탈퇴하시겠습니까?',
    canWithdraw: true,
  },
} satisfies Record<string, WithdrawConfig>;

const MODAL_CONFIG: Record<SubscriptionStatus, WithdrawConfig> = {
  [SubscriptionStatus.FREE]: WITHDRAW_CONFIG.default,
  [SubscriptionStatus.UNVERIFIED]: WITHDRAW_CONFIG.default,
  [SubscriptionStatus.PAID_ACTIVE]: WITHDRAW_CONFIG.blocked,
  [SubscriptionStatus.PAID_PLAN_DOWNGRADE_SCHEDULED]: WITHDRAW_CONFIG.blocked,
  [SubscriptionStatus.PAID_CANCEL_SCHEDULED]: WITHDRAW_CONFIG.cancelScheduled,
};

const WithdrawModal = ({
  open,
  onOpenChange,
  subscriptionStatus,
  onWithdraw,
  onGoToSubscribe,
  isDeleting,
}: WithdrawModalProps) => {
  const { description, canWithdraw } = MODAL_CONFIG[subscriptionStatus];

  const handleAction = () => {
    if (!canWithdraw) {
      onGoToSubscribe?.();
    } else {
      onWithdraw?.();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='sm:max-w-[425px]'>
        <AlertDialogHeader>
          <AlertDialogTitle>회원탈퇴</AlertDialogTitle>
          <AlertDialogDescription className='mx-auto text-center'>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className='*:flex-1'>
          <AlertDialogCancel>취소</AlertDialogCancel>
          <AlertDialogAction onClick={handleAction} isPending={isDeleting}>
            {canWithdraw ? '탈퇴하기' : '구독 해지하기'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default WithdrawModal;

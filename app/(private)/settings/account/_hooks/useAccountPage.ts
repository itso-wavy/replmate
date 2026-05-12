import { useRouter } from 'next/navigation';

import { useEffect, useState } from 'react';

import { signOut } from 'next-auth/react';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/nav-menu';
import { dummyNotificationSettings } from '@/dummy/account';
import { useTermsList } from '@/hooks/useTerms';
import {
  useDeleteUser,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useUser,
  useUserPlan,
  useVerifyIdentity,
} from '@/hooks/useUser';
import { formatDate } from '@/lib/utils';
import { UserStore } from '@/store/userStore';

export function useAccountPage() {
  const router = useRouter();
  const { data: user } = useUser();
  const { clearUser } = UserStore.useActions();

  // 구독 상태
  const { data: userPlan } = useUserPlan();

  // 회원탈퇴 모달
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  // 약관
  const { data: termsList, isLoading: isLoadingTerms } = useTermsList();

  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const toggleExpand = (type: string) =>
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });

  // 알림 설정
  const { data: notificationSettings, isLoading: isLoadingNotification } =
    useNotificationSettings();
  const {
    mutate: updateNotificationSettings,
    isPending: isUpdatingNotification,
  } = useUpdateNotificationSettings();

  const [emailEnabled, setEmailEnabled] = useState(false);
  const [smsEnabled, setSmsEnabled] = useState(false);

  useEffect(() => {
    if (!notificationSettings) return;
    setEmailEnabled(notificationSettings.emailEnabled);
    setSmsEnabled(notificationSettings.smsEnabled);
  }, [notificationSettings]);

  const today = formatDate(new Date());

  const handleEmailToggle = (checked: boolean) => {
    setEmailEnabled(checked);
    updateNotificationSettings(
      { emailEnabled: checked, smsEnabled },
      {
        onSuccess: () =>
          toast.success(
            checked
              ? `이메일 수신 동의가 처리되었습니다.(${today})`
              : `이메일 수신 거부가 처리되었습니다.(${today})`
          ),
        onError: () => setEmailEnabled(!checked),
      }
    );
  };

  const handleSmsToggle = (checked: boolean) => {
    setSmsEnabled(checked);
    updateNotificationSettings(
      { emailEnabled, smsEnabled: checked },
      {
        onSuccess: () =>
          toast.success(
            checked
              ? `문자 수신 동의가 처리되었습니다.(${today})`
              : `문자 수신 거부가 처리되었습니다.(${today})`
          ),
        onError: () => setSmsEnabled(!checked),
      }
    );
  };

  // 본인인증 (KCP 팝업)
  // useVerifyIdentity가 팝업 열기 + 메시지 수신 + user 재조회까지 캡슐화.
  // 성공/실패 판정은 mutation 결과의 success(=fresh isVerified)로 판정.
  const { mutate: verifyIdentity, isPending: isVerifying } =
    useVerifyIdentity();

  const handleUserVerify = () => {
    verifyIdentity(undefined, {
      onSuccess: ({ success }) => {
        if (success) toast.success('본인인증이 완료되었습니다.');
        else toast.error('본인인증에 실패했습니다.');
      },
    });
  };

  // 회원탈퇴
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleUserWithdraw = () => {
    deleteUser(
      { forfeitSubscriptionAgreed: true },
      {
        onSuccess: async () => {
          toast.success('회원탈퇴가 완료되었습니다.');
          setIsWithdrawModalOpen(false);
          clearUser();
          await signOut({ callbackUrl: ROUTES.ROOT, redirect: false });
          router.push(ROUTES.ROOT);
        },
        onError: () =>
          toast.error('요청에 실패했습니다. 잠시 후 다시 시도해 주세요.'),
      }
    );
  };

  return {
    user,
    termsList,
    isLoadingTerms,
    expandedTerms,
    toggleExpand,
    emailEnabled,
    smsEnabled,
    isLoadingNotification,
    isUpdatingNotification,
    handleEmailToggle,
    handleSmsToggle,
    isVerifying,
    handleUserVerify,
    subscriptionStatus: userPlan?.planStatus,
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    isDeleting,
    handleUserWithdraw,
  };
}

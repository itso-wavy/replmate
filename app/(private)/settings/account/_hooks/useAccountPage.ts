import { useEffect, useState } from 'react';

import { toast } from 'sonner';

import { dummyNotificationSettings } from '@/dummy/account';
import {
  useDeleteUser,
  useNotificationSettings,
  useUpdateNotificationSettings,
  useVerifyIdentity,
} from '@/hooks/useUser';
import { useTermsList } from '@/hooks/useTerms';
import { UserStore } from '@/store/userStore';

export function useAccountPage() {
  const user = UserStore.useUser();
  const { data: termsList } = useTermsList();

  // 약관 펼치기
  const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());
  const toggleExpand = (type: string) =>
    setExpandedTerms((prev) => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });

  // 알림 설정
  const { data: notificationSettings } = useNotificationSettings();
  const {
    mutate: updateNotificationSettings,
    isPending: isUpdatingNotification,
  } = useUpdateNotificationSettings();

  const [emailEnabled, setEmailEnabled] = useState(
    dummyNotificationSettings.emailEnabled
  );
  const [smsEnabled, setSmsEnabled] = useState(
    dummyNotificationSettings.smsEnabled
  );

  useEffect(() => {
    if (!notificationSettings) return;
    setEmailEnabled(notificationSettings.emailEnabled);
    setSmsEnabled(notificationSettings.smsEnabled);
  }, [notificationSettings]);

  const handleEmailToggle = (checked: boolean) => {
    setEmailEnabled(checked);
    updateNotificationSettings(
      { emailEnabled: checked, smsEnabled },
      { onError: () => setEmailEnabled(!checked) }
    );
  };

  const handleSmsToggle = (checked: boolean) => {
    setSmsEnabled(checked);
    updateNotificationSettings(
      { emailEnabled, smsEnabled: checked },
      { onError: () => setSmsEnabled(!checked) }
    );
  };

  // 본인인증
  const { mutate: verifyIdentity, isPending: isVerifying } = useVerifyIdentity();

  const handleUserVerify = () => {
    verifyIdentity(undefined, {
      onSuccess: () => toast.success('본인인증이 완료되었습니다.'),
      onError: () => toast.error('본인인증에 실패했습니다.'),
    });
  };

  // 회원탈퇴
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const handleUserWithdraw = () => {
    deleteUser(
      { forfeitSubscriptionAgreed: true },
      {
        onSuccess: () => toast.success('탈퇴가 완료되었습니다.'),
        onError: () => toast.error('탈퇴 처리에 실패했습니다.'),
      }
    );
  };

  return {
    user,
    termsList,
    expandedTerms,
    toggleExpand,
    emailEnabled,
    smsEnabled,
    isUpdatingNotification,
    handleEmailToggle,
    handleSmsToggle,
    isVerifying,
    handleUserVerify,
    isDeleting,
    handleUserWithdraw,
  };
}

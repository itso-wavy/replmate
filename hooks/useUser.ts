import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import {
  openKcpPopup,
  submitKcpAuthFormToPopup,
  waitForKcpResult,
} from '@/lib/kcp';
import { queryKeys } from '@/lib/queryKeys';
import {
  agreeTerms,
  cancelDowngrade,
  cancelPlan,
  changePlan,
  deleteUser,
  getKcpTestVerifyUrl,
  getNotificationSettings,
  getUser,
  getUserPlan,
  reactivatePlan,
  requestReceipt,
  updateNotificationSettings,
  verifyIdentityKcpTradeReg,
} from '@/services/user';
import type { DeleteUserRequest } from '@/types/api/user';

export const useUser = () =>
  useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: getUser,
  });

export const useUserPlan = () =>
  useQuery({
    queryKey: queryKeys.user.plan(),
    queryFn: getUserPlan,
  });

export const useNotificationSettings = () =>
  useQuery({
    queryKey: queryKeys.user.notifications(),
    queryFn: getNotificationSettings,
  });

export const useUpdateNotificationSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      settings: Partial<{ emailEnabled: boolean; smsEnabled: boolean }>
    ) => updateNotificationSettings(settings),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.user.notifications() }),
  });
};

export const useDeleteUser = () =>
  useMutation({
    mutationFn: (data: DeleteUserRequest) => deleteUser(data),
  });

export const useChangePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => changePlan(planId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useCancelPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelPlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useReactivatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reactivatePlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useCancelDowngrade = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelDowngrade,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useRequestReceipt = () =>
  useMutation({
    mutationFn: requestReceipt,
    onError: () => {}, // 에러 처리는 호출 측 catch에서 담당
  });

export const useAgreeTerms = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (termsIds: number[]) => agreeTerms(termsIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.me() }),
  });
};

// KCP 본인확인 (PC 팝업 방식).
// 1) 빈 팝업창 선개방 (popup blocker 회피)
// 2) 모드별 처리:
//    - 테스트: GET /verify-identity/kcp/test (redirect=false) → JSON {url} → 팝업 location 설정
//    - 운영: POST /verify-identity/kcp/trade-reg → form POST to callUrl with target=팝업
// 3) 팝업 내부에서 인증 → 백엔드 callback → /auth/kcp/callback로 redirect → postMessage + close
// 4) 부모창은 메시지 수신 후 user 재조회 → fresh isVerified 변화로 성공/실패 판정
export type VerifyIdentityResult = { success: boolean };

export const useVerifyIdentity = () => {
  const qc = useQueryClient();

  return useMutation<VerifyIdentityResult>({
    mutationFn: async () => {
      const popup = openKcpPopup();
      if (!popup)
        throw new Error(
          '팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.'
        );

      const result = waitForKcpResult(popup);

      try {
        if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
          const url = await getKcpTestVerifyUrl();
          popup.location.href = url;
        } else {
          const trade = await verifyIdentityKcpTradeReg();
          submitKcpAuthFormToPopup(trade);
        }
      } catch (e) {
        popup.close();
        throw e;
      }

      await result;

      // 인증 결과는 user.isVerified 서버 상태로 판정 (postMessage 내용 trust 안 함)
      await qc.invalidateQueries({ queryKey: queryKeys.user.me() });
      const fresh = await qc.fetchQuery({
        queryKey: queryKeys.user.me(),
        queryFn: getUser,
      });

      return { success: !!fresh.isVerified };
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.user.plan() });
    },
    onError: (e) =>
      toast.error(
        e instanceof Error ? e.message : '본인인증 요청에 실패했습니다.'
      ),
  });
};

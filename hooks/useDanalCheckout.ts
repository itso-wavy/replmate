import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  openDanalPopup,
  submitDanalAuthFormToPopup,
  waitForDanalResult,
} from '@/lib/danal';
import { queryKeys } from '@/lib/queryKeys';
import { getDanalTestPaymentUrl, startDanalAuth } from '@/services/payment';
import { getUserPlan } from '@/services/user';
import type { UserPlanDomain } from '@/types/domain/user';

export type DanalCheckoutResult = { success: boolean };

export interface DanalCheckoutVars {
  orderId: number;
  planId?: number;
}

// 다날 결제 (PC 팝업 방식).
// 1) 빈 팝업창 선개방 (popup blocker 회피)
// 2) 모드별 처리:
//    - 테스트: GET /payments/danal/test?redirect=false → JSON {url} → 팝업 location 설정
//    - 운영: POST /payments/danal/auth/{orderId} → form POST to startUrl with target=팝업
// 3) 팝업 내부에서 결제 → 백엔드 callback → /payments/danal/callback로 redirect → postMessage + close
// 4) 부모창은 메시지 수신 후 userPlan 재조회 → planStatus / plan.id 변화로 성공/실패 판정
export const useDanalCheckout = () => {
  const qc = useQueryClient();

  return useMutation<DanalCheckoutResult, Error, DanalCheckoutVars>({
    mutationFn: async ({ orderId, planId }) => {
      const popup = openDanalPopup();
      if (!popup)
        throw new Error(
          '팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.'
        );

      const before = qc.getQueryData<UserPlanDomain>(queryKeys.user.plan());

      const result = waitForDanalResult(popup);

      try {
        if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
          const url = await getDanalTestPaymentUrl({ planId });
          popup.location.href = url;
        } else {
          const auth = await startDanalAuth(orderId);
          submitDanalAuthFormToPopup(auth);
        }
      } catch (e) {
        popup.close();
        throw e;
      }

      await result;

      // 결제 결과는 userPlan 서버 상태로 판정 (postMessage 내용 trust 안 함)
      await qc.invalidateQueries({ queryKey: queryKeys.user.plan() });
      const fresh = await qc.fetchQuery({
        queryKey: queryKeys.user.plan(),
        queryFn: getUserPlan,
      });

      const success =
        before?.planStatus !== fresh.planStatus ||
        before?.plan?.id !== fresh.plan?.id;

      return { success };
    },
    // 글로벌 MutationCache.onError 가드 통과용. 토스트는 호출자 catch에서 메시지 분기.
    onError: () => {},
  });
};

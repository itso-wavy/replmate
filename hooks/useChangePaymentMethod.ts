import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  openDanalPopup,
  submitDanalAuthFormToPopup,
  waitForDanalResult,
} from '@/lib/danal';
import { queryKeys } from '@/lib/queryKeys';
import { changePaymentMethod } from '@/services/payment';

export type ChangePaymentMethodResult =
  | { status: 'success' }
  | { status: 'cancel' }
  | { status: 'error'; message?: string };

// 결제수단(빌링키) 변경 — 다날 팝업 방식.
// 1) 빈 팝업창 선개방 (popup blocker 회피)
// 2) POST /payments/method/change → DanalAuth 응답 (startUrl/startParams) → form POST to 팝업
// 3) 팝업 내부에서 카드 인증 → 백엔드 callback 303 → /payments/danal/callback?status=...
// 4) 콜백 페이지가 status/orderId postMessage 전달 + close
// 5) 결과는 plan diff 불가 (paymentMethod ISBILL=N 직후 null 가능) → status 로 판정
export const useChangePaymentMethod = () => {
  const qc = useQueryClient();

  return useMutation<ChangePaymentMethodResult, Error, void>({
    mutationFn: async () => {
      const popup = openDanalPopup();
      if (!popup)
        throw new Error(
          '팝업이 차단되었습니다. 팝업 허용 후 다시 시도해 주세요.'
        );

      const result = waitForDanalResult(popup);

      try {
        const auth = await changePaymentMethod();
        submitDanalAuthFormToPopup(auth);
      } catch (e) {
        popup.close();
        throw e;
      }

      const payload = await result;

      // payload === null: 사용자가 팝업 임의 close → 취소 처리
      if (!payload) return { status: 'cancel' };

      if (payload.status === 'success') {
        // exact: true — preview 캐시는 invalidate 대상 아님.
        await qc.invalidateQueries({
          queryKey: queryKeys.user.plan(),
          exact: true,
        });
        return { status: 'success' };
      }

      if (payload.status === 'cancel') return { status: 'cancel' };

      return { status: 'error' };
    },
    onError: () => {},
  });
};
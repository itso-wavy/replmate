import { api } from '@/lib/api';
import { PAYMENT_ENDPOINTS } from '@/lib/endpoints';
import type {
  DanalAuthResponseDto,
  DanalBillingInitDto,
} from '@/types/api/payment';

/**
 * 다날 결제창 시작 (server-driven AUTH 흐름)
 * - 응답으로 받은 startUrl에 startParams를 form POST하여 결제창 진입
 * - 결제 완료 후 다날이 서버 `/danal/callback`으로 콜백 → 서버가 frontend로 redirect
 */
export async function startDanalAuth(
  orderId: string | number
): Promise<DanalAuthResponseDto> {
  const response = await api.post<DanalAuthResponseDto>(
    PAYMENT_ENDPOINTS.DANAL_AUTH(orderId)
  );
  return response.data;
}

/**
 * @deprecated SDK 기반 빌링 init (swagger v260430부터 제거됨).
 * 신규 코드는 `startDanalAuth(orderId)` 사용.
 */
export async function initDanalBilling(
  planId: number
): Promise<DanalBillingInitDto> {
  const response = await api.post<DanalBillingInitDto>(
    PAYMENT_ENDPOINTS.DANAL_BILLING_INIT,
    { planId }
  );
  return response.data;
}

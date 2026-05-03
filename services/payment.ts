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
 * [TEST] 다날 테스트 결제 URL 생성
 * - GET /payments/danal/test (dev/test 환경 전용, stg/prod 404)
 * - redirect=true: 백엔드가 test-page로 302, 결제 완료 시 frontend로 자동 redirect
 * - redirect_uri 미지정 시 백엔드 frontend_url 사용 (whitelist 검증)
 */
export function buildDanalTestPaymentUrl(
  params: {
    planId?: number;
    amount?: number;
    redirectUri?: string;
  } = {}
): string {
  const url = new URL(PAYMENT_ENDPOINTS.DANAL_TEST);
  url.searchParams.set('redirect', 'true');
  if (params.redirectUri)
    url.searchParams.set('redirect_uri', params.redirectUri);
  if (params.planId !== undefined)
    url.searchParams.set('plan_id', String(params.planId));
  if (params.amount !== undefined)
    url.searchParams.set('amount', String(params.amount));
  return url.toString();
}

/**
 * [TEST] 다날 테스트 결제창으로 브라우저 네비게이션
 * - axios 호출이 아닌 window.location.href 사용 (302 follow + cookie 자동 전송)
 */
export function redirectToDanalTestPayment(
  params: { planId?: number; amount?: number } = {}
): void {
  if (typeof window === 'undefined') return;
  const url = buildDanalTestPaymentUrl({
    ...params,
    redirectUri: window.location.origin,
  });
  window.location.href = url;
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

import { api } from '@/lib/api';
import { PAYMENT_ENDPOINTS } from '@/lib/endpoints';
import type { DanalAuthResponseDto } from '@/types/api/payment';

/**
 * 다날 결제창 시작 (운영, server-driven AUTH 흐름)
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
 * [TEST] 다날 테스트 결제 URL 조회 (dev/test 전용, stg/prod 404)
 * - GET /payments/danal/test?redirect=false → JSON {url} 응답
 * - 팝업창 location에 직접 설정해 결제 페이지로 진입
 */
export async function getDanalTestPaymentUrl(
  params: { planId?: number; amount?: number } = {}
): Promise<string> {
  const url = new URL(PAYMENT_ENDPOINTS.DANAL_TEST);
  url.searchParams.set('redirect', 'false');
  if (params.planId !== undefined)
    url.searchParams.set('plan_id', String(params.planId));
  if (params.amount !== undefined)
    url.searchParams.set('amount', String(params.amount));
  const response = await api.get<{ url: string }>(url.toString());
  return response.data.url;
}

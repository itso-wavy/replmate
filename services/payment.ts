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
 * 결제수단 변경 시작
 * - 서버: 기존 활성 빌링키 DELBILLKEY + DB is_active=false → 신규 AUTH(ISBILL=N) 호출
 * - 응답은 DANAL_AUTH와 동일한 DanalAuthResponse → form POST로 결제창 진입
 * - 콜백 복귀: {frontend_url}/payments/danal/callback?status=success|error|cancel&orderId=...
 *   (redirect_uri 옵션은 서버가 저장하지 않음 → 항상 frontend_url + /payments/danal/callback)
 * - 신규 BILLKEY는 콜백에서 ISSUEBILLKEY로 발급/저장. 실제 결제는 일어나지 않음(amount=100 더미)
 */
export async function changePaymentMethod(): Promise<DanalAuthResponseDto> {
  const response = await api.post<DanalAuthResponseDto>(
    PAYMENT_ENDPOINTS.METHOD_CHANGE
  );
  return response.data;
}


import { api } from '@/lib/api';
import { PAYMENT_ENDPOINTS } from '@/lib/endpoints';
import type { PaymentOrderDto, PaymentResultDto } from '@/types/api/payment';

/**
 * 토스 결제 콜백
 * GET /api/v1/payments/toss/callback?orderId=...&paymentKey=...&amount=...
 */
export async function tossCallback(params: {
  orderId: string;
  paymentKey: string;
  amount: number;
}): Promise<PaymentOrderDto> {
  const response = await api.get<PaymentOrderDto>(
    PAYMENT_ENDPOINTS.TOSS_CALLBACK,
    { params }
  );
  return response.data;
}

/**
 * 결제 콜백 응답 샘플 (개발용)
 * GET /api/v1/payments/sample/callback
 */
export async function getSampleCallback(): Promise<PaymentResultDto> {
  const response = await api.get<PaymentResultDto>(
    PAYMENT_ENDPOINTS.SAMPLE_CALLBACK
  );
  return response.data;
}

/**
 * Mock 결제 처리 (개발용)
 * GET /api/v1/payments/mock/{order_id}?success=true
 */
export async function mockPayment(
  orderId: string,
  success?: boolean
): Promise<PaymentResultDto> {
  const response = await api.get<PaymentResultDto>(
    PAYMENT_ENDPOINTS.MOCK_PAYMENT(orderId),
    { params: { success } }
  );
  return response.data;
}

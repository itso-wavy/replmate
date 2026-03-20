// ============================================================================
// 결제 (Payments)
// ============================================================================

// GET /api/v1/payments/toss/callback 토스 결제 콜백 응답
export interface PaymentOrderDto {
  id: number;
  orderType: string;
  status: string;
  amount: number;
  fromPlanId: number | null;
  toPlanId: number | null;
  createdAt: string;
  completedAt: string | null;
}

// GET /api/v1/payments/sample/callback, GET /api/v1/payments/mock/{order_id}
export interface PaymentResultDto {
  success: boolean;
  orderId: number;
  paymentKey: string | null;
  planName: string | null;
  message: string;
}

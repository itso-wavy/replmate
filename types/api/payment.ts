// ==========================================================
// 결제 (Payments)
// ==========================================================

// POST /api/v1/payments/danal/auth/{order_id} 다날 결제창 시작 응답
// POST /api/v1/payments/method/change            결제수단 변경 시작 응답
// 프론트는 startUrl로 startParams를 form POST해 결제창에 진입한다.
export interface DanalAuthResponseDto {
  startUrl: string;
  startParams: string;
  tid: string | null; // transactionID (AUTH 단계에서는 null 가능)
  orderId: number;
}

// 결제 결과 (다날 콜백 후 mock 응답 + 콜백 처리 결과 공통)
// BaseResponse[PaymentResult]
export interface PaymentResultDto {
  success: boolean;
  orderId: number;
  paymentKey: string | null;
  planName: string | null;
  message: string;
}

// 다날 결제 콜백 redirect 쿼리 파라미터 status 값
// /payments/danal/callback?status=...&orderId=...
export type DanalCallbackStatus = 'success' | 'error' | 'cancel';

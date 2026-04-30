// POST /api/v1/payments/danal/auth/{order_id} 다날 결제창 시작 응답
// 프론트는 startUrl로 startParams를 form POST해 결제창에 진입한다.
export interface DanalAuthResponseDto {
  startUrl: string;
  startParams: string;
  tid: string | null;
  orderId: number;
}

// @deprecated SDK 기반 빌링 흐름 (swagger v260430부터 제거됨)
export interface DanalBillingInitDto {
  clientKey: string;
  merchantId: string;
  orderId: string;
  userId: string;
  amount: number;
  orderName: string;
}

// @deprecated SDK 기반 빌링 콜백 페이로드 (legacy)
export interface DanalBillingCallbackDto {
  transactionId: string;
  orderId: string;
  code: string;
  message?: string;
}

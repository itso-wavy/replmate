// POST /api/v1/payments/danal/auth/{order_id} 다날 결제창 시작 응답
// 프론트는 startUrl로 startParams를 form POST해 결제창에 진입한다.
export interface DanalAuthResponseDto {
  startUrl: string;
  startParams: string;
  tid: string | null; // transactionID
  orderId: number;
}

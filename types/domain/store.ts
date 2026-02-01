// 상태 타입 정의
export type ActiveStatus = 'waiting' | 'active' | 'inactive';
export type DetailStatus =
  | 'normal' // 활성: 정상
  | 'deactivation_pending' // 활성: 비활성화 대기
  | 'approval_pending' // 비활성: 승인 대기
  | 'rejected' // 비활성: 반려
  | 'deactivated'; // 비활성: 완전 비활성

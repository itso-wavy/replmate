// ==========================================================
// 플랜 (Plans)
// ==========================================================

// GET /api/v1/plans?include_free=true 플랜 목록 조회 API
export interface PlanDto {
  id: number;
  name: string; // "Basic"
  title: string | null; // "혼자서도 완벽한 1인 셀러"
  description: string | null; // "하루 커피 한 잔 값으로\n리뷰 관리의 부담을 없애세요."
  monthlyPrice: number; // 39000
  currency: string; // "KRW"
  monthlyReplyQuota: number;
  maxStoreCount: number;
  /** 유저 단위 상품 등록 가능 총 개수 (전체 스토어 합산) */
  maxProductCount: number;
  /** @deprecated 1.5.0 Drop 예정. `maxProductCount` 사용 */
  maxProductPerStore?: number;
  maxTestPerDay: number;
  /** 카드 상단 강조 키워드 (예: ["800건", "50개", "2개"]) */
  highlights: string[];
  /** 핵심 요약 라인 (예: ["월 800건 답변 생성", ...]) */
  summary: string[];
  /** 부가 기능 라인 (예: ["문맥 파악 AI 엔진", ...]) */
  contents: string[];
}

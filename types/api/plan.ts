// ============================================================================
// 플랜 (Plans)
// ============================================================================

// GET /api/v1/plans?include_free=true 플랜 목록 조회 API
export interface PlanDto {
  id: number;
  name: string;
  title: string | null;
  description: string | null;
  monthlyPrice: number;
  currency: string;
  monthlyReplyQuota: number;
  maxStoreCount: number;
  maxProductPerStore: number;
  maxTestPerDay: number;
}

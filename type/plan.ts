// ============================================================================
// 플랜 (Plans)
// ============================================================================
// GET /api/v1/plans?include_free=true 플랜 목록 조회 API
export interface Plan {
  // id: number;
  name: string; // "Basic"
  title: string | null; // "혼자서도 완벽한 1인 셀러"
  description: string | null;
  monthly_price: number;
  currency: string; // "KRW"
  monthly_reply_quota: number;
  max_store_count: number;
  max_product_per_store: number;
  max_test_per_day: number;
  is_active: boolean;
  created_at: string; // "2025-01-01T00:00:00Z"
  updated_at: string; // "2025-01-01T00:00:00Z"
}

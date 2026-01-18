import { PlatformType } from './enums';

// ============================================================================
// 스토어 (Stores)
// ============================================================================
// GET /api/v1/stores/me 연동한 스토어 목록
// 대시보드, 쇼핑몰 연동에서 사용
export interface Stores {
  id: number;
  // userId: number;
  name: string;
  // connectionStatus: string;
  url: string;
  platform: PlatformType;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string;
  last_product_synced_at: string;
  created_at: string;
  updated_at: string;
  deletedAt: string | null;
}

// GET /api/v1/stores/{store_id}
// 특정 스토어의 상세 정보를 조회, 스토어 소유자만 조회 가능
export interface Store {
  id: number;
  // userId: number;
  name: string;
  // connectionStatus: string;
  url: string;
  platform: PlatformType;
  is_active: boolean;
  is_verified: boolean;
  verified_at: string;
  last_product_synced_at: string;
  created_at: string;
  updated_at: string;
  // deletedAt: string | null;
}

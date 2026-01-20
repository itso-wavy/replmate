import { PlatformType } from './enums';

// ============================================================================
// 스토어 (Stores)
// ============================================================================

// GET /api/v1/stores/me 연동한 스토어 목록
// GET /api/v1/stores/{store_id} 스토어 상세 조회
export interface StoreDto {
  id: number;
  name: string;
  url: string;
  platform: PlatformType;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt: string | null;
  lastProductSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// GET /api/v1/stores/{store_id}/reply-options 스토어 리플 옵션 조회
export interface StoreReplyOptionsDto {
  tone: string | null;
  lengthType: string | null;
  includeEmoji: boolean;
}

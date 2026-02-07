import { StoreStatus } from '../enums';
import type { JobTicketDto } from './job';

// ============================================================================
// 스토어 (Stores)
// ============================================================================

// GET /api/v1/stores/me 연동한 스토어 목록
// GET /api/v1/stores/{store_id} 스토어 상세 조회
export interface StoreDto {
  id: number;
  name: string;
  url: string;
  platform: string;
  status: StoreStatus; // FIXME: 백엔드 추가 필드
}

// GET /api/v1/stores/{store_id}/reply-options 스토어 리플 옵션 조회
// GET /api/v1/stores/{store_id} ?ㅽ넗???곸꽭 議고쉶
export interface StoreDetailDto {
  id: number;
  name: string;
  platform: string;
  url: string;
  status: StoreStatus;
  verifiedAt: string | null;
  lastProductSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// ?ㅽ넗???앹꽦 ?묐떟 (Job + Store)
export interface StoreInfoDto {
  job: JobTicketDto;
  store: StoreDetailDto;
}

// URL 以묐났 ?뺤씤 ?묐떟
export interface StoreUrlCheckInfoDto {
  exists: boolean;
  url: string | null;
}

// Presigned URL ?붿껌
export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
}

// Presigned URL ?묐떟
export interface PresignedUrlDto {
  presignedUrl: string;
  imageKey: string;
  expiresIn: number;
}

// ?ㅽ넗??踰뚰겕 ?낅뜲?댄듃 ?붿껌
export interface UpdateStoresRequest {
  storeIds: number[];
  isDeactivationScheduled?: boolean;
  deactivationScheduledAt?: string;
}

// ?몄쬆 ?대?吏 ?낅뜲?댄듃 ?붿껌
export interface UpdateVerificationImageRequest {
  imageKey: string;
}

export interface StoreReplyOptionsDto {
  storeId: number;
  tone: string;
  lengthType: string;
  includeEmoji: boolean;
  brandGuideline: string | null;
  updatedAt: string;
}

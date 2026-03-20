import { StoreStatus } from '../enums';
import type { JobTicketDto } from './job';

// ============================================================================
// 스토어 (Stores)
// ============================================================================

// GET /api/v1/users/me/stores 내 스토어 목록
// PATCH /api/v1/stores/{store_id} 스토어 업데이트 응답
export interface StoreDto {
  id: number;
  name: string;
  url: string;
  platform: string;
  status: StoreStatus;
}

// GET /api/v1/stores/{store_id} 스토어 상세 조회
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

// POST /api/v1/stores 스토어 생성 응답 (Job + Store)
export interface StoreInfoDto {
  job: JobTicketDto;
  store: StoreDetailDto;
}

// GET /api/v1/stores/url-check URL 중복 확인 응답
export interface StoreUrlCheckInfoDto {
  exists: boolean;
  url: string | null;
}

// POST /api/v1/stores/presigned-url Presigned URL 요청
export interface PresignedUrlRequest {
  filename: string;
  contentType: string;
}

// POST /api/v1/stores/presigned-url Presigned URL 응답
export interface PresignedUrlDto {
  uploadUrl: string;
  imageKey: string;
}

// PATCH /api/v1/stores/{store_id} 스토어 단건 업데이트 요청
export interface UpdateStoreRequest {
  name?: string;
  url?: string;
  isActive?: boolean;
  isDeactivationScheduled?: boolean;
  deactivationScheduledAt?: string;
}

// PATCH /api/v1/users/me/stores 스토어 벌크 업데이트 요청
export interface UpdateStoresRequest {
  storeIds: number[];
  isDeactivationScheduled?: boolean;
  deactivationScheduledAt?: string;
}

// PUT /api/v1/stores/{store_id}/verification-image 인증 이미지 업데이트 요청
export interface UpdateVerificationImageRequest {
  imageKey: string;
}

// GET /api/v1/stores/{store_id}/reply-options 리플 옵션 조회
// PUT /api/v1/stores/{store_id}/reply-options 리플 옵션 수정 응답
export interface StoreReplyOptionsDto {
  storeId: number;
  tone: string;
  lengthType: string;
  includeEmoji: boolean;
  brandGuideline: string | null;
  updatedAt: string;
}

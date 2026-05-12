import { PlatformType, StoreStatus } from '../enums';
import type { JobTicketDto } from './job';

// ==========================================================
// 스토어 (Stores)
// ==========================================================
// GET /api/v1/stores/url-check URL 중복 확인 응답
export interface StoreUrlCheckInfoDto {
  exists: boolean;
  url: string | null;
}

// POST /api/v1/stores/presigned-url Presigned URL (단건)
export interface PresignedUrlRequest {
  contentType: string;
  filename: string;
}
export interface PresignedUrlDto {
  uploadUrl: string;
  imageKey: string;
}

// POST /api/v1/stores/presigned-urls Presigned URL 일괄 발급 (최대 3개)
export interface PresignedUrlsRequest {
  contentTypes: string[];
}
export type PresignedUrlsDto = PresignedUrlDto[];

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

// GET /api/v1/stores/{store_id} 스토어 상세 조회
export interface StoreDetailDto {
  id: number;
  name: string;
  platform: string;
  platformType: PlatformType | null;
  url: string;
  status: StoreStatus;
  verifiedAt: string | null;
  lastProductSyncedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// PATCH /api/v1/stores/{store_id} 스토어 업데이트
export interface UpdateStoreRequest {
  name?: string;
  status?: StoreStatus;
  isDeactivationScheduled?: boolean;
}
export interface StoreDto {
  id: number;
  name: string;
  url: string;
  platform: string;
  platformType: PlatformType | null;
  status: StoreStatus;
}

// POST /api/v1/stores 스토어 생성 (Job + Store)
export interface CreateStoreRequest {
  name: string;
  platform: string; // 'naver' | 'coupang'
  platformType?: string; // 'smartstore' | 'brandstore'
  url: string;
  verificationImageKeys: string[];
}

export interface StoreInfoDto {
  job: JobTicketDto;
  store: StoreDetailDto;
}

// PUT /api/v1/stores/{store_id}/verification-image 인증 이미지 업데이트 요청 (최대 3개)
export interface UpdateVerificationImageRequest {
  imageKeys: string[];
}

// ==========================================================
// 내 스토어 (Users/me)
// ==========================================================
// GET /api/v1/users/me/stores 내 스토어 목록 응답
// 스토어 등록 quota 정보
// - max: 플랜 허용 스토어 수
// - registered: 등록된 스토어 수 (PENDING + ACTIVE + DEACTIVATING)
// - used: 한도 차감 스토어 수 (현재 registered와 동일, 추후 INACTIVE 포함 시 분리)
// - remaining: 남은 등록 가능 수 (max - used)
export interface StoreQuotaDto {
  max: number;
  registered: number;
  used: number;
  remaining: number;
}

// stores: visible 스토어 (REJECTED 포함 / INACTIVE·UNLINKED·DELETED 제외)
// → stores.length ≠ storeQuota.registered. "등록 수" UI는 storeQuota.registered 사용.
export interface MyStoresResponseDto {
  storeQuota: StoreQuotaDto;
  stores: StoreDto[];
}

// PATCH /api/v1/users/me/stores 스토어 벌크 업데이트 요청
export interface UpdateStoresRequest {
  storeIds: number[];
  isDeactivationScheduled?: boolean;
}

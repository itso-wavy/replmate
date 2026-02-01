import type { PlatformType } from '@/types/enums';
import type { StoreDto, StoreReplyOptionsDto } from '@/types/api/store';

/**
 * 스토어 Domain 타입
 * API DTO의 날짜 문자열을 Date 객체로 변환
 */
export interface StoreDomain {
  id: number;
  name: string;
  url: string;
  platform: PlatformType;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt: Date | null;
  lastProductSyncedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 스토어 리플 옵션 Domain 타입
 */
export interface StoreReplyOptionsDomain {
  storeId: number;
  tone: string;
  lengthType: string;
  includeEmoji: boolean;
  brandGuideline: string | null;
  updatedAt: Date;
}

/**
 * 스토어 통계 정보를 포함한 확장 타입
 * 프론트엔드에서 스토어 목록 표시 시 사용
 */
export interface StoreWithStats extends StoreDomain {
  productCount?: number;
  replyCount?: number;
  pendingReviewCount?: number;
}

/**
 * StoreDto를 StoreDomain으로 변환
 * @param dto - API에서 받은 StoreDto
 * @returns StoreDomain 객체
 */
export function toStoreDomain(dto: StoreDto): StoreDomain {
  return {
    id: dto.id,
    name: dto.name,
    url: dto.url,
    platform: dto.platform,
    isActive: dto.isActive,
    isVerified: dto.isVerified,
    verifiedAt: dto.verifiedAt ? new Date(dto.verifiedAt) : null,
    lastProductSyncedAt: dto.lastProductSyncedAt
      ? new Date(dto.lastProductSyncedAt)
      : null,
    createdAt: new Date(dto.createdAt),
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * StoreDto 배열을 StoreDomain 배열로 변환
 * @param dtos - API에서 받은 StoreDto 배열
 * @returns StoreDomain 배열
 */
export function toStoreDomainList(dtos: StoreDto[]): StoreDomain[] {
  return dtos.map(toStoreDomain);
}

/**
 * StoreReplyOptionsDto를 StoreReplyOptionsDomain으로 변환
 * @param dto - API에서 받은 StoreReplyOptionsDto
 * @returns StoreReplyOptionsDomain 객체
 */
export function toStoreReplyOptionsDomain(
  dto: StoreReplyOptionsDto
): StoreReplyOptionsDomain {
  return {
    storeId: dto.storeId,
    tone: dto.tone,
    lengthType: dto.lengthType,
    includeEmoji: dto.includeEmoji,
    brandGuideline: dto.brandGuideline,
    updatedAt: new Date(dto.updatedAt),
  };
}

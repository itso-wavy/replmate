import type {
  StoreDetailDto,
  StoreDto,
  StoreReplyOptionsDto,
} from '@/types/api/store';
import type { StoreStatus } from '@/types/enums';

/**
 * 스토어 Domain 타입 (간소화)
 * 스토어 목록 조회 시 사용
 */
export interface StoreDomain {
  id: number;
  name: string;
  platform: string;
  url: string;
  status: StoreStatus;
}

/**
 * 스토어 상세 Domain 타입
 * 스토어 상세 조회 시 사용
 */
export interface StoreDetailDomain {
  id: number;
  name: string;
  platform: string;
  url: string;
  status: StoreStatus;
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
    platform: dto.platform,
    url: dto.url,
    status: dto.status,
  };
}

/**
 * StoreDetailDto를 StoreDetailDomain으로 변환
 * @param dto - API에서 받은 StoreDetailDto
 * @returns StoreDetailDomain 객체
 */
export function toStoreDetailDomain(dto: StoreDetailDto): StoreDetailDomain {
  return {
    id: dto.id,
    name: dto.name,
    platform: dto.platform,
    url: dto.url,
    status: dto.status,
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

import type {
  MyStoresResponseDto,
  StoreDetailDto,
  StoreDto,
  StoreReplyOptionsDto,
} from '@/types/api/store';
import type { PlatformType, StoreStatus } from '@/types/enums';

/**
 * 스토어 Domain 타입 (간소화)
 * 스토어 목록 조회 시 사용
 */
export interface StoreDomain {
  id: number;
  name: string;
  platform: string;
  platformType: PlatformType | null;
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
  platformType: PlatformType | null;
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
    platformType: dto.platformType,
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
    platformType: dto.platformType,
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
 * 스토어 등록 quota Domain 타입
 * - max: 플랜 허용 스토어 수
 * - registered: 등록된 스토어 수 (PENDING + ACTIVE + DEACTIVATING)
 * - used: 한도 차감 스토어 수 (현재 registered와 동일, 추후 INACTIVE 포함 시 분리)
 * - remaining: 남은 등록 가능 수 (max - used)
 */
export interface StoreQuota {
  max: number;
  registered: number;
  used: number;
  remaining: number;
}

/**
 * 내 스토어 목록 + 쿼터 정보
 * stores 는 visible 스토어 (REJECTED 포함 / INACTIVE·UNLINKED·DELETED 제외).
 * "등록 스토어 수" 표시는 storeQuota.registered 사용 — stores.length 와 다름.
 */
export interface MyStoresResult {
  stores: StoreDomain[];
  storeQuota: StoreQuota;
}

export function toMyStoresResult(dto: MyStoresResponseDto): MyStoresResult {
  return {
    stores: dto.stores.map(toStoreDomain),
    storeQuota: {
      max: dto.storeQuota.max,
      registered: dto.storeQuota.registered,
      used: dto.storeQuota.used,
      remaining: dto.storeQuota.remaining,
    },
  };
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

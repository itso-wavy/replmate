import type { Pagination } from '@/types/api/common';
import type {
  TestUsageQuotaDto,
  UsageLedgerDto,
  UsageQuotaDto,
} from '@/types/api/usage';
import type { UsageEventType } from '@/types/enums';

/**
 * 사용량 쿼터 Domain 타입
 */
export interface UsageQuotaDomain {
  userId: number;
  remaining: number;
  updatedAt: Date;
}

/**
 * 테스트 사용량 쿼터 Domain 타입
 */
export interface TestUsageQuotaDomain {
  userId: number;
  remaining: number;
  updatedAt: Date;
}

/**
 * 사용량 기록 Domain 타입
 */
export interface UsageLedgerDomain {
  id: number;
  eventType: UsageEventType;
  deltaQuantity: number;
  storeId: number | null;
  planId: number | null;
  occurredAt: Date;
  meta: Record<string, unknown> | null;
}

/**
 * 사용량 히스토리 목록 Domain 타입 (페이지네이션 포함)
 */
export type UsageHistoryListDomain = Pagination & {
  items: UsageLedgerDomain[];
};

/**
 * 대시보드용 구독 정보 Domain 타입
 * API 타입과 동일하지만 일관성을 위해 정의
 */
export interface UsageQuotaSubscriptionDomain {
  planName: string;
  updatedAt: Date;
  replyQuotaTotal: number;
  replyQuotaUsed: number;
  storeQuotaTotal: number;
  storeQuotaUsed: number;
}

/**
 * 사용량 상세 정보를 포함한 확장 타입
 * 프론트엔드에서 사용량 분석 화면에 사용
 */
export interface UsageAnalytics {
  totalUsed: number;
  percentUsed: number;
  dailyAverage: number;
  projectedEndDate: Date | null;
  isOverLimit: boolean;
}

/**
 * UsageQuotaDto를 UsageQuotaDomain으로 변환
 * @param dto - API에서 받은 UsageQuotaDto
 * @returns UsageQuotaDomain 객체
 */
export function toUsageQuotaDomain(dto: UsageQuotaDto): UsageQuotaDomain {
  return {
    userId: dto.userId,
    remaining: dto.remaining,
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * TestUsageQuotaDto를 TestUsageQuotaDomain으로 변환
 * @param dto - API에서 받은 TestUsageQuotaDto
 * @returns TestUsageQuotaDomain 객체
 */
export function toTestUsageQuotaDomain(
  dto: TestUsageQuotaDto
): TestUsageQuotaDomain {
  return {
    userId: dto.userId,
    remaining: dto.remaining,
    updatedAt: new Date(dto.updatedAt),
  };
}

/**
 * UsageLedgerDto를 UsageLedgerDomain으로 변환
 * @param dto - API에서 받은 UsageLedgerDto
 * @returns UsageLedgerDomain 객체
 */
export function toUsageLedgerDomain(dto: UsageLedgerDto): UsageLedgerDomain {
  return {
    id: dto.id,
    eventType: dto.eventType,
    deltaQuantity: dto.deltaQuantity,
    storeId: dto.storeId,
    planId: dto.planId,
    occurredAt: new Date(dto.occurredAt),
    meta: dto.meta,
  };
}

/**
 * UsageLedgerDto 배열을 UsageLedgerDomain 배열로 변환
 * @param dtos - API에서 받은 UsageLedgerDto 배열
 * @returns UsageLedgerDomain 배열
 */
export function toUsageLedgerDomainList(
  dtos: UsageLedgerDto[]
): UsageLedgerDomain[] {
  return dtos.map(toUsageLedgerDomain);
}

/**
 * UsageQuotaSubscription을 UsageQuotaSubscriptionDomain으로 변환
 * @param dto - API에서 받은 UsageQuotaSubscription
 * @returns UsageQuotaSubscriptionDomain 객체
 */
// FIXME:
export function toUsageQuotaSubscriptionDomain(
  dto: any
): UsageQuotaSubscriptionDomain {
  return {
    planName: dto.planName,
    updatedAt: new Date(dto.updatedAt),
    replyQuotaTotal: dto.replyQuotaTotal,
    replyQuotaUsed: dto.replyQuotaUsed,
    storeQuotaTotal: dto.storeQuotaTotal,
    storeQuotaUsed: dto.storeQuotaUsed,
  };
}

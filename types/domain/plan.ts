import type { PlanDto } from '@/types/api/plan';

/**
 * 플랜 Domain 타입
 */
export interface PlanDomain {
  id: number;
  name: string;
  title: string | null;
  description: string | null;
  monthlyPrice: number;
  currency: string;
  monthlyReplyQuota: number;
  maxStoreCount: number;
  maxProductPerStore: number;
  maxTestPerDay: number;
}

/**
 * PlanDto를 PlanDomain으로 변환
 * @param dto - API에서 받은 PlanDto
 * @returns PlanDomain 객체
 */
export function toPlanDomain(dto: PlanDto): PlanDomain {
  return {
    id: dto.id,
    name: dto.name,
    title: dto.title,
    description: dto.description,
    monthlyPrice: dto.monthlyPrice,
    currency: dto.currency,
    monthlyReplyQuota: dto.monthlyReplyQuota,
    maxStoreCount: dto.maxStoreCount,
    maxProductPerStore: dto.maxProductPerStore,
    maxTestPerDay: dto.maxTestPerDay,
  };
}

/**
 * PlanDto 배열을 PlanDomain 배열로 변환
 * @param dtos - API에서 받은 PlanDto 배열
 * @returns PlanDomain 배열
 */
export function toPlanDomainList(dtos: PlanDto[]): PlanDomain[] {
  return dtos.map(toPlanDomain);
}

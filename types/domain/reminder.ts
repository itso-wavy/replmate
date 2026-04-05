import type { ReminderDto } from '@/types/api/reminder';
import type {
  ReminderCategory,
  ReminderEvent,
  ReminderLevel,
  ReminderMeta,
} from '@/types/enums';

/**
 * 리마인더 Domain 타입
 * API DTO의 날짜 문자열을 Date 객체로 변환
 */
export interface ReminderDomain {
  id: number;
  category: ReminderCategory;
  event: ReminderEvent;
  level: ReminderLevel;
  title: string;
  message: string;
  meta: ReminderMeta;
  createdAt: Date;
}

/**
 * ReminderDto를 ReminderDomain으로 변환
 * @param dto - API에서 받은 ReminderDto
 * @returns ReminderDomain 객체
 */
export function toReminderDomain(dto: ReminderDto): ReminderDomain {
  return {
    id: dto.id,
    category: dto.category,
    event: dto.event,
    level: dto.level,
    title: dto.title,
    message: dto.message,
    meta: dto.meta,
    createdAt: new Date(dto.createdAt),
  };
}

/**
 * ReminderDto 배열을 ReminderDomain 배열로 변환
 * @param dtos - API에서 받은 ReminderDto 배열
 * @returns ReminderDomain 배열
 */
export function toReminderDomainList(dtos: ReminderDto[]): ReminderDomain[] {
  return dtos.map(toReminderDomain);
}

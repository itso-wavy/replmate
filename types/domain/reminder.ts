import type {
  ReminderCategory,
  ReminderEvent,
  ReminderLevel,
} from '@/types/enums';
import type { ReminderDto } from '@/types/api/reminder';

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
  meta: Record<string, unknown>;
  createdAt: Date;
}

/**
 * 읽음 상태를 포함한 리마인더 확장 타입
 * 프론트엔드에서 알림 목록 표시 시 사용
 */
export interface ReminderWithReadStatus extends ReminderDomain {
  isRead?: boolean;
  readAt?: Date;
}

/**
 * 그룹화된 리마인더 타입
 * 프론트엔드에서 카테고리별로 리마인더를 그룹화하여 표시할 때 사용
 */
export interface GroupedReminders {
  category: ReminderCategory;
  reminders: ReminderDomain[];
  unreadCount: number;
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

/**
 * 리마인더를 카테고리별로 그룹화
 * @param reminders - ReminderDomain 배열
 * @returns GroupedReminders 배열
 */
export function groupRemindersByCategory(
  reminders: ReminderWithReadStatus[]
): GroupedReminders[] {
  const grouped = reminders.reduce(
    (acc, reminder) => {
      const category = reminder.category;
      if (!acc[category]) {
        acc[category] = {
          category,
          reminders: [],
          unreadCount: 0,
        };
      }
      acc[category].reminders.push(reminder);
      if (!reminder.isRead) {
        acc[category].unreadCount++;
      }
      return acc;
    },
    {} as Record<ReminderCategory, GroupedReminders>
  );

  return Object.values(grouped);
}

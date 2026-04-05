import type {
  ReminderCategory,
  ReminderEvent,
  ReminderLevel,
  ReminderMeta,
} from '../enums';

// ==========================================================
// 알림 (Reminders)
// ==========================================================

// GET /api/v1/reminders 리마인더 목록 조회
export interface ReminderDto {
  id: number;
  category: ReminderCategory;
  event: ReminderEvent;
  level: ReminderLevel;
  title: string;
  message: string;
  meta: ReminderMeta;
  createdAt: string;
}

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

// GET /api/v1/reminders/stream SSE 메시지
// 메시지 형식: data: {"event": "reminder.created", "data": {...}}
export type ReminderStreamEventType =
  | 'reminder.created'
  | 'reminder.deleted'
  | 'reminder.cleared';

export interface ReminderCreatedMessage {
  event: 'reminder.created';
  data: ReminderDto;
}

// reminder_id 단건 또는 event/events 매칭으로 삭제
export interface ReminderDeletedMessage {
  event: 'reminder.deleted';
  data: {
    reminderId?: number;
    event?: ReminderEvent;
    events?: ReminderEvent[];
  };
}

export interface ReminderClearedMessage {
  event: 'reminder.cleared';
  data?: Record<string, never>;
}

export type ReminderStreamMessage =
  | ReminderCreatedMessage
  | ReminderDeletedMessage
  | ReminderClearedMessage;

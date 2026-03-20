import { api } from '@/lib/api';
import { REMINDER_ENDPOINTS } from '@/lib/endpoints';
import type { ReminderDto } from '@/types/api/reminder';
import type { ReminderCategory, ReminderLevel } from '@/types/enums';
import {
  ReminderDomain,
  toReminderDomainList,
} from '@/types/domain/reminder';

/**
 * 리마인더 목록 조회
 * GET /api/v1/reminders?category=plan&level=INFO
 */
export async function getReminders(params?: {
  category?: ReminderCategory;
  level?: ReminderLevel;
}): Promise<ReminderDomain[]> {
  const response = await api.get<ReminderDto[]>(
    REMINDER_ENDPOINTS.GET_REMINDERS,
    { params }
  );
  return toReminderDomainList(response.data);
}

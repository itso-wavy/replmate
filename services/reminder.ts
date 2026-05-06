import { api } from '@/lib/api';
import { REMINDER_ENDPOINTS } from '@/lib/endpoints';
import type { ReminderDto } from '@/types/api/reminder';
import { ReminderDomain, toReminderDomainList } from '@/types/domain/reminder';
import type { ReminderCategory, ReminderLevel } from '@/types/enums';

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

/**
 * 리마인더 SSE 스트림 구독
 * GET /api/v1/reminders/stream
 * 세션 쿠키 인증 (withCredentials: true)
 * 30초마다 keepalive 라인 자동 무시 (SSE 주석)
 * 끊기면 EventSource가 자동 재연결, catch-up은 호출 측에서 GET /reminders로 보완
 */
export function streamReminders(): EventSource {
  return new EventSource(REMINDER_ENDPOINTS.STREAM_REMINDERS, {
    withCredentials: true,
  });
}

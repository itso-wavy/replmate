import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getReminders } from '@/services/reminder';
import type { ReminderCategory, ReminderLevel } from '@/types/enums';

interface UseRemindersParams {
  category?: ReminderCategory;
  level?: ReminderLevel;
}

/**
 * 리마인더 목록 조회
 *
 * SSE 스트림(`useReminderStream`)이 실시간 갱신을 담당하므로,
 * 본 쿼리는 초기 로드 + 재연결 시 catch-up 용도로만 동작한다.
 * - staleTime: Infinity → window focus 등으로 자동 refetch 방지
 * - SSE onerror 또는 명시적 invalidateQueries 시에만 재조회
 */
export const useReminders = (params?: UseRemindersParams) =>
  useQuery({
    queryKey: queryKeys.reminders.list(params),
    queryFn: () => getReminders(params),
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { streamReminders } from '@/services/reminder';
import { UserStore } from '@/store/userStore';
import type { ReminderStreamMessage } from '@/types/api/reminder';
import {
  ReminderDomain,
  toReminderDomain,
} from '@/types/domain/reminder';

/**
 * 리마인더 SSE 구독 훅
 *
 * - 인증된 사용자에 한해 EventSource로 `/api/v1/reminders/stream` 구독
 * - 메시지 수신 시 react-query 캐시(`queryKeys.reminders`)를 직접 갱신
 *   - reminder.created → 캐시 prepend
 *   - reminder.deleted → reminderId / event / events 매칭 항목 제거
 *   - reminder.cleared → 빈 배열로 초기화
 * - 끊기면 EventSource가 자동 재연결하며, catch-up 보완을 위해 onerror 시
 *   reminders 쿼리를 invalidate (재연결 직후 GET /reminders로 재조회)
 * - 언마운트/로그아웃 시 EventSource.close()
 */
export function useReminderStream() {
  const queryClient = useQueryClient();
  const isAuthenticated = UserStore.useIsAuthenticated();

  useEffect(() => {
    if (!isAuthenticated) return;

    const eventSource = streamReminders();

    const updateAllReminderCaches = (
      updater: (prev: ReminderDomain[]) => ReminderDomain[]
    ) => {
      queryClient.setQueriesData<ReminderDomain[]>(
        { queryKey: queryKeys.reminders.all() },
        (prev) => updater(prev ?? [])
      );
    };

    const handleMessage = (e: MessageEvent) => {
      let payload: ReminderStreamMessage;
      try {
        payload = JSON.parse(e.data) as ReminderStreamMessage;
      } catch {
        return;
      }

      switch (payload.event) {
        case 'reminder.created': {
          const created = toReminderDomain(payload.data);
          updateAllReminderCaches((prev) => {
            if (prev.some((r) => r.id === created.id)) return prev;
            return [created, ...prev];
          });
          break;
        }

        case 'reminder.deleted': {
          const { reminderId, event, events } = payload.data;
          const eventSet = new Set(events ?? (event ? [event] : []));
          updateAllReminderCaches((prev) =>
            prev.filter((r) => {
              if (reminderId !== undefined && r.id === reminderId) return false;
              if (eventSet.size > 0 && eventSet.has(r.event)) return false;
              return true;
            })
          );
          break;
        }

        case 'reminder.cleared': {
          updateAllReminderCaches(() => []);
          break;
        }
      }
    };

    const handleError = () => {
      // EventSource는 자동 재연결. 끊긴 동안 누락된 이벤트 보완용 재조회
      queryClient.invalidateQueries({ queryKey: queryKeys.reminders.all() });
    };

    eventSource.addEventListener('message', handleMessage);
    eventSource.addEventListener('error', handleError);

    return () => {
      eventSource.removeEventListener('message', handleMessage);
      eventSource.removeEventListener('error', handleError);
      eventSource.close();
    };
  }, [isAuthenticated, queryClient]);
}

import { useMemo } from 'react';

import { toAlert } from '@/constants/alerts';
import { useReminders } from '@/hooks/useReminders';
import type { Alert } from '@/types/domain/alert';

/**
 * 서버 리마인더를 Alert로 변환하는 훅.
 */
export function useAlerts(): Alert[] {
  const { data: reminders = [] } = useReminders();

  return useMemo<Alert[]>(
    () =>
      reminders.flatMap((r) => {
        const alert = toAlert(r);
        return alert ? [alert] : [];
      }),
    [reminders]
  );
}

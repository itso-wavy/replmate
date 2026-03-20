import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getReminders } from '@/services/reminder';
import type { ReminderCategory, ReminderLevel } from '@/types/enums';

interface UseRemindersParams {
  category?: ReminderCategory;
  level?: ReminderLevel;
}

export const useReminders = (params?: UseRemindersParams) =>
  useQuery({
    queryKey: queryKeys.reminders.list(params),
    queryFn: () => getReminders(params),
  });

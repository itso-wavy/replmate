import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import {
  getNotificationSettings,
  getUser,
  getUserPlan,
  updateNotificationSettings,
} from '@/services/user';
export const useUser = () =>
  useQuery({
    queryKey: queryKeys.user.me(),
    queryFn: getUser,
  });

export const useUserPlan = () =>
  useQuery({
    queryKey: queryKeys.user.plan(),
    queryFn: getUserPlan,
  });

export const useNotificationSettings = () =>
  useQuery({
    queryKey: queryKeys.user.notifications(),
    queryFn: getNotificationSettings,
  });

export const useUpdateNotificationSettings = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: Partial<{ emailEnabled: boolean; smsEnabled: boolean }>) =>
      updateNotificationSettings(settings),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.user.notifications() }),
  });
};

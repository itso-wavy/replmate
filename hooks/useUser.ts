import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import {
  agreeTerms,
  cancelPlan,
  changePlan,
  deleteUser,
  getNotificationSettings,
  getUser,
  getUserPlan,
  reactivatePlan,
  requestReceipt,
  updateNotificationSettings,
  verifyIdentity,
} from '@/services/user';
import { UserStore } from '@/store/userStore';
import type { DeleteUserRequest } from '@/types/api/user';
import { VerifyIdentityProvider } from '@/types/enums';

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

export const useDeleteUser = () =>
  useMutation({
    mutationFn: (data: DeleteUserRequest) => deleteUser(data),
  });

export const useChangePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (planId: number) => changePlan(planId),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useCancelPlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: cancelPlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useReactivatePlan = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: reactivatePlan,
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.plan() }),
  });
};

export const useRequestReceipt = () =>
  useMutation({
    mutationFn: requestReceipt,
  });

export const useAgreeTerms = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (termsIds: number[]) => agreeTerms(termsIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.user.me() }),
  });
};

export const useVerifyIdentity = () => {
  const qc = useQueryClient();
  const { setUser } = UserStore.useActions();
  return useMutation({
    mutationFn: (provider?: VerifyIdentityProvider) => verifyIdentity(provider),
    onSuccess: async () => {
      const updatedUser = await getUser();
      setUser(updatedUser);
      qc.invalidateQueries({ queryKey: queryKeys.user.me() });
    },
  });
};

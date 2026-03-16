import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import {
  deleteStore,
  getMyStores,
  getPlatforms,
  getReplyOptions,
  getStoreDetail,
  updateReplyOptions,
  updateStore,
} from '@/services/store';
import type { UpdateStoreRequest } from '@/types/api/store';

export const useMyStores = () =>
  useQuery({
    queryKey: queryKeys.stores.list(),
    queryFn: getMyStores,
  });

export const useStoreDetail = (storeId: number) =>
  useQuery({
    queryKey: queryKeys.stores.detail(storeId),
    queryFn: () => getStoreDetail(storeId),
    enabled: !!storeId,
  });

export const usePlatforms = () =>
  useQuery({
    queryKey: queryKeys.stores.platforms(),
    queryFn: getPlatforms,
    staleTime: Infinity, // 플랫폼 목록은 자주 변경되지 않음
  });

export const useReplyOptions = (storeId: number) =>
  useQuery({
    queryKey: queryKeys.stores.replyOptions(storeId),
    queryFn: () => getReplyOptions(storeId),
    enabled: !!storeId,
  });

export const useUpdateStore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      storeId,
      data,
    }: {
      storeId: number;
      data: UpdateStoreRequest;
    }) => updateStore(storeId, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.stores.all() }),
  });
};

export const useDeleteStore = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (storeId: number) => deleteStore(storeId),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: queryKeys.stores.list() }),
  });
};

export const useUpdateReplyOptions = (storeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (
      options: Partial<{
        tone: string;
        lengthType: string;
        includeEmoji: boolean;
        brandGuideline: string | null;
      }>
    ) => updateReplyOptions(storeId, options),
    onSuccess: () =>
      qc.invalidateQueries({
        queryKey: queryKeys.stores.replyOptions(storeId),
      }),
  });
};

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import {
  getProductDetail,
  getProducts,
  getUserProductQuota,
  updateProduct,
} from '@/services/product';

export const useProducts = (
  storeId: number,
  params?: { page?: number; size?: number }
) =>
  useQuery({
    queryKey: queryKeys.products.list(storeId, params),
    queryFn: () => getProducts(storeId, params),
    enabled: !!storeId,
  });

export const useProductDetail = (productId: number) =>
  useQuery({
    queryKey: queryKeys.products.detail(productId),
    queryFn: () => getProductDetail(productId),
    enabled: !!productId,
  });

export const useUserProductQuota = () =>
  useQuery({
    queryKey: queryKeys.products.userQuota(),
    queryFn: getUserProductQuota,
  });

export const useUpdateProduct = (storeId: number) => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: number;
      data: Partial<{ isTarget: boolean }>;
    }) => updateProduct(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.products.all() });
      qc.invalidateQueries({ queryKey: queryKeys.products.userQuota() });
    },
  });
};

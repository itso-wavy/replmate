import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getPlans } from '@/services/plan';

export const usePlans = (includeFree?: boolean) =>
  useQuery({
    queryKey: queryKeys.plans.list(includeFree),
    queryFn: () => getPlans(includeFree),
  });

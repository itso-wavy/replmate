import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getTermsByType, getTermsList } from '@/services/terms';
import type { TermsType } from '@/types/enums';

export const useTermsList = () =>
  useQuery({
    queryKey: queryKeys.terms.list(),
    queryFn: getTermsList,
    staleTime: Infinity, // 약관은 자주 변경되지 않음
  });

export const useTermsByType = (type: TermsType) =>
  useQuery({
    queryKey: queryKeys.terms.byType(type),
    queryFn: () => getTermsByType(type),
    staleTime: Infinity,
  });

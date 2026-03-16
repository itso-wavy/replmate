import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/queryKeys';
import { getReplies, testReply } from '@/services/reply';
import type { CreateTestReplyRequest } from '@/types/api/reply';
import type { ReplyStatus } from '@/types/enums';

interface UseRepliesParams {
  storeId: number;
  reviewId?: number;
  status?: ReplyStatus;
  todayOnly?: boolean;
  page?: number;
  size?: number;
}

export const useReplies = (params: UseRepliesParams) =>
  useQuery({
    queryKey: queryKeys.replies.list(params),
    queryFn: () => getReplies(params),
    enabled: !!params.storeId,
  });

export const useTestReply = () =>
  useMutation({
    mutationFn: (data: CreateTestReplyRequest) => testReply(data),
  });

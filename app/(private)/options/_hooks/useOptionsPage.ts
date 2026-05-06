'use client';

import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import {
  useReplyOptions,
  useTestQuota,
  useTestReply,
  useUpdateReplyOptions,
} from '@/hooks';
import { queryKeys } from '@/lib/queryKeys';
import { streamJob } from '@/services';
import { NavigationGuardStore } from '@/store/navigationGuardStore';
import { StoreStore } from '@/store/storeStore';
import { ReplyLength, ReplyTone } from '@/types';
import type { TestReplyDto } from '@/types/api/reply';

interface TestReplyJobResult {
  result: TestReplyDto | null;
}

export type OptionsModalType = 'unsavedChanges' | null;

export interface OptionsState {
  replyTone: ReplyTone;
  length: ReplyLength;
  includeEmoji: boolean;
  brandGuideline: string;
}

const DEFAULT_OPTIONS: OptionsState = {
  replyTone: ReplyTone.AUTO,
  length: ReplyLength.AUTO,
  includeEmoji: false,
  brandGuideline: '',
};

const TEST_REVIEW_PLACEHOLDER = '배송 너무 느려서 불편했어요.';

export function useOptionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { setSelectedStore } = StoreStore.useActions();

  // --- 데이터 조회 ---
  const {
    data: replyOptions,
    isLoading: isOptionsLoading,
    isError: isOptionsError,
  } = useReplyOptions(selectedStoreId ?? 0);
  const { data: testQuota, isLoading: isQuotaLoading } = useTestQuota(
    selectedStoreId ?? 0
  );

  // --- 옵션 상태 ---
  const [options, setOptions] = useState<OptionsState>(DEFAULT_OPTIONS);

  // 서버 데이터 → 로컬 상태 동기화
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  useEffect(() => {
    if (!replyOptions) return;
    const next: OptionsState = {
      replyTone: (replyOptions.tone as ReplyTone) || DEFAULT_OPTIONS.replyTone,
      length:
        (replyOptions.lengthType as ReplyLength) || DEFAULT_OPTIONS.length,
      includeEmoji: replyOptions.includeEmoji ?? DEFAULT_OPTIONS.includeEmoji,
      brandGuideline:
        replyOptions.brandGuideline ?? DEFAULT_OPTIONS.brandGuideline,
    };
    setOptions(next);
    setLastSaved(replyOptions.updatedAt);
    setInitialSnapshot(JSON.stringify(next));
  }, [replyOptions]);

  // --- AI 미리보기 상태 ---
  const [testReview, setTestReview] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // --- dirty 체크 ---
  const isDirty =
    initialSnapshot !== '' && JSON.stringify(options) !== initialSnapshot;

  // --- 모달 ---
  const [activeModal, setActiveModal] = useState<OptionsModalType>(null);
  const pendingStoreIdRef = useRef<number | null>(null);

  // --- mutations ---
  const { mutateAsync: updateOptions, isPending: isSaving } =
    useUpdateReplyOptions(selectedStoreId ?? 0);
  const { mutateAsync: createTestReply } = useTestReply();

  // --- 저장 ---
  const performSave = useCallback(async () => {
    const result = await updateOptions({
      tone: options.replyTone,
      lengthType: options.length,
      includeEmoji: options.includeEmoji,
      brandGuideline: options.brandGuideline || null,
    });
    setLastSaved(result.updatedAt);
    setInitialSnapshot(JSON.stringify(options));
  }, [options, updateOptions]);

  const handleSave = async () => {
    if (!selectedStoreId) {
      toast.error('쇼핑몰을 먼저 선택해 주세요.');
      return;
    }
    try {
      await performSave();
      toast.success('저장이 완료되었습니다.');
    } catch {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  // --- AI 리플 생성 ---
  const previewRemaining = testQuota?.remaining ?? 0;

  const handleGenerate = async () => {
    if (previewRemaining <= 0) {
      toast.error(`일일 테스트 횟수를 모두 소진했습니다.`);
      return;
    }
    if (isGenerating) return;

    setIsGenerating(true);
    setGeneratedReply('');

    const review = testReview.trim() || TEST_REVIEW_PLACEHOLDER;

    try {
      const jobTicket = await createTestReply({
        storeId: selectedStoreId!,
        review,
        tone: options.replyTone,
        lengthType: options.length,
        includeEmoji: options.includeEmoji,
        guideline: options.brandGuideline || undefined,
      });

      // SSE로 Job 결과 수신
      const es = streamJob(jobTicket.jobId);

      es.addEventListener('complete', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data) as TestReplyJobResult;
          setGeneratedReply(data.result?.aiText ?? '');
        } catch {
          setGeneratedReply('');
        }
        es.close();
        setIsGenerating(false);
        queryClient.invalidateQueries({
          queryKey: queryKeys.usage.testQuota(selectedStoreId!),
        });
      });

      es.addEventListener('error', () => {
        es.close();
        setIsGenerating(false);
        toast.error(
          '일시적인 오류로 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        );
        return;
      });
    } catch {
      setIsGenerating(false);
      toast.error(
        '일시적인 오류로 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.'
      );
    }
  };

  // --- 네비게이션 가드 ---
  const pendingUrl = NavigationGuardStore.usePendingUrl();
  const { setGuard, clearGuard, clearPending } =
    NavigationGuardStore.useActions();

  useEffect(() => {
    setGuard(isDirty, performSave);
  }, [isDirty, performSave, setGuard]);

  useEffect(() => {
    return () => clearGuard();
  }, [clearGuard]);

  useEffect(() => {
    if (pendingUrl && isDirty) {
      setActiveModal('unsavedChanges');
    }
  }, [pendingUrl, isDirty]);

  // 브라우저 탭 이탈/새로고침 가드
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // --- 스토어 전환 가드 ---
  const handleStoreChange = (storeId: number) => {
    if (isDirty) {
      pendingStoreIdRef.current = storeId;
      setActiveModal('unsavedChanges');
      return;
    }
    setSelectedStore(storeId);
  };

  // 스토어 전환 시 초기화
  useEffect(() => {
    setTestReview('');
    setGeneratedReply('');
  }, [selectedStoreId]);

  // --- UnsavedChangesModal 콜백 ---
  const handleLeaveWithoutSaving = () => {
    setActiveModal(null);
    if (pendingStoreIdRef.current !== null) {
      setSelectedStore(pendingStoreIdRef.current);
      pendingStoreIdRef.current = null;
      return;
    }
    if (pendingUrl) {
      const url = pendingUrl;
      clearPending();
      clearGuard();
      router.push(url);
    }
  };

  const handleSaveAndLeave = async () => {
    if (!selectedStoreId) {
      toast.error('쇼핑몰을 먼저 선택해 주세요.');
      return;
    }

    try {
      await performSave();
      toast.success('저장이 완료되었습니다.');
      setActiveModal(null);
      if (pendingStoreIdRef.current !== null) {
        setSelectedStore(pendingStoreIdRef.current);
        pendingStoreIdRef.current = null;
        return;
      }
      if (pendingUrl) {
        const url = pendingUrl;
        clearPending();
        clearGuard();
        router.push(url);
      }
    } catch {
      toast.error('저장에 실패했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  return {
    // 스토어
    handleStoreChange,

    // 옵션 상태
    options,
    setOptions,

    // 미리보기
    testReview,
    setTestReview,
    testReviewPlaceholder: TEST_REVIEW_PLACEHOLDER,
    generatedReply,
    isGenerating,
    previewRemaining,
    handleGenerate,

    // 저장
    lastSaved,
    isSaving,
    handleSave,

    // 모달 & 가드
    activeModal,
    closeModal: () => setActiveModal(null),
    handleLeaveWithoutSaving,
    handleSaveAndLeave,

    // 상태
    isLoading: isOptionsLoading || isQuotaLoading,
    isError: isOptionsError,
  };
}

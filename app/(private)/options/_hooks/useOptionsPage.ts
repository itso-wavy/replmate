'use client';

import { useRouter } from 'next/navigation';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { toast } from 'sonner';

import { useTestReply } from '@/hooks/useReplies';
import {
  useMyStores,
  useReplyOptions,
  useUpdateReplyOptions,
} from '@/hooks/useStores';
import { useTestQuota } from '@/hooks/useUsage';
import { queryKeys } from '@/lib/queryKeys';
import { getActiveStoreList } from '@/lib/utils';
import { streamJob } from '@/services/job';
import { NavigationGuardStore } from '@/store/navigationGuardStore';
import { StoreStore } from '@/store/storeStore';
import { ReplyLength, ReplyTone } from '@/types';

export type OptionsModalType = 'unsavedChanges' | null;

const DEFAULT_OPTIONS = {
  replyTone: ReplyTone.AUTO,
  length: ReplyLength.AUTO,
  includeEmoji: false,
  brandGuideline: '',
  testReviewPlaceholder: '배송 너무 느려서 불편했어요.',
};

export function useOptionsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const selectedStoreId = StoreStore.useSelectedStoreId();
  const { setSelectedStore } = StoreStore.useActions();

  // --- 데이터 조회 ---
  const { data: myStoresData } = useMyStores();
  const stores = myStoresData?.stores ?? [];
  const activeStores = useMemo(() => getActiveStoreList(stores), [stores]);
  const hasStores = activeStores.length > 0;

  const { data: replyOptions, isLoading: isOptionsLoading } = useReplyOptions(
    selectedStoreId ?? 0
  );
  const { data: testQuota, isLoading: isQuotaLoading } = useTestQuota(
    selectedStoreId ?? 0
  );

  // --- 옵션 상태 ---
  const [replyTone, setReplyTone] = useState<ReplyTone>(
    DEFAULT_OPTIONS.replyTone
  );
  const [length, setLength] = useState<ReplyLength>(DEFAULT_OPTIONS.length);
  const [includeEmoji, setIncludeEmoji] = useState(
    DEFAULT_OPTIONS.includeEmoji
  );
  const [brandGuideline, setBrandGuideline] = useState(
    DEFAULT_OPTIONS.brandGuideline
  );

  // 서버 데이터 → 로컬 상태 동기화
  const [initialSnapshot, setInitialSnapshot] = useState<string>('');

  useEffect(() => {
    if (!replyOptions) return;
    const tone = (replyOptions.tone as ReplyTone) || DEFAULT_OPTIONS.replyTone;
    const len =
      (replyOptions.lengthType as ReplyLength) || DEFAULT_OPTIONS.length;
    const emoji = replyOptions.includeEmoji ?? DEFAULT_OPTIONS.includeEmoji;
    const guideline =
      replyOptions.brandGuideline ?? DEFAULT_OPTIONS.brandGuideline;

    setReplyTone(tone);
    setLength(len);
    setIncludeEmoji(emoji);
    setBrandGuideline(guideline);
    setLastSaved(replyOptions.updatedAt);
    setInitialSnapshot(JSON.stringify({ tone, len, emoji, guideline }));
  }, [replyOptions]);

  // --- AI 미리보기 상태 ---
  const [testReview, setTestReview] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // --- dirty 체크 ---
  const currentSnapshot = useMemo(
    () =>
      JSON.stringify({
        tone: replyTone,
        len: length,
        emoji: includeEmoji,
        guideline: brandGuideline,
      }),
    [replyTone, length, includeEmoji, brandGuideline]
  );
  const isDirty = initialSnapshot !== '' && currentSnapshot !== initialSnapshot;

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
      tone: replyTone,
      lengthType: length,
      includeEmoji,
      brandGuideline: brandGuideline || null,
    });
    setLastSaved(result.updatedAt);
    setInitialSnapshot(currentSnapshot);
  }, [
    replyTone,
    length,
    includeEmoji,
    brandGuideline,
    currentSnapshot,
    updateOptions,
  ]);

  const handleSave = async () => {
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

    const review = testReview.trim() || DEFAULT_OPTIONS.testReviewPlaceholder;

    try {
      const jobTicket = await createTestReply({
        storeId: selectedStoreId!,
        review,
        tone: replyTone,
        lengthType: length,
        includeEmoji,
        guideline: brandGuideline || undefined,
      });

      // SSE로 Job 결과 수신
      const es = streamJob(jobTicket.jobId);

      es.addEventListener('complete', (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data);
          setGeneratedReply(data.result?.aiText ?? data.result?.text ?? '');
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
      });

      es.onerror = () => {
        es.close();
        setIsGenerating(false);
        toast.error(
          '일시적인 오류로 생성에 실패했습니다. 잠시 후 다시 시도해 주세요.'
        );
      };
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
    hasStores,
    handleStoreChange,

    // 옵션 상태
    replyTone,
    setReplyTone,
    length,
    setLength,
    includeEmoji,
    setIncludeEmoji,
    brandGuideline,
    setBrandGuideline,

    // 미리보기
    testReview,
    setTestReview,
    testReviewPlaceholder: DEFAULT_OPTIONS.testReviewPlaceholder,
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
    setActiveModal,
    isDirty,
    handleLeaveWithoutSaving,
    handleSaveAndLeave,

    // 로딩
    isLoading: isOptionsLoading || isQuotaLoading,
  };
}

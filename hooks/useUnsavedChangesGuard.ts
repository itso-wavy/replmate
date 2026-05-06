'use client';

import { useCallback, useEffect, useRef } from 'react';

interface Options {
  isDirty: boolean;
  onBack: () => void; // 뒤로가기 감지 시 호출 (모달 표시)
}

export function useUnsavedChangesGuard({ isDirty, onBack }: Options) {
  const isDirtyRef = useRef(isDirty);
  const dummyPushedRef = useRef(false);
  const prevDirtyRef = useRef(false);
  const isBackPendingRef = useRef(false);

  // onBack 최신값 ref (effect deps 안정화용)
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  });

  // isDirty 최신값 ref
  useEffect(() => {
    isDirtyRef.current = isDirty;
  }, [isDirty]);

  // popstate 가드 + 더미 push
  useEffect(() => {
    if (!isDirty) return;

    window.history.pushState(null, '', window.location.href);
    dummyPushedRef.current = true;

    const handler = () => {
      if (!isDirtyRef.current) return;
      window.history.pushState(null, '', window.location.href);
      isBackPendingRef.current = true;
      onBackRef.current();
    };

    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
  }, [isDirty]);

  // dirty 전환 감지 → 더미 자동 정리
  useEffect(() => {
    const wasDirty = prevDirtyRef.current;
    prevDirtyRef.current = isDirty;

    if (wasDirty && !isDirty && dummyPushedRef.current) {
      dummyPushedRef.current = false;
      isDirtyRef.current = false;
      window.history.back();
    }
  }, [isDirty]);

  // 새로고침/탭 닫기 가드
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

  // 뒤로가기 leave 실행 — 더미 + 실제 한 칸 = go(-2)
  const leaveBack = useCallback(() => {
    isBackPendingRef.current = false;
    isDirtyRef.current = false;
    dummyPushedRef.current = false;
    window.history.go(-2);
  }, []);

  // 저장 후 leaveBack 호출 전 자동정리 effect 무력화
  const prepareSaveLeaveBack = useCallback(() => {
    dummyPushedRef.current = false;
  }, []);

  // 모달 X 닫을 때 ref 정리
  const resetBackPending = useCallback(() => {
    isBackPendingRef.current = false;
  }, []);

  return {
    isBackPendingRef,
    leaveBack,
    prepareSaveLeaveBack,
    resetBackPending,
  };
}

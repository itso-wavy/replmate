'use client';

import { useEffect, useRef, useState } from 'react';

interface UseActiveSectionOptions {
  sectionIds: string[];
  headerHeight?: number;
  debounceMs?: number;
  syncHash?: boolean;
}

/**
 * 스크롤 위치에 따라 현재 가장 많이 보이는 섹션을 감지하는 훅
 *
 * @param options.sectionIds - 감지할 섹션 ID 배열
 * @param options.headerHeight - sticky 헤더 높이 (기본값: 68)
 * @param options.debounceMs - 디바운스 시간 (기본값: 100)
 * @param options.syncHash - URL hash 동기화 여부 (기본값: true)
 */
export const useActiveSection = ({
  sectionIds,
  headerHeight = 68,
  debounceMs = 100,
  syncHash = false,
}: UseActiveSectionOptions) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    /**
     * 모든 섹션의 가시 면적을 계산하여 가장 많이 보이는 섹션 반환
     */
    const calculateMostVisibleSection = (): string | null => {
      const viewportHeight = window.innerHeight;
      const effectiveViewportHeight = viewportHeight - headerHeight;

      let maxRatio = 0;
      let maxId: string | null = null;

      sectionIds.forEach((id) => {
        const element = document.getElementById(id);
        if (!element) return;

        const rect = element.getBoundingClientRect();

        // 유효 뷰포트 내에서 보이는 영역 계산
        const visibleTop = Math.max(rect.top, headerHeight);
        const visibleBottom = Math.min(rect.bottom, viewportHeight);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const ratio = visibleHeight / effectiveViewportHeight;

        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxId = id;
        }
      });

      return maxId;
    };

    // Observer 설정 (트리거 역할)
    observerRef.current = new IntersectionObserver(
      () => {
        // 디바운싱
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
          const newActiveId = calculateMostVisibleSection();

          if (newActiveId && newActiveId !== activeId) {
            setActiveId(newActiveId);

            // URL hash 동기화
            if (syncHash && typeof window !== 'undefined') {
              window.history.replaceState(
                null,
                '',
                `${window.location.pathname}${window.location.search}#${newActiveId}`
              );
            }
          }
        }, debounceMs);
      },
      {
        threshold: [0, 0.5, 1],
      }
    );

    // 모든 섹션 관찰
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observerRef.current?.observe(element);
    });

    // Cleanup
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      observerRef.current?.disconnect();
    };
  }, [sectionIds, headerHeight, debounceMs, syncHash, activeId]);

  return activeId;
};

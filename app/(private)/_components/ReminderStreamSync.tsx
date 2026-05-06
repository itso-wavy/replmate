'use client';

import { useReminderStream } from '@/hooks/useReminderStream';

/**
 * 인증된 영역에서 리마인더 SSE 스트림을 마운트하는 동기화 컴포넌트.
 * 자체 렌더링 없음 — useEffect 사이클로 EventSource 수명 관리.
 */
function ReminderStreamSync() {
  useReminderStream();
  return null;
}

export default ReminderStreamSync;

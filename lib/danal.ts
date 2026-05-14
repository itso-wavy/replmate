import type { DanalAuthResponseDto } from '@/types/api/payment';

export const DANAL_POPUP_NAME = 'danal-popup';
const DANAL_POPUP_WIDTH = 800;
const DANAL_POPUP_HEIGHT = 500;

export function openDanalPopup(): Window | null {
  const left = Math.max(
    0,
    Math.floor((window.screen.width - DANAL_POPUP_WIDTH) / 2)
  );
  const top = Math.max(
    0,
    Math.floor((window.screen.height - DANAL_POPUP_HEIGHT) / 2)
  );
  const features = `width=${DANAL_POPUP_WIDTH},height=${DANAL_POPUP_HEIGHT},left=${left},top=${top},scrollbars=yes,resizable=yes`;
  return window.open('', DANAL_POPUP_NAME, features);
}

/**
 * 운영 모드: 백엔드 AUTH 응답의 startUrl/startParams를 다날 결제창에 form POST.
 * startParams는 백엔드가 다날 규격으로 직렬화해 넘겨주므로 그대로 한 필드에 실어 보낸다.
 */
export function submitDanalAuthFormToPopup(auth: DanalAuthResponseDto) {
  const $form = document.createElement('form');
  $form.method = 'POST';
  $form.action = auth.startUrl;
  $form.target = DANAL_POPUP_NAME;
  $form.style.display = 'none';

  const $input = document.createElement('input');
  $input.type = 'hidden';
  $input.name = 'startParams';
  $input.value = auth.startParams;
  $form.appendChild($input);

  document.body.appendChild($form);
  $form.submit();
  document.body.removeChild($form);
}

export interface DanalResult {
  status: 'success' | 'error' | 'cancel' | null;
  orderId: string | null;
}

// 팝업 종료 신호를 기다린다.
// resolve 조건:
//   1) DANAL_PAYMENT_DONE postMessage 수신 (same-origin callback 경로) → status/orderId 포함
//   2) popup.closed 감지 (cross-origin redirect로 callback page 안 거치고 자동 close된 경우, 또는 사용자 임의 close) → null 반환
// plan diff로 판정 가능한 흐름(업그레이드 결제)은 반환값 무시 가능.
// 결제수단 변경처럼 plan diff 불가한 흐름은 status 로 분기.
export function waitForDanalResult(popup: Window): Promise<DanalResult | null> {
  return new Promise((resolve) => {
    const cleanup = () => {
      window.removeEventListener('message', handler);
      clearInterval(closedCheck);
    };
    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'DANAL_PAYMENT_DONE') return;
      cleanup();
      resolve({
        status: (e.data.status as DanalResult['status']) ?? null,
        orderId: e.data.orderId ?? null,
      });
    };
    const closedCheck = setInterval(() => {
      if (popup.closed) {
        cleanup();
        resolve(null);
      }
    }, 500);
    window.addEventListener('message', handler);
  });
}

import type { KcpTradeRegDto } from '@/types/api/user';

export const KCP_POPUP_NAME = 'kcp-popup';
const KCP_POPUP_FEATURES = 'width=500,height=700,scrollbars=yes,resizable=yes';

// 빈 팝업창을 먼저 연다.
// 사용자 클릭 → API 호출 → 그 다음에 팝업 열면 비동기 사이에 popup blocker가 막음.
// 그래서 클릭 직후에 미리 빈 팝업 열어두고, API 응답 도착 후에 팝업 location 조작.
export function openKcpPopup(): Window | null {
  return window.open('', KCP_POPUP_NAME, KCP_POPUP_FEATURES);
}

// 거래등록 응답을 form POST로 KCP 인증 페이지에 전송.
// target=KCP_POPUP_NAME → 미리 열어둔 팝업 안에서 POST 결과가 로딩됨.
// page_submit_yn=N: 팝업 모드 (PC 권장).
export function submitKcpAuthFormToPopup(trade: KcpTradeRegDto) {
  const $form = document.createElement('form');
  $form.method = 'POST';
  $form.action = trade.callUrl;
  $form.target = KCP_POPUP_NAME;
  $form.style.display = 'none';

  const fields: Record<string, string> = {
    reg_cert_key: trade.regCertKey,
    ordr_idxx: trade.ordrIdxx,
    page_submit_yn: 'N',
  };

  for (const [name, value] of Object.entries(fields)) {
    const $input = document.createElement('input');
    $input.type = 'hidden';
    $input.name = name;
    $input.value = value;
    $form.appendChild($input);
  }

  document.body.appendChild($form);
  $form.submit();
  document.body.removeChild($form);
}

// 팝업이 보낸 KCP_VERIFY_DONE 메시지를 기다린다.
// 사용자가 인증 끝내지 않고 팝업을 그냥 닫으면 reject.
export function waitForKcpResult(popup: Window): Promise<void> {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      window.removeEventListener('message', handler);
      clearInterval(closedCheck);
    };

    const handler = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type !== 'KCP_VERIFY_DONE') return;
      cleanup();
      resolve();
    };

    const closedCheck = setInterval(() => {
      if (popup.closed) {
        cleanup();
        reject(new Error('인증 창이 닫혔습니다.'));
      }
    }, 500);

    window.addEventListener('message', handler);
  });
}

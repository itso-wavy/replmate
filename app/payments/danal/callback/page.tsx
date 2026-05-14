'use client';

import { useEffect } from 'react';

export default function DanalCallbackPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.opener) {
      // 백엔드가 redirect URL에 ?status=success|error|cancel&orderId=... 를 붙여줌.
      // 부모창에 함께 전달해 결제수단 변경 등 plan diff로 성공 판정 불가한 흐름에서 사용.
      const params = new URLSearchParams(window.location.search);
      window.opener.postMessage(
        {
          type: 'DANAL_PAYMENT_DONE',
          status: params.get('status'),
          orderId: params.get('orderId'),
        },
        window.location.origin
      );
    }
    window.close();
  }, []);

  return null;
}

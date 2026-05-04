'use client';

import { useEffect } from 'react';

export default function KcpCallbackPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.opener) {
      window.opener.postMessage(
        { type: 'KCP_VERIFY_DONE' },
        window.location.origin
      );
    }
    window.close();
  }, []);

  return null;
}

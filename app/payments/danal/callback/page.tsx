'use client';

import { useEffect } from 'react';

export default function DanalCallbackPage() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.opener) {
      window.opener.postMessage(
        { type: 'DANAL_PAYMENT_DONE' },
        window.location.origin
      );
    }
    window.close();
  }, []);

  return null;
}

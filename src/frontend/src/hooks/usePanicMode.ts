'use client';

import { useEffect, useState, useCallback } from 'react';

export function usePanicMode() {
  const [panicActive, setPanicActive] = useState(false);

  const activate = useCallback(() => {
    setPanicActive(true);
    document.querySelectorAll('[data-sensitive]').forEach((el) => {
      el.setAttribute('data-hidden', 'true');
    });
  }, []);

  const deactivate = useCallback(() => {
    setPanicActive(false);
    document.querySelectorAll('[data-sensitive]').forEach((el) => {
      el.removeAttribute('data-hidden');
    });
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        if (panicActive) deactivate();
        else activate();
      }
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        fetch('/api/auth/lock', { method: 'POST', credentials: 'include' }).then(
          () => (window.location.href = '/login')
        );
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [panicActive, activate, deactivate]);

  return { panicActive, activate, deactivate };
}

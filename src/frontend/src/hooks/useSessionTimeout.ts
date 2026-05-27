'use client';

import { useEffect, useCallback, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api-client';

const EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'];

export function useSessionTimeout(timeoutMinutes = 15) {
  const router = useRouter();
  const [showWarning, setShowWarning] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const warningRef = useRef<NodeJS.Timeout>();

  const resetTimer = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningRef.current) clearTimeout(warningRef.current);
    setShowWarning(false);

    warningRef.current = setTimeout(
      () => setShowWarning(true),
      (timeoutMinutes - 1) * 60 * 1000
    );

    timeoutRef.current = setTimeout(async () => {
      await api.post('/api/auth/lock');
      router.push('/login?expired=1');
    }, timeoutMinutes * 60 * 1000);
  }, [timeoutMinutes, router]);

  const continueSession = () => resetTimer();

  useEffect(() => {
    resetTimer();
    const handler = () => resetTimer();
    EVENTS.forEach((e) => window.addEventListener(e, handler));
    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, handler));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningRef.current) clearTimeout(warningRef.current);
    };
  }, [resetTimer]);

  return { showWarning, continueSession };
}

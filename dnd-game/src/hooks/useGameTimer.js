import { useState, useEffect, useRef } from 'react';
export function useGameTimer(seconds, onExpire) {
  const [remaining, setRemaining] = useState(seconds);
  const ref = useRef(null);
  useEffect(() => {
    if (!seconds) return;
    setRemaining(seconds);
    ref.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(ref.current); onExpire?.(); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(ref.current);
  }, [seconds, onExpire]);
  return remaining;
}

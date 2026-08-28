import { useState, useCallback } from 'react';
export function useFlashMessage(durationMs = 3000) {
  const [message, setMessage] = useState(null);
  const [timerId, setTimerId] = useState(null);
  const flash = useCallback((text, type = 'info') => {
    if (timerId) clearTimeout(timerId);
    setMessage({ text, type });
    const id = setTimeout(() => setMessage(null), durationMs);
    setTimerId(id);
  }, [timerId, durationMs]);
  return { message, flash };
}

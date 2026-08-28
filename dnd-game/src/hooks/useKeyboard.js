import { useEffect } from 'react';
export function useKeyboard(keyMap, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    function handle(e) {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const fn = keyMap[e.key] || keyMap[e.key.toLowerCase()];
      if (fn) { e.preventDefault(); fn(e); }
    }
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [keyMap, enabled]);
}

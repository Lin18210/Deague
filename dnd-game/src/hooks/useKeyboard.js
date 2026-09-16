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


// Quicksave F5 & Quickload F9 hotkey support
export function setupQuickSaveHotkeys(onQuickSave, onQuickLoad) {
  const handler = (e) => {
    if (e.key === 'F5') {
      e.preventDefault();
      if (onQuickSave) onQuickSave();
    } else if (e.key === 'F9') {
      e.preventDefault();
      if (onQuickLoad) onQuickLoad();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}

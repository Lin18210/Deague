import { useState, useCallback } from 'react';
const MAX_LOG = 60;
export function useCombatLog() {
  const [entries, setEntries] = useState([]);
  const addEntry = useCallback((text, type = 'normal') => {
    setEntries(prev => [{ id: Date.now() + Math.random(), text, type }, ...prev].slice(0, MAX_LOG));
  }, []);
  const clearLog = useCallback(() => setEntries([]), []);
  return { entries, addEntry, clearLog };
}

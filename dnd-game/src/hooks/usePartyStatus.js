import { useMemo } from 'react';
export function usePartyStatus(companions) {
  return useMemo(() => {
    const alive = companions.filter(c => c.hp > 0);
    const avgHP = alive.length
      ? Math.round(alive.reduce((s,c) => s + c.hp/c.maxHp, 0) / alive.length * 100) : 0;
    return { alive: alive.length, total: companions.length, avgHP, anyLow: alive.some(c => c.hp/c.maxHp < 0.3), wiped: alive.length === 0 };
  }, [companions]);
}

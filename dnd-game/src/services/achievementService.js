const KEY = 'eldritch_achievements';
function load() { try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }
export const AchievementService = {
  unlock(id) {
    const d = load();
    if (d[id]) return false;
    d[id] = { unlockedAt: Date.now() };
    save(d); return true;
  },
  isUnlocked(id) { return !!load()[id]; },
  getAll() { return load(); },
  reset() { save({}); },
};

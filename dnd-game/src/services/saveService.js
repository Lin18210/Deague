const SAVE_KEY = 'eldritch_ascent_save';
const VERSION  = 1;
export const SaveService = {
  save(state) {
    try { localStorage.setItem(SAVE_KEY, JSON.stringify({ v: VERSION, ts: Date.now(), state })); return true; }
    catch { return false; }
  },
  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return null;
      const { v, state } = JSON.parse(raw);
      return v === VERSION ? state : null;
    } catch { return null; }
  },
  clear() { try { localStorage.removeItem(SAVE_KEY); } catch {} },
  hasSave() { return !!localStorage.getItem(SAVE_KEY); },
};

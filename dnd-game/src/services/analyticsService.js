const _events = [];
export const Analytics = {
  track(event, data = {}) { _events.push({ event, data, ts: Date.now() }); },
  getSession() { return [..._events]; },
  summary() { const c = {}; for (const e of _events) c[e.event] = (c[e.event] || 0) + 1; return c; },
  clear() { _events.length = 0; },
};

const _listeners = {};
export const EventBus = {
  on(event, cb) {
    (_listeners[event] = _listeners[event] || []).push(cb);
    return () => this.off(event, cb);
  },
  off(event, cb) { _listeners[event] = (_listeners[event] || []).filter(f => f !== cb); },
  emit(event, data) { (_listeners[event] || []).forEach(cb => { try { cb(data); } catch {} }); },
  once(event, cb) { const w = d => { cb(d); this.off(event, w); }; this.on(event, w); },
};
export const GAME_EVENTS = {
  COMBAT_START  : 'combat:start',
  COMBAT_END    : 'combat:end',
  ENEMY_DIED    : 'enemy:died',
  PLAYER_LEVELED: 'player:levelUp',
  QUEST_COMPLETE: 'quest:complete',
  SCENE_CHANGE  : 'scene:change',
  SAVE_GAME     : 'game:save',
};

// Keyboard shortcut registry
export const SHORTCUTS = {
  OPEN_INVENTORY : 'i',
  OPEN_JOURNAL   : 'j',
  OPEN_SPELLBOOK : 'k',
  OPEN_ALCHEMY   : 'a',
  TOGGLE_SOUND   : 'm',
  CONFIRM        : 'Enter',
  CANCEL         : 'Escape',
};
export function matchShortcut(e, key) {
  return !e.ctrlKey && !e.altKey && !e.metaKey && e.key.toLowerCase() === key.toLowerCase();
}

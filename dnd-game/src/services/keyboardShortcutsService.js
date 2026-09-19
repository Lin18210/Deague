/**
 * Keyboard Shortcuts & Hotkey Router
 * Maps keyboard key combinations to game actions (Combat, Menus, Dice Roll).
 */

export const SHORTCUTS_MAP = [
  { key: '1 - 4', action: 'Select Story Choice or Combat Ability' },
  { key: 'Space', action: 'Roll d20 Dice Tower / Confirm Check' },
  { key: 'I', action: 'Open Backpack & Inventory' },
  { key: 'S', action: 'Open Spellbook & Grimoire' },
  { key: 'Q', action: 'Open Quest Journal' },
  { key: 'B', action: 'Open Bestiary & Creature Lore' },
  { key: 'F5', action: 'Quick-Save Campaign State' },
  { key: 'F9', action: 'Quick-Load Latest Archive' },
  { key: '?', action: 'Toggle Keyboard Shortcuts Guide' },
];

export function getShortcutsList() {
  return [...SHORTCUTS_MAP];
}

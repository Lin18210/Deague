/**
 * Multi-Slot Campaign Save Service
 * Supports multiple distinct profiles with playtime, location, and snapshot details.
 */

const SLOTS_KEY = 'deague_save_slots';

export function getSaveSlots() {
  try {
    const raw = localStorage.getItem(SLOTS_KEY);
    return raw ? JSON.parse(raw) : [null, null, null];
  } catch {
    return [null, null, null];
  }
}

export function saveToSlot(index, character, storyState) {
  const slots = getSaveSlots();
  slots[index] = {
    heroName: character?.name || 'Vanguard Hero',
    heroClass: character?.class || 'Warrior',
    level: character?.level || 1,
    act: storyState?.act || 1,
    location: storyState?.location || 'High Mountain Pass',
    timestamp: Date.now(),
    characterData: character,
    storyData: storyState,
  };
  try {
    localStorage.setItem(SLOTS_KEY, JSON.stringify(slots));
  } catch {}
  return slots;
}

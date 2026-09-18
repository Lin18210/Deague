/**
 * Single-Use Arcane Spell Scroll System
 * Enables any hero (regardless of class or mana) to cast emergency scrolls from their pouch.
 */

export const SCROLL_REGISTRY = [
  {
    id: 'scroll_fireball',
    name: 'Scroll of Fireball',
    school: 'Evocation',
    damage: '3d8',
    damageType: 'Fire',
    description: 'A bright streak flashes from your hand and blossoms with a low roar into an explosion of flame.',
    charges: 1,
  },
  {
    id: 'scroll_sanctuary',
    name: 'Scroll of Divine Aegis',
    school: 'Abjuration',
    shieldValue: 20,
    description: 'Surrounds the target in a shimmering globe of translucent golden light absorbing 20 damage.',
    charges: 1,
  },
  {
    id: 'scroll_void_warp',
    name: 'Scroll of Rift Blink',
    school: 'Transmutation',
    effect: 'evasion',
    description: 'Instantly teleports 30 feet into shadows, automatically dodging the next incoming monster strike.',
    charges: 1,
  },
];

export function getPlayerScrolls() {
  return [...SCROLL_REGISTRY];
}

export function castScroll(scrollId) {
  const scroll = SCROLL_REGISTRY.find(s => s.id === scrollId);
  if (!scroll || scroll.charges <= 0) return null;
  scroll.charges -= 1;
  return scroll;
}

/**
 * Dynamic Loot Drop Generator
 * Generates context-aware treasure cards after combat victories.
 */

export const REAGENTS = [
  { id: 'void_essence', name: 'Vial of Void Essence', type: 'reagent', icon: '🔮', desc: 'Distilled starlight from the rift.' },
  { id: 'wolf_pelt', name: 'Frosthound Pelt', type: 'material', icon: '🐺', desc: 'Thick fur that repels arctic chill.' },
  { id: 'elven_rune', name: 'Shattered Sunken Rune', type: 'relic', icon: '📜', desc: 'Contains ancient high magic words.' },
];

export function rollVictoryLoot(enemyCr = 1) {
  const goldEarned = Math.floor(Math.random() * (enemyCr * 15)) + 10;
  const xpEarned = enemyCr * 120;
  const items = [];

  // Reagent drop chance
  if (Math.random() > 0.3) {
    const randomReagent = REAGENTS[Math.floor(Math.random() * REAGENTS.length)];
    items.push(randomReagent);
  }

  // Potion drop
  if (Math.random() > 0.5) {
    items.push({ id: 'potion_heal', name: 'Elixir of Restoration', type: 'consumable', icon: '🧪', desc: 'Restores 12 HP instantly.' });
  }

  return {
    gold: goldEarned,
    xp: xpEarned,
    items,
  };
}

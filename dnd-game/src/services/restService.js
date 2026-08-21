/**
 * Campfire & Resting Service
 * Implements D&D 5e short rest (hit die expenditure) and long rest mechanics.
 */

export function performShortRest(character, hitDiceSpent = 1) {
  if (!character) return character;
  const conMod = Math.floor(((character.attributes?.constitution || 10) - 10) / 2);
  let totalHealed = 0;

  for (let i = 0; i < hitDiceSpent; i++) {
    const dieRoll = Math.floor(Math.random() * 8) + 1; // d8 default hit die
    totalHealed += Math.max(1, dieRoll + conMod);
  }

  const newHp = Math.min(character.maxHp || 30, character.hp + totalHealed);
  return {
    ...character,
    hp: newHp,
    lastHealed: totalHealed,
  };
}

export function performLongRest(character, companions = []) {
  if (!character) return { character, companions };

  const restoredHero = {
    ...character,
    hp: character.maxHp || 30,
    statusEffects: [],
  };

  const restoredCompanions = companions.map(comp => ({
    ...comp,
    hp: comp.maxHp || 25,
    statusEffects: [],
  }));

  return {
    character: restoredHero,
    companions: restoredCompanions,
    summary: 'Full rest completed. All wounds mended and spell slots revitalized under the starlight.',
  };
}

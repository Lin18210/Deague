export const initialCharacter = {
  name: 'Aldric the Brave',
  class: 'Fighter',
  level: 5,
  stats: {
    STR: 16,
    DEX: 14,
    CON: 15,
    INT: 10,
    WIS: 12,
    CHA: 8,
  },
  proficiency: 3,
  ac: 18,
  health: 32,
  maxHealth: 32,
  mana: 15,
  maxMana: 15,
  weapons: [
    { name: 'Longsword +1', damage: '1d8', bonus: 4, magic: 1 },
  ],
  spells: [
    { name: 'Magic Missile', damage: '3d4+3', manaCost: 3, autoHit: true },
    { name: 'Fire Bolt', damage: '2d10', manaCost: 2, attackMod: 5 },
    { name: 'Shield of Faith', manaCost: 2, effect: 'ac_boost', description: '+2 AC for 1 minute' },
  ],
  inventory: [
    'Longsword +1',
    'Shield of Faith',
    'Healing Potion (2)',
    'Torch',
    '50 ft. Hempen Rope',
    'Tinderbox',
  ],
};

export const statModifier = (score) => Math.floor((score - 10) / 2);

export const getAbilityMod = (character, ability) => statModifier(character.stats[ability]);

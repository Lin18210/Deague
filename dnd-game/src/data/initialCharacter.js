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
    'Healing Potion (2)',
    'Torch',
    '50 ft. Hempen Rope',
    'Tinderbox',
  ],
};

export const CLASS_PRESETS = {
  warrior: {
    name: 'Aldric the Brave',
    class: 'Vanguard',
    level: 5,
    stats: { STR: 16, DEX: 14, CON: 15, INT: 10, WIS: 12, CHA: 8 },
    proficiency: 3,
    ac: 18,
    health: 34,
    maxHealth: 34,
    mana: 6,
    maxMana: 6,
    weapons: [{ name: 'Steel Broadsword', damage: '1d10', bonus: 4, magic: 1 }],
    spells: [],
    inventory: [
      'Steel Broadsword',
      'Healing Potion (2)',
      'Iron Shield',
      'Torch',
      '50 ft. Hempen Rope',
    ],
  },
  mage: {
    name: 'Lyra Starweave',
    class: 'Aether Weaver',
    level: 5,
    stats: { STR: 7, DEX: 12, CON: 12, INT: 17, WIS: 14, CHA: 11 },
    proficiency: 3,
    ac: 14,
    health: 20,
    maxHealth: 20,
    mana: 28,
    maxMana: 28,
    weapons: [{ name: 'Aether Staff', damage: '1d6', bonus: 2, magic: 2 }],
    spells: [
      { name: 'Arcane Bolt', damage: '3d6', manaCost: 3, attackMod: 6 },
      { name: 'Fireball', damage: '4d8', manaCost: 6, attackMod: 6 },
      { name: 'Arcane Shield', manaCost: 3, effect: 'ac_boost', description: '+2 AC for 1 minute' },
    ],
    inventory: [
      'Aether Staff',
      'Healing Potion (2)',
      'Spellbook of Shadows',
      'Torch',
      'Chalk (10 pieces)',
    ],
  },
  rogue: {
    name: 'Kael Shadowstep',
    class: 'Shadowstalker',
    level: 5,
    stats: { STR: 11, DEX: 17, CON: 13, INT: 11, WIS: 10, CHA: 14 },
    proficiency: 3,
    ac: 16,
    health: 24,
    maxHealth: 24,
    mana: 10,
    maxMana: 10,
    weapons: [{ name: 'Twin Daggers', damage: '1d6', bonus: 5, magic: 1 }],
    spells: [
      { name: 'Poison Dart', damage: '2d8', manaCost: 2, attackMod: 5 },
      { name: 'Shadow Step', manaCost: 3, effect: 'ac_boost', description: '+2 AC for 1 minute' },
    ],
    inventory: [
      'Twin Daggers',
      'Healing Potion (2)',
      'Thieves Tools',
      'Torch',
      'Grappling Hook',
    ],
  },
};

export const CLASS_META = {
  warrior: {
    title: 'Vanguard',
    desc: 'A heavily armored knight who crushes foes with raw strength and endures the mightiest blows.',
    icon: 'shield',
    color: 'from-amber-700 to-red-800',
  },
  mage: {
    title: 'Aether Weaver',
    desc: 'A sage attuned to cosmic energies, wielding devastating spells but vulnerable in close combat.',
    icon: 'sparkles',
    color: 'from-purple-700 to-indigo-900',
  },
  rogue: {
    title: 'Shadowstalker',
    desc: 'A master of stealth and precision strikes, dancing through shadows with lethal grace.',
    icon: 'eye',
    color: 'from-emerald-700 to-teal-900',
  },
};

export const statModifier = (score) => Math.floor((score - 10) / 2);

export const getAbilityMod = (character, ability) => statModifier(character.stats[ability]);

/**
 * Pre-built companion archetypes that join the player's party in combat.
 * Each companion has simplified stats, AI behavior profile, and class abilities.
 */

export const DEFAULT_COMPANIONS = [
  {
    id: 'lyra',
    name: 'Lyra Dawnveil',
    class: 'Cleric',
    role: 'healer',
    emoji: '🕊️',
    colorClass: 'sky',
    hp: 28,
    maxHp: 28,
    mana: 22,
    maxMana: 22,
    stats: { strength: 13, dexterity: 10, constitution: 14, intelligence: 12, wisdom: 17, charisma: 13 },
    ac: 16,
    attackDamage: '1d6',
    attackMod: 4,
    // AI behavior: tries to heal critically wounded allies first, then attacks
    aiBehavior: 'support',
    abilities: [
      {
        id: 'sacred_flame',
        name: 'Sacred Flame',
        manaCost: 1,
        damage: '2d6',
        type: 'damage',
        emoji: '🔥',
        description: 'Radiant divine fire, auto-hits for holy damage.'
      },
      {
        id: 'healing_word',
        name: 'Healing Word',
        manaCost: 2,
        healAmount: '2d4+4',
        type: 'heal',
        emoji: '💚',
        description: 'Restores HP to a wounded ally.'
      }
    ]
  },
  {
    id: 'kael',
    name: 'Kael Thornblade',
    class: 'Rogue',
    role: 'dps',
    emoji: '🗡️',
    colorClass: 'emerald',
    hp: 24,
    maxHp: 24,
    mana: 10,
    maxMana: 10,
    stats: { strength: 11, dexterity: 18, constitution: 13, intelligence: 12, wisdom: 10, charisma: 14 },
    ac: 15,
    attackDamage: '1d6',
    attackMod: 6,
    aiBehavior: 'aggressive',
    abilities: [
      {
        id: 'sneak_attack',
        name: 'Sneak Attack',
        manaCost: 2,
        damage: '3d6',
        type: 'damage',
        emoji: '🗡️',
        description: 'Strike from shadows for massive bonus damage.'
      },
      {
        id: 'poison_blade',
        name: 'Poison Blade',
        manaCost: 0,
        damage: '1d6',
        type: 'damage',
        debuff: 'poisoned',
        emoji: '☠️',
        description: 'Coat blade in venom — poisons the target.'
      }
    ]
  },
  {
    id: 'vorn',
    name: 'Vorn Ashmantle',
    class: 'Barbarian',
    role: 'tank',
    emoji: '🪓',
    colorClass: 'red',
    hp: 42,
    maxHp: 42,
    mana: 4,
    maxMana: 4,
    stats: { strength: 18, dexterity: 14, constitution: 17, intelligence: 7, wisdom: 10, charisma: 8 },
    ac: 14,
    attackDamage: '1d12',
    attackMod: 7,
    aiBehavior: 'aggressive',
    abilities: [
      {
        id: 'rage_strike',
        name: 'Rage Strike',
        manaCost: 0,
        damage: '2d12',
        type: 'damage',
        emoji: '🔥',
        description: 'Channel primal fury into a devastating blow.'
      }
    ]
  }
];

/**
 * Enemy group configurations keyed by encounter name.
 * Each enemy has: id, name, hp, maxHp, ac, attackMod, damage, dexterity, emoji
 */
export const ENEMY_GROUPS = {
  shadow_hound_pack: [
    {
      id: 'alpha_hound',
      name: 'Alpha Shadow-Hound',
      hp: 52,
      maxHp: 52,
      ac: 14,
      attackMod: 5,
      damage: '1d8+3',
      dexterity: 14,
      emoji: '🐺',
      colorClass: 'purple'
    },
    {
      id: 'shadow_pup_1',
      name: 'Shadow Pup',
      hp: 18,
      maxHp: 18,
      ac: 12,
      attackMod: 3,
      damage: '1d4+1',
      dexterity: 16,
      emoji: '🐾',
      colorClass: 'violet'
    },
    {
      id: 'shadow_pup_2',
      name: 'Shadow Pup',
      hp: 18,
      maxHp: 18,
      ac: 12,
      attackMod: 3,
      damage: '1d4+1',
      dexterity: 13,
      emoji: '🐾',
      colorClass: 'violet'
    }
  ],
  crypt_guardians: [
    {
      id: 'skeleton_captain',
      name: 'Skeleton Captain',
      hp: 38,
      maxHp: 38,
      ac: 15,
      attackMod: 4,
      damage: '1d8+2',
      dexterity: 11,
      emoji: '💀',
      colorClass: 'amber'
    },
    {
      id: 'skeleton_archer',
      name: 'Skeleton Archer',
      hp: 22,
      maxHp: 22,
      ac: 13,
      attackMod: 4,
      damage: '1d6+2',
      dexterity: 14,
      emoji: '🏹',
      colorClass: 'yellow'
    },
    {
      id: 'skeleton_warrior',
      name: 'Skeleton Warrior',
      hp: 28,
      maxHp: 28,
      ac: 14,
      attackMod: 3,
      damage: '1d6+1',
      dexterity: 10,
      emoji: '⚔️',
      colorClass: 'orange'
    }
  ],
  void_wraiths: [
    {
      id: 'wraith_elder',
      name: 'Void Wraith Elder',
      hp: 44,
      maxHp: 44,
      ac: 13,
      attackMod: 6,
      damage: '2d6+2',
      dexterity: 17,
      emoji: '👻',
      colorClass: 'indigo'
    },
    {
      id: 'wraith_shade',
      name: 'Shade',
      hp: 16,
      maxHp: 16,
      ac: 11,
      attackMod: 3,
      damage: '1d4',
      dexterity: 18,
      emoji: '🌑',
      colorClass: 'slate'
    }
  ]
};

/**
 * Roll dice notation like '1d6', '2d4+3'
 */
export function rollDiceNotation(notation) {
  const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) return 0;
  const count = parseInt(match[1]);
  const sides = parseInt(match[2]);
  const bonus = match[3] ? parseInt(match[3]) : 0;
  let total = bonus;
  for (let i = 0; i < count; i++) {
    total += Math.floor(Math.random() * sides) + 1;
  }
  return Math.max(1, total);
}

/**
 * Get DEX modifier from dexterity score or stats object
 */
export function getDexMod(entity) {
  const dex = entity.stats ? entity.stats.dexterity : entity.dexterity;
  return Math.floor((dex - 10) / 2);
}

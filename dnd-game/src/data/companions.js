/**
 * Pre-built companion archetypes that join the player's party in combat.
 * Each companion has simplified stats, AI behavior profile, and class abilities.
 * Lore: These adventurers were drawn to the High Pass by different callings.
 */

export const DEFAULT_COMPANIONS = [
  {
    id: 'lyra',
    name: 'Lyra Dawnveil',
    class: 'Cleric of Lathander',
    role: 'healer',
    emoji: '🕊️',
    colorClass: 'sky',
    lore: 'A devoted cleric who received a vision of the ancient evil stirring beneath the High Pass. She follows the Morninglord\'s light into darkness.',
    hp: 28,
    maxHp: 28,
    mana: 22,
    maxMana: 22,
    stats: { strength: 13, dexterity: 10, constitution: 14, intelligence: 12, wisdom: 17, charisma: 13 },
    ac: 16,
    attackDamage: '1d6',
    attackMod: 4,
    aiBehavior: 'support',
    abilities: [
      {
        id: 'sacred_flame',
        name: 'Sacred Flame',
        manaCost: 1,
        damage: '2d6',
        type: 'damage',
        emoji: '🔥',
        description: 'Radiant divine fire descends from above — auto-hits for holy damage.'
      },
      {
        id: 'healing_word',
        name: 'Healing Word',
        manaCost: 2,
        healAmount: '2d4+4',
        type: 'heal',
        emoji: '💚',
        description: 'A whispered prayer restores HP to a wounded ally.'
      }
    ]
  },
  {
    id: 'kael',
    name: 'Kael Thornblade',
    class: 'Rogue (Arcane Trickster)',
    role: 'dps',
    emoji: '🗡️',
    colorClass: 'emerald',
    lore: 'A former thieves\' guild member who discovered a cache of forbidden arcane texts in the mountain. He seeks the knowledge they promised — at any cost.',
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
        description: 'Strike from shadows for massive sneak damage.'
      },
      {
        id: 'poison_blade',
        name: 'Poison Blade',
        manaCost: 0,
        damage: '1d6',
        type: 'damage',
        debuff: 'poisoned',
        emoji: '☠️',
        description: 'Coat blade in venom — poisons the target over time.'
      }
    ]
  },
  {
    id: 'vorn',
    name: 'Vorn Ashmantle',
    class: 'Barbarian (Path of the Totem)',
    role: 'tank',
    emoji: '🪓',
    colorClass: 'red',
    lore: 'The last of his mountain clan, slaughtered by shadow creatures three winters past. He hunts for vengeance, following the dark energy back to its source.',
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
 * Organized by story act for the expanded campaign.
 */
export const ENEMY_GROUPS = {

  // ACT I — The High Pass
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
      colorClass: 'purple',
      lore: 'Formed from concentrated void-energy seeping through the broken seal. Far stronger than ordinary hounds.'
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

  // ACT I — Variant: single hound surprise
  lone_shadow_hound: [
    {
      id: 'lone_hound',
      name: 'Ravenous Shadow-Hound',
      hp: 38,
      maxHp: 38,
      ac: 13,
      attackMod: 4,
      damage: '1d8+2',
      dexterity: 15,
      emoji: '🐺',
      colorClass: 'purple',
      lore: 'A lone predator that stalks through the Void-rift, driven mad by the seeping dark energy.'
    }
  ],

  // ACT II — The Sunken Vault
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
      colorClass: 'amber',
      lore: 'Once a knight of House Embervane, bound in undeath to guard the vault for eternity.'
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

  // ACT II — Boss
  crypt_lord: [
    {
      id: 'crypt_lord',
      name: 'The Crypt Lord Malveth',
      hp: 85,
      maxHp: 85,
      ac: 17,
      attackMod: 6,
      damage: '2d6+4',
      dexterity: 10,
      emoji: '💀',
      colorClass: 'amber',
      lore: 'A lich-touched warlord who swore a dark oath to protect the Eye of the Void. His bones shimmer with necrotic energy.',
      isBoss: true
    },
    {
      id: 'bone_construct_1',
      name: 'Bone Construct',
      hp: 24,
      maxHp: 24,
      ac: 12,
      attackMod: 3,
      damage: '1d6',
      dexterity: 8,
      emoji: '🦴',
      colorClass: 'stone'
    }
  ],

  // ACT III — The Void Rift
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
      colorClass: 'indigo',
      lore: 'An elder wraith who feeds on the life-force of the living. Its touch drains both body and soul.'
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
  ],

  // ACT III — Cultists
  void_cultists: [
    {
      id: 'cultist_hierophant',
      name: 'Cultist Hierophant',
      hp: 40,
      maxHp: 40,
      ac: 14,
      attackMod: 5,
      damage: '2d6+2',
      dexterity: 13,
      emoji: '🧙',
      colorClass: 'indigo',
      lore: 'A fanatic who willingly offered their mind to the Void\'s whispers. They channel eldritch energy through corrupted ritual tattoos.'
    },
    {
      id: 'cultist_1',
      name: 'Void Cultist',
      hp: 20,
      maxHp: 20,
      ac: 12,
      attackMod: 3,
      damage: '1d6+1',
      dexterity: 12,
      emoji: '🔮',
      colorClass: 'violet'
    },
    {
      id: 'cultist_2',
      name: 'Void Cultist',
      hp: 20,
      maxHp: 20,
      ac: 12,
      attackMod: 3,
      damage: '1d6+1',
      dexterity: 11,
      emoji: '🔮',
      colorClass: 'violet'
    }
  ],

  // ACT IV — The Under-Empire Sewers
  ratfolk_ambush: [
    {
      id: 'ratfolk_shaman',
      name: 'Ratfolk Shaman',
      hp: 30,
      maxHp: 30,
      ac: 13,
      attackMod: 4,
      damage: '2d4+2',
      dexterity: 15,
      emoji: '🐀',
      colorClass: 'yellow',
      lore: 'The spiritual leader of a Ratfolk warrens community, wielding corrupted void-magic stolen from nearby rifts.'
    },
    {
      id: 'ratfolk_1',
      name: 'Ratfolk Scrapper',
      hp: 14,
      maxHp: 14,
      ac: 12,
      attackMod: 4,
      damage: '1d4+2',
      dexterity: 17,
      emoji: '🐀',
      colorClass: 'stone'
    },
    {
      id: 'ratfolk_2',
      name: 'Ratfolk Scrapper',
      hp: 14,
      maxHp: 14,
      ac: 12,
      attackMod: 4,
      damage: '1d4+2',
      dexterity: 15,
      emoji: '🐀',
      colorClass: 'stone'
    }
  ],

  // ACT IV — The Under-Empire
  corrupted_constructs: [
    {
      id: 'golem_broken',
      name: 'Corrupted Forge-Golem',
      hp: 68,
      maxHp: 68,
      ac: 16,
      attackMod: 5,
      damage: '2d8+3',
      dexterity: 6,
      emoji: '🤖',
      colorClass: 'stone',
      lore: 'Once a proud artisan construct of the ancient Dwarven under-empire. The Void\'s corruption has twisted its directives to destroy all intruders.',
      isBoss: false
    },
    {
      id: 'spark_elemental',
      name: 'Spark Elemental',
      hp: 22,
      maxHp: 22,
      ac: 13,
      attackMod: 4,
      damage: '1d8',
      dexterity: 16,
      emoji: '⚡',
      colorClass: 'yellow'
    }
  ],

  // ACT V — The Eye of the Void
  void_herald: [
    {
      id: 'void_herald',
      name: 'Void Herald Seraphax',
      hp: 90,
      maxHp: 90,
      ac: 16,
      attackMod: 7,
      damage: '2d8+4',
      dexterity: 16,
      emoji: '👁️',
      colorClass: 'purple',
      lore: 'The Void\'s chosen avatar — a being of pure necrotic energy given form. It was sent through the Rift to awaken what sleeps below.',
      isBoss: true
    },
    {
      id: 'void_tendril_1',
      name: 'Void Tendril',
      hp: 12,
      maxHp: 12,
      ac: 10,
      attackMod: 4,
      damage: '1d6',
      dexterity: 14,
      emoji: '🌑',
      colorClass: 'slate'
    }
  ],

  // FINAL BOSS — The Dreaming One
  the_dreaming_one: [
    {
      id: 'the_dreaming_one',
      name: 'Zal\'thrix, The Dreaming One',
      hp: 140,
      maxHp: 140,
      ac: 18,
      attackMod: 9,
      damage: '3d8+5',
      dexterity: 18,
      emoji: '🌌',
      colorClass: 'indigo',
      lore: 'The ancient aboleth-lich who slept in the deepest vault of the under-empire for three millennia. Awakened by the broken seal, it seeks to reclaim the surface world for the Far Realm.',
      isBoss: true,
      isFinalBoss: true
    },
    {
      id: 'dream_spawn_1',
      name: 'Dream-Spawn',
      hp: 28,
      maxHp: 28,
      ac: 12,
      attackMod: 5,
      damage: '1d8+2',
      dexterity: 15,
      emoji: '🐙',
      colorClass: 'violet'
    },
    {
      id: 'dream_spawn_2',
      name: 'Dream-Spawn',
      hp: 28,
      maxHp: 28,
      ac: 12,
      attackMod: 5,
      damage: '1d8+2',
      dexterity: 13,
      emoji: '🐙',
      colorClass: 'violet'
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

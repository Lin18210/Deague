// Eldritch Ascent – Game Balance Constants
export const GAME = {
  MAX_PARTY_SIZE      : 4,
  BASE_XP_PER_KILL    : 50,
  LEVEL_UP_XP_MULT    : 1.5,
  MAX_LEVEL           : 10,
  CRIT_THRESHOLD      : 20,
  POISON_TICK_DAMAGE  : 5,
  MAX_COMPANIONS      : 3,
  AFFINITY_CAP        : 100,
  AFFINITY_STEP       : 10,
  ALCHEMY_MAX_POTIONS : 6,
  SPELL_SLOT_BASE     : 3,
};
export const DIFFICULTY = {
  EASY   : { enemyHpMult: 0.75, xpMult: 0.8  },
  NORMAL : { enemyHpMult: 1.00, xpMult: 1.0  },
  HARD   : { enemyHpMult: 1.35, xpMult: 1.25 },
};

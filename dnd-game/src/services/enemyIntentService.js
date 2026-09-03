/**
 * Enemy Intent System
 * Predicts and telegraphs monster actions to give tactical depth to player turns.
 */

export const INTENT_TYPES = {
  ATTACK: 'attack',
  HEAVY_ATTACK: 'heavy_attack',
  SPELL: 'spell',
  DEFEND: 'defend',
  DEBUFF: 'debuff',
};

export const INTENT_CONFIG = {
  [INTENT_TYPES.ATTACK]: { label: 'Striking', icon: '⚔️', color: 'text-red-400', threat: 'medium' },
  [INTENT_TYPES.HEAVY_ATTACK]: { label: 'Charging Heavy Slam', icon: '💥', color: 'text-red-500 font-bold', threat: 'lethal' },
  [INTENT_TYPES.SPELL]: { label: 'Channeling Dark Magic', icon: '🔮', color: 'text-purple-400', threat: 'high' },
  [INTENT_TYPES.DEFEND]: { label: 'Bracing Shield', icon: '🛡️', color: 'text-blue-400', threat: 'low' },
  [INTENT_TYPES.DEBUFF]: { label: 'Hissing Curse', icon: '☠️', color: 'text-emerald-400', threat: 'medium' },
};

export function predictEnemyIntent(enemy, turnNumber = 1) {
  if (!enemy) return null;

  // Pattern based on health threshold or turn rotation
  const isEnraged = (enemy.hp / (enemy.maxHp || 20)) < 0.35;
  if (isEnraged && Math.random() > 0.4) {
    return {
      type: INTENT_TYPES.HEAVY_ATTACK,
      damageEstimate: '8-14',
      description: 'The creature lashes out in desperate fury!',
      ...INTENT_CONFIG[INTENT_TYPES.HEAVY_ATTACK]
    };
  }

  const pool = [INTENT_TYPES.ATTACK, INTENT_TYPES.ATTACK, INTENT_TYPES.SPELL, INTENT_TYPES.DEFEND];
  const chosen = pool[turnNumber % pool.length];

  return {
    type: chosen,
    damageEstimate: chosen === INTENT_TYPES.ATTACK ? '4-8' : (chosen === INTENT_TYPES.SPELL ? '6-10' : '0'),
    description: chosen === INTENT_TYPES.DEFEND ? 'Preparing to parry your strikes.' : 'Focusing its gaze on the party vanguard.',
    ...INTENT_CONFIG[chosen]
  };
}

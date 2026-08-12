/**
 * Status Effect Management Service
 * Handles turn-based damage over time, debuffs, buffs, and status ticking.
 */

export const STATUS_TYPES = {
  BLEED: 'bleed',
  POISON: 'poison',
  BURN: 'burn',
  STUN: 'stun',
  SHIELDED: 'shielded',
  HASTE: 'haste',
};

export const STATUS_DEFINITIONS = {
  [STATUS_TYPES.BLEED]: {
    name: 'Bleeding',
    icon: '🩸',
    color: 'text-red-500',
    description: 'Takes physical slashing damage at the start of each turn.',
    tickDamage: (potency) => Math.max(2, Math.floor(potency * 1.5)),
  },
  [STATUS_TYPES.POISON]: {
    name: 'Poisoned',
    icon: '🧪',
    color: 'text-emerald-500',
    description: 'Takes nature/toxic damage and has disadvantage on attack rolls.',
    tickDamage: (potency) => Math.max(3, potency * 2),
  },
  [STATUS_TYPES.BURN]: {
    name: 'Burning',
    icon: '🔥',
    color: 'text-amber-500',
    description: 'Engulfed in flames. Deals continuous fire damage.',
    tickDamage: (potency) => Math.max(4, potency * 2),
  },
  [STATUS_TYPES.STUN]: {
    name: 'Stunned',
    icon: '⚡',
    color: 'text-yellow-400',
    description: 'Incapacitated. Skips current combat action.',
    tickDamage: () => 0,
  },
  [STATUS_TYPES.SHIELDED]: {
    name: 'Shielded',
    icon: '🛡️',
    color: 'text-blue-400',
    description: 'Absorbs incoming damage before health is depleted.',
    tickDamage: () => 0,
  },
  [STATUS_TYPES.HASTE]: {
    name: 'Haste',
    icon: '✨',
    color: 'text-purple-400',
    description: 'Heightened reflexes grant +2 AC and an additional action.',
    tickDamage: () => 0,
  },
};

export function createStatusEffect(type, duration = 3, potency = 1) {
  const def = STATUS_DEFINITIONS[type] || {};
  return {
    id: `status_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    type,
    name: def.name || type,
    icon: def.icon || '✨',
    duration,
    potency,
    appliedAt: Date.now(),
  };
}

export function tickTargetEffects(target) {
  if (!target || !target.statusEffects) return { target, damageDealt: 0, expired: [] };

  let totalDamage = 0;
  const active = [];
  const expired = [];

  for (const effect of target.statusEffects) {
    const def = STATUS_DEFINITIONS[effect.type];
    if (def && typeof def.tickDamage === 'function') {
      totalDamage += def.tickDamage(effect.potency);
    }
    const remaining = effect.duration - 1;
    if (remaining > 0) {
      active.push({ ...effect, duration: remaining });
    } else {
      expired.push(effect);
    }
  }

  const newHp = Math.max(0, target.hp - totalDamage);
  return {
    target: { ...target, hp: newHp, statusEffects: active },
    damageDealt: totalDamage,
    expired,
  };
}

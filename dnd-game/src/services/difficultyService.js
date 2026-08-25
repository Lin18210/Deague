export function recommendDifficulty(deathCount) {
  if (deathCount >= 15) return 'easy';
  if (deathCount >= 8)  return 'normal';
  return 'hard';
}
export function scaleEnemy(base, difficulty) {
  const mult = { easy: 0.75, normal: 1.0, hard: 1.4 }[difficulty] || 1.0;
  return { ...base, maxHp: Math.round(base.maxHp * mult), hp: Math.round(base.maxHp * mult) };
}

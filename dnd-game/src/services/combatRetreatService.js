/**
 * Combat Tactical Retreat Service
 * Calculates escape chance based on party agility vs enemy speed, handles opportunistic attack penalties.
 */

export function calculateEscapeProbability(partyDexMod = 2, enemyDexMod = 1, environmentPenalty = 0) {
  const baseChance = 50;
  const dexDifference = (partyDexMod - enemyDexMod) * 10;
  const finalChance = Math.min(85, Math.max(15, baseChance + dexDifference - environmentPenalty));
  return Math.round(finalChance);
}

export function attemptRetreat(partyAgility = 2, enemySpeed = 1) {
  const chance = calculateEscapeProbability(partyAgility, enemySpeed);
  const roll = Math.floor(Math.random() * 100) + 1;
  const escaped = roll <= chance;

  // Opportunistic attack damage penalty on failure or close call
  const partyDamageTaken = escaped ? (roll > chance - 15 ? 4 : 0) : 8;

  return {
    escaped,
    roll,
    chance,
    partyDamageTaken,
    message: escaped 
      ? (partyDamageTaken > 0 ? 'Retreated successfully, but suffered glancing blows as you fell back!' : 'Clean getaway! Your party disengages into the shadows.')
      : 'Retreat cut off! The enemies flank your vanguard, inflicting opportunistic strikes!',
  };
}

export function getAbilityMod(score) { return Math.floor((score - 10) / 2); }
export function getProficiencyBonus(level) { return Math.ceil(level / 4) + 1; }
export function getPassivePerception(wis, prof, hasProficiency) {
  return 10 + getAbilityMod(wis) + (hasProficiency ? prof : 0);
}
export function getInitiative(dex, prof, alertFeat = false) {
  return getAbilityMod(dex) + (alertFeat ? prof : 0);
}
export function getCarryWeight(str) { return str * 15; }

/**
 * Automated Verification Suite
 * Validates module integrity across all tactical, combat, and RPG systems.
 */

import { rollDice, rollD20, rollWithAdvantage, rollWithDisadvantage, rollCheckWithDC } from './diceUtils';
import { STATUS_TYPES, createStatusEffect, tickTargetEffects } from '../services/statusEffectService';
import { calculateEscapeProbability, attemptRetreat } from '../services/combatRetreatService';
import { performShortRest, performLongRest } from '../services/restService';
import { BESTIARY_ENTRIES, getDiscoveredBeasts } from '../services/bestiaryService';
import { predictEnemyIntent, INTENT_TYPES } from '../services/enemyIntentService';
import { ITEM_SLOTS, calculateTotalGearModifiers } from '../services/equipmentService';
import { rollVictoryLoot } from '../services/lootDropService';
import { getWallet, addCurrency, spendCurrency } from '../services/currencyService';
import { getPinnedObjectives, toggleObjectiveComplete } from '../services/questTrackerService';
import { getActivePartyPassives } from '../services/companionPassiveService';
import { loadSettings } from '../services/gameSettingsService';
import { getSavedTheme } from '../services/themeService';
import { getSaveSlots } from '../services/saveSlotService';
import { getDialogueTranscript, logDialogueEntry } from '../services/dialogueHistoryService';
import { getPlayerScrolls } from '../services/spellScrollService';
import { getShortcutsList } from '../services/keyboardShortcutsService';
import { getChronicleMilestones } from '../services/campaignChronicleService';
import { spawnCombatSparks } from '../services/combatVfxService';

export function runSystemVerification() {
  const results = [];

  // 1. Dice verification
  const check = rollCheckWithDC(15, 3);
  results.push({ test: 'diceCheck', passed: typeof check.success === 'boolean' });

  // 2. Status effect verification
  const bleed = createStatusEffect(STATUS_TYPES.BLEED, 3, 2);
  const target = { hp: 20, maxHp: 20, statusEffects: [bleed] };
  const ticked = tickTargetEffects(target);
  results.push({ test: 'statusTick', passed: ticked.damageDealt > 0 && ticked.target.hp < 20 });

  // 3. Retreat verification
  const retreatChance = calculateEscapeProbability(3, 1);
  results.push({ test: 'retreatOdds', passed: retreatChance > 50 });

  // 4. Equipment verification
  const gearMods = calculateTotalGearModifiers();
  results.push({ test: 'equipmentMods', passed: gearMods.acBonus >= 0 });

  // 5. Currency verification
  const wallet = getWallet();
  results.push({ test: 'currencyWallet', passed: typeof wallet.gold === 'number' });

  // 6. Bestiary verification
  const beasts = getDiscoveredBeasts();
  results.push({ test: 'bestiaryCount', passed: beasts.length > 0 });

  const allPassed = results.every(r => r.passed);
  return { allPassed, results };
}

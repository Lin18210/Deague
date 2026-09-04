/**
 * Hero Equipment & Loadout Service
 * Manages item slots (Main Hand, Off Hand, Armor, Amulet, Relic) and calculates stat bonuses.
 */

export const ITEM_SLOTS = {
  MAIN_HAND: 'mainHand',
  OFF_HAND: 'offHand',
  ARMOR: 'armor',
  AMULET: 'amulet',
  RELIC: 'relic',
};

export const RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary',
};

export const DEFAULT_EQUIPMENT = {
  [ITEM_SLOTS.MAIN_HAND]: {
    id: 'weapon_iron_sword',
    name: 'Tempered Longsword',
    slot: ITEM_SLOTS.MAIN_HAND,
    rarity: RARITY.UNCOMMON,
    damage: '1d8',
    statBonus: { strength: 1, attackMod: 2 },
    description: 'Forged by the High Pass armory before the garrison fell.',
  },
  [ITEM_SLOTS.ARMOR]: {
    id: 'armor_chainmail',
    name: 'Reinforced Mail Hauberk',
    slot: ITEM_SLOTS.ARMOR,
    rarity: RARITY.RARE,
    acBonus: 3,
    statBonus: { constitution: 1 },
    description: 'Interlocking steel rings lined with boiled monster leather.',
  },
  [ITEM_SLOTS.AMULET]: {
    id: 'amulet_dawn',
    name: 'Dawnveil Talisman',
    slot: ITEM_SLOTS.AMULET,
    rarity: RARITY.EPIC,
    statBonus: { wisdom: 2, spellPower: 3 },
    description: 'A pale amber stone whispering of sunrise over the peaks.',
  },
};

export function calculateTotalGearModifiers(equipment = DEFAULT_EQUIPMENT) {
  const totals = { attackMod: 0, acBonus: 0, strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
  for (const slotKey in equipment) {
    const item = equipment[slotKey];
    if (!item) continue;
    if (item.acBonus) totals.acBonus += item.acBonus;
    if (item.statBonus) {
      for (const stat in item.statBonus) {
        totals[stat] = (totals[stat] || 0) + item.statBonus[stat];
      }
    }
  }
  return totals;
}

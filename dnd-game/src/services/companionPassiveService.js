/**
 * Companion Passive Affinity Service
 * Grants passive aura bonuses to the party based on active companions and approval.
 */

export const COMPANION_PASSIVES = {
  lyra: {
    id: 'aura_of_dawn',
    name: 'Aura of the Dawnveil',
    icon: '✨',
    description: 'Radiant warmth grants +2 HP regeneration after rests and +1 to all saving throws vs Necrotic.',
    statBonus: { hpRegen: 2, necroticResist: 1 },
  },
  kael: {
    id: 'whispering_shadows',
    name: 'Whispering Shadows',
    icon: '🗡️',
    description: 'Silent steps increase party Critical Hit rate by +5% and grant +2 to Ambush/Stealth checks.',
    statBonus: { critChance: 5, stealthMod: 2 },
  },
  vorn: {
    id: 'ashmantle_fury',
    name: 'Ashmantle Vigor',
    icon: '🛡️',
    description: 'Unyielding resilience grants +4 Max HP to all party members and +1 Melee damage.',
    statBonus: { maxHpBonus: 4, meleeDamageBonus: 1 },
  },
};

export function getActivePartyPassives(companions = []) {
  const active = [];
  for (const comp of companions) {
    const key = comp.name?.toLowerCase() || comp.id?.toLowerCase();
    for (const pKey in COMPANION_PASSIVES) {
      if (key && key.includes(pKey)) {
        active.push({ ...COMPANION_PASSIVES[pKey], companionName: comp.name });
      }
    }
  }
  return active;
}

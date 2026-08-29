/**
 * Bestiary Knowledge Service
 * Catalogs defeated monsters, weaknesses, resistances, and lore notes.
 */

export const BESTIARY_ENTRIES = [
  {
    id: 'shadow_hound',
    name: 'Shadow Hound of the Pass',
    category: 'Beast / Fiend',
    cr: '1/2',
    weakness: 'Radiant, Fire',
    resistance: 'Cold, Necrotic',
    description: 'Canine horrors sculpted from high mountain frost and rift miasma. They stalk prey using sound and fear.',
    tactics: 'Focus them down with Radiant magic from Lyra before they flank into your blind spot.',
    unlocked: true,
  },
  {
    id: 'crypt_wight',
    name: 'Wight of Malveth',
    category: 'Undead',
    cr: '3',
    weakness: 'Bludgeoning, Holy Water',
    resistance: 'Slashing, Piercing',
    description: 'Ancient elven guard captains whose souls were frozen in eternal vigil by the dark breach.',
    tactics: 'Vorn\'s warhammers crush through their brittle armor far faster than blades.',
    unlocked: true,
  },
  {
    id: 'void_hierophant',
    name: 'Zal\'thrix Void Hierophant',
    category: 'Aberration',
    cr: '5',
    weakness: 'Force, Psychic',
    resistance: 'Poison, Psychic Resistance',
    description: 'Cult priests mutated by communion with the Far Realm eye. They siphon sanity to fuel dark spells.',
    tactics: 'Interrupt their chanting with Kael\'s silence daggers before their apocalyptic ritual finishes.',
    unlocked: false,
  },
];

export function getDiscoveredBeasts() {
  return BESTIARY_ENTRIES.filter(e => e.unlocked);
}

export function unlockBeastEntry(id) {
  const entry = BESTIARY_ENTRIES.find(e => e.id === id);
  if (entry) entry.unlocked = true;
  return entry;
}

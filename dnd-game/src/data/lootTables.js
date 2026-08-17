// Loot table definitions
export const LOOT_TABLES = {
  common: [
    { id: 'coin_pouch',    name: 'Coin Pouch',       desc: 'A bag of gold.',        type: 'gold',    value: 15  },
    { id: 'health_herb',   name: 'Healing Herb',     desc: 'Soothes minor wounds.', type: 'reagent', value: 8   },
  ],
  uncommon: [
    { id: 'vial_red',      name: 'Minor Potion',     desc: 'Restores 20 HP.',       type: 'potion',  value: 30, heal: 20 },
    { id: 'shadowglass',   name: 'Shadowglass Shard',desc: 'Arcane component.',      type: 'reagent', value: 25  },
  ],
  rare: [
    { id: 'elixir_power',  name: 'Elixir of Power',  desc: '+3 ATK for one battle.',type: 'potion',  value: 80, statBonus: { atk: 3 } },
    { id: 'rune_plate',    name: 'Rune-Etched Plate', desc: '+5 AC permanently.',    type: 'armor',   value: 120, statBonus: { ac: 5 }, equipped: false },
  ],
};
export function rollLoot(tier = 'common') {
  const t = LOOT_TABLES[tier] || LOOT_TABLES.common;
  return t[Math.floor(Math.random() * t.length)];
}

// Bestiary flavour text
export const ENEMY_LORE = {
  'Void Sentinel'  : "A shard of the Dreaming One's will. It cannot feel pain — only hunger.",
  'Crypt Warden'   : "Once a knight of the Silver Order. The vault's corruption stripped her of mercy.",
  'Shadow Stalker' : "It moves between heartbeats, leaving only the cold certainty of doom.",
  'Forge Golem'    : "Hammered from living iron and bound by dwarven runes older than memory.",
  'Seraphax'       : "The Void Herald. Do not speak its true name.",
  'Boneclaw'       : "Stitched remains of a dozen adventurers, animated by spite alone.",
};
export function getLore(name) {
  for (const k of Object.keys(ENEMY_LORE))
    if (name.toLowerCase().includes(k.toLowerCase())) return ENEMY_LORE[k];
  return 'Little is known about this creature. Approach with caution.';
}

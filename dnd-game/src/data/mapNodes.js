export const MAP_REGIONS = [
  { id: 'high_pass',        label: 'High Pass',            act: 1, x: 20, y: 15, icon: 'mountain' },
  { id: 'sunken_vault',     label: 'Sunken Vault',          act: 2, x: 40, y: 35, icon: 'building' },
  { id: 'void_rift',        label: 'Void Rift',             act: 3, x: 65, y: 25, icon: 'swirl'    },
  { id: 'under_empire',     label: 'Dwarven Under-Empire',  act: 4, x: 30, y: 60, icon: 'axe'      },
  { id: 'dreaming_chamber', label: 'Chamber of Dreaming',   act: 5, x: 55, y: 70, icon: 'eye'      },
];
export function getRegionForNode(nodeId) {
  if (nodeId.startsWith('vault'))   return MAP_REGIONS[1];
  if (nodeId.startsWith('void'))    return MAP_REGIONS[2];
  if (nodeId.startsWith('forge') || nodeId.startsWith('under')) return MAP_REGIONS[3];
  if (nodeId.startsWith('chamber') || nodeId.startsWith('final')) return MAP_REGIONS[4];
  return MAP_REGIONS[0];
}

/**
 * Quest Tracker & Active Objective Service
 * Maintains current pin-to-HUD objectives and tracks multi-step milestones.
 */

export const ACTIVE_QUEST_OBJECTIVES = [
  {
    id: 'obj_broken_seal',
    act: 1,
    title: 'The High Pass: Broken Seal',
    step: 'Inspect the glowing frost runes on the mountain gate',
    completed: true,
  },
  {
    id: 'obj_crypt_keys',
    act: 2,
    title: 'Sunken Vault of Malveth',
    step: 'Recover the Captain\'s Silver Mythal-Key from the wights',
    completed: false,
  },
  {
    id: 'obj_stop_ritual',
    act: 3,
    title: 'Void Rift Incursion',
    step: 'Disrupt the Cultists\' sanity-siphoning monolith',
    completed: false,
  },
];

export function getPinnedObjectives() {
  return [...ACTIVE_QUEST_OBJECTIVES];
}

export function toggleObjectiveComplete(id) {
  const found = ACTIVE_QUEST_OBJECTIVES.find(o => o.id === id);
  if (found) {
    found.completed = !found.completed;
  }
  return [...ACTIVE_QUEST_OBJECTIVES];
}

/**
 * Campaign Chronicle Summary Service
 * Summarizes the player journey, moral choices, companion fates, and unlocked endings.
 */

export const CAMPAIGN_MILESTONES = [
  {
    act: 1,
    title: 'Act I: High Mountain Pass — The Broken Seal',
    summary: 'Braved the blizzard, awoken the ancient frost runes, and defended against the vanguard of shadow hounds.',
    decision: 'Stood resolute alongside Lyra Dawnveil to preserve the light.',
    status: 'completed',
  },
  {
    act: 2,
    title: 'Act II: The Sunken Vault of Malveth',
    summary: 'Entered the silent subterranean ruins and faced Captain Malveth in the flooded crypt.',
    decision: 'Refused the dark bargain and purified Malveth\'s corrupted spirit.',
    status: 'completed',
  },
  {
    act: 3,
    title: 'Act III: Void Rift Incursion',
    summary: 'Infiltrated the cultists\' sanctuary at the boundary of known space.',
    decision: 'Rescued the trapped dwarven miners before sealing the rift conduit.',
    status: 'in_progress',
  },
];

export function getChronicleMilestones() {
  return [...CAMPAIGN_MILESTONES];
}

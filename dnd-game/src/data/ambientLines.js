export const AMBIENT_BANTER = [
  { speaker: 'Lyra', line: "I keep dreaming of the Moonsea. Like it's calling me back." },
  { speaker: 'Kael', line: "Every lock's a puzzle. Every vault's a story." },
  { speaker: 'Vorn', line: "The ancestors are near tonight. I can smell them in the smoke." },
  { speaker: 'Lyra', line: "This silence isn't peaceful. It's waiting." },
  { speaker: 'Kael', line: "I don't trust anyone who smiles this far underground." },
  { speaker: 'Vorn', line: "Stone does not lie. It only endures." },
  { speaker: 'Lyra', line: "Lathander's light reaches even here. I have to believe that." },
];
export function getRandomBanter() {
  return AMBIENT_BANTER[Math.floor(Math.random() * AMBIENT_BANTER.length)];
}


// Tactical retreat companion reactions
export const RETREAT_BANTER = {
  lyra: [
    "A tactical withdrawal preserves our sacred mission! We live to cast another day.",
    "Regroup behind my barrier! The Dawnveil light covers our retreat!",
    "No shame in wisdom over slaughter. Tend your wounds!",
  ],
  kael: [
    "Finally, someone talking sense! Shadows take us!",
    "Smoke bomb out! Let's see them track footprints through thin air.",
    "He who runs away lives to loot another day. Move, move!",
  ],
  vorn: [
    "GRAAAH! I am not finished with their skulls!",
    "Fine! A tactical leap backward, but we return with heavier steel!",
    "Keep moving! Vorn holds the rear guard!",
  ],
};

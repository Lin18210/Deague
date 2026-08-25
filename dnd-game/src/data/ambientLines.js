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

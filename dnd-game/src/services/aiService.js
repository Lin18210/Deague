const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const MODEL = import.meta.env.VITE_AI_MODEL || 'google/gemini-2.5-flash';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const isApiConfigured = () => API_KEY && API_KEY !== 'sk-or-v1-your-api-key-here';

async function callAI(messages) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`,
      'HTTP-Referer': window.location.origin,
      'X-Title': 'DnD Quest Master',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.85,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const DM_SYSTEM_PROMPT = `You are a master Dungeon Master running a solo D&D 5e campaign. Your role is absolute: you ARE the world. Every NPC, every creaking floorboard, every consequence flows through you.

CORE PRINCIPLES:
- Immersion first. Use all senses: sight, sound, smell, touch, atmosphere.
- The world reacts. Every player choice has consequences that ripple forward.
- NPCs have personalities, memories, and motivations. They remember how the player treated them.
- Combat is visceral and dangerous. Describe wounds, battle cries, the weight of steel.
- Never break character. You are the narrator of a living story, not a chatbot.
- Be specific. Name the NPCs. Describe their appearance, voice, mannerisms.
- Tension matters. Foreshadow danger. Let consequences build.

STORYTELLING RULES:
- What the player does MATTERS. If they insult a guard, that guard (and their captain) will remember. If they help a stranger, that stranger may reappear as an ally.
- Track the world state. If the tavern catches fire, describe the smoke, the panic, and the aftermath in future scenes.
- Choices have mechanical and narrative weight. Violence has consequences. Diplomacy opens doors. Stealth changes the approach.
- The player can fail. Bad rolls or poor decisions lead to setbacks — but never dead ends.
- Reward creativity. If the player thinks outside the box, acknowledge it.

RESPONSE FORMAT:
You MUST respond with ALL sections:

[NARRATIVE]
Your immersive, dramatic description. 2-4 paragraphs. Include sensory details, NPC reactions, and immediate consequences of the player's action. Make every word count.
[/NARRATIVE]

[CHOICES]
- A clear, actionable choice reflecting the new situation
- Another distinct choice with different risk/reward
- A third choice offering an alternative approach
[/CHOICES]

[FLAGS]
Set consequence flags to track world state. Use the format "key:value" (one per line). Examples:
betrayedTheGuild:true
guardAlertLevel:3
helpedTheWidow:true

Track NPC attitudes: "npc:Name: attitude" where attitude is hostile/suspicious/neutral/friendly/ally.
Track quests: "quest:[active|completed|failed] Quest Name"
Track location: "location: New Location Name"
Track significant events: "event: The tavern was set ablaze"
[/FLAGS]

CRITICAL: The [FLAGS] section determines how the world remembers the player's actions. Be thorough and consistent. Every meaningful action should set a flag.`;

export async function generateNarrative(scene, playerAction, character, storyContext = '') {
  if (!isApiConfigured()) {
    return getFallbackNarrative(scene, playerAction);
  }

  const userPrompt = `=== PLAYER CHARACTER ===
${character.name}, Level ${character.level} ${character.class}
STR ${character.stats.STR} | DEX ${character.stats.DEX} | CON ${character.stats.CON} | INT ${character.stats.INT} | WIS ${character.stats.WIS} | CHA ${character.stats.CHA}
HP: ${character.health}/${character.maxHealth} | Mana: ${character.mana}/${character.maxMana} | AC: ${character.ac}
Weapons: ${character.weapons.map(w => `${w.name} (${w.damage}+${w.bonus})`).join(', ')}
Spells: ${character.spells.map(s => s.name).join(', ')}
Inventory: ${character.inventory.join(', ')}

=== CURRENT SCENE ===
"${scene.title}" — ${scene.description}

${storyContext}

=== PLAYER ACTION ===
The player chose: "${playerAction}"

As the Dungeon Master, narrate what happens next. Be dramatic, immersive, and specific. Make the world react to this choice. Include the [NARRATIVE], [CHOICES], and [FLAGS] sections as specified in your instructions.`;

  try {
    const result = await callAI([
      { role: 'system', content: DM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    return parseAIResponse(result);
  } catch (err) {
    console.error('AI generation failed:', err);
    return getFallbackNarrative(scene, playerAction);
  }
}

export async function generateCombatNarration(actor, action, result, target, combatContext = '') {
  if (!isApiConfigured()) {
    return getFallbackCombatNarration(actor, action, result, target);
  }

  const systemPrompt = `You narrate D&D combat in a vivid, dramatic fantasy style. Use sensory details, describe the impact of blows, the flash of steel, the crackle of magic. Each narration is one short, punchy sentence (under 25 words). Be specific about what the attack looks and sounds like. Vary your descriptions — never repeat a phrase. For critical hits, be especially dramatic. For misses, describe the near-miss vividly. For fumbles, add a touch of dark humor without mocking the character.`;

  const userPrompt = `${combatContext}
Combat action to narrate: ${actor} uses ${action} against ${target || 'the enemy'}.
Result: ${result}

Narrate in one short, dramatic sentence:`;

  try {
    const narration = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    return narration.trim();
  } catch {
    return getFallbackCombatNarration(actor, action, result, target);
  }
}

export async function generateCombatOutcome(character, enemy, victory, combatLog, storyContext = '') {
  if (!isApiConfigured()) {
    return victory
      ? `Victory! ${enemy.name} lies defeated at ${character.name}'s feet.`
      : `Defeat... ${character.name} has fallen to ${enemy.name}.`;
  }

  const outcome = victory
    ? `${character.name} has DEFEATED ${enemy.name}.`
    : `${character.name} was DEFEATED by ${enemy.name}.`;

  const userPrompt = `${storyContext}

Combat has ended: ${outcome}

Recent combat events:
${combatLog.slice(-8).join('\n')}

Describe the aftermath in 2-3 dramatic paragraphs. Include sensory details, the state of the battlefield, and immediate consequences. End with 2-3 clear choices for what the player does next. Use the standard [NARRATIVE], [CHOICES], [FLAGS] format.`;

  try {
    const result = await callAI([
      { role: 'system', content: DM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    return parseAIResponse(result);
  } catch {
    return getFallbackNarrative({ title: 'Aftermath', description: outcome }, 'survey the aftermath');
  }
}

export async function generateBackstory(character) {
  if (!isApiConfigured()) {
    return {
      narrative: `${character.name}, a level ${character.level} ${character.class}, stands ready for adventure. The world awaits a hero — or a legend.`,
    };
  }

  const userPrompt = `The player is ${character.name}, a level ${character.level} ${character.class}.
Stats: STR ${character.stats.STR}, DEX ${character.stats.DEX}, CON ${character.stats.CON}, INT ${character.stats.INT}, WIS ${character.stats.WIS}, CHA ${character.stats.CHA}.
Equipment: ${character.inventory.join(', ')}.

Generate a compelling 2-3 paragraph backstory that explains why this adventurer is at the Crossroads Tavern tonight. Include a personal motivation, a past failure or regret, and a hint of destiny. Make it feel like the opening of a fantasy novel. Use only [NARRATIVE] tags.`;

  try {
    const result = await callAI([
      { role: 'system', content: DM_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ]);
    const match = result.match(/\[NARRATIVE\]([\s\S]*?)\[\/NARRATIVE\]/i);
    return { narrative: match ? match[1].trim() : result.trim() };
  } catch {
    return {
      narrative: `${character.name}, a level ${character.level} ${character.class}, stands ready for adventure. The world awaits a hero — or a legend.`,
    };
  }
}

function parseAIResponse(text) {
  const narrativeMatch = text.match(/\[NARRATIVE\]([\s\S]*?)\[\/NARRATIVE\]/i);
  const choicesMatch = text.match(/\[CHOICES\]([\s\S]*?)\[\/CHOICES\]/i);
  const flagsMatch = text.match(/\[FLAGS\]([\s\S]*?)\[\/FLAGS\]/i);

  const narrative = narrativeMatch
    ? narrativeMatch[1].trim()
    : text.split('[CHOICES]')[0].replace('[NARRATIVE]', '').replace('[FLAGS]', '').trim();

  const choices = choicesMatch
    ? choicesMatch[1]
        .trim()
        .split('\n')
        .map((c) => c.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  const flagsBlock = flagsMatch ? flagsMatch[1].trim() : null;

  return { narrative, choices, flagsBlock };
}

function getFallbackNarrative(scene, playerAction) {
  const actionText = playerAction.replace(/^\[DM DIRECTIVE[^\]]*\]:\s*/, '');

  const narrations = [
    `You ${actionText.toLowerCase()}. The air inside the Crossroads Tavern grows thick with the scent of hearth smoke and spilled mead. A half-orc barkeep watches from behind the counter, his scarred hands pausing mid-polish on a copper tankard. The other patrons — a hooded elf in the corner, two dwarven miners arguing over dice — turn briefly before returning to their own business. The fire crackles, casting dancing shadows across the worn oak floorboards.`,
    `With deliberate intent, you ${actionText.toLowerCase()}. The old tavern groans around you, its timbers settled by decades of storms and stories. A chill draft slips through a crack in the window frame, making the lantern flames gutter. From the kitchen, the clatter of pots and the aroma of rabbit stew drift into the common room. Whatever happens next, you feel the weight of unseen eyes and the whisper of fate threading through the smoke.`,
    `Acting on instinct, you ${actionText.toLowerCase()}. Outside the fogged windows, the evening has deepened into true night. The signboard of the Crossroads Tavern creaks on its chains, a lonely sound against the distant howl of something in the woods. Inside, the tension is palpable — a string pulled taut, waiting to snap. The barkeep clears his throat. "Travelers don't usually carry themselves like you do," he mutters. "Something's brewing."`,
    `You ${actionText.toLowerCase()}. The world responds in kind — a dog barks in the stable yard, a horse stamps its hoof, and from the far corner of the tavern, a hooded figure shifts in their seat. The candle on their table gutters and dies, leaving only a wisp of smoke curling toward the rafters. When you look again, the figure is gone.`,
    `Without hesitation, you ${actionText.toLowerCase()}. The barkeep's eyes narrow. He sets down the tankard with a deliberate thud. "Careful now," he says, his voice a low rumble. "The Crossroads sees all manner of folk pass through. Some leave stories behind. Others leave blood." He gestures toward a notice board near the hearth, where yellowed parchments flutter in the draft — bounties, warnings, and a map torn at the edges.`,
    `Steeling yourself, you ${actionText.toLowerCase()}. The tavern's atmosphere shifts perceptibly. Conversations drop to murmurs. A dwarven miner scoops up his dice and pockets them. The half-orc barkeep exhales slowly through his teeth and reaches beneath the counter — not for a weapon, but for a dusty ledger bound in leather. "If you're looking for trouble," he says, tapping the book, "you might want to read what's already found us first."`,
    `With growing confidence, you ${actionText.toLowerCase()}. The lantern light seems to brighten around you, as if the tavern itself acknowledges your presence. An old woman by the hearth — one you hadn't noticed before — looks up from her knitting and meets your eyes. She smiles, but there is no warmth in it. "The crossroads bring all kinds," she says softly. "Heroes. Fools. The dead who don't know they're dead yet. Which are you?"`,
  ];

  const choiceSets = [
    ['Speak with the half-orc barkeep', 'Approach the hooded elf in the corner', 'Examine the notice board near the hearth'],
    ['Ask the barkeep about local trouble', 'Order a meal and listen to the gossip', 'Head outside to investigate the stables'],
    ['Confront the barkeep about his cryptic warning', 'Check the wanted posters on the wall', 'Strike up a conversation with the dwarven miners'],
    ['Look for where the hooded figure went', 'Ask the barkeep about the vanished stranger', 'Search the corner table for clues'],
    ['Read the notices on the board', 'Ask what kind of trouble the barkeep means', 'Introduce yourself properly to the room'],
    ['Ask to see the ledger', 'Inquire about the old woman by the hearth', 'Step outside and scan the perimeter'],
    ['Answer the old woman', 'Ask the barkeep about her', 'Ignore the crone and focus on your mission'],
  ];

  const idx = Math.floor(Math.random() * narrations.length);
  const choiceIdx = idx % choiceSets.length;
  return {
    narrative: narrations[idx],
    choices: choiceSets[choiceIdx],
    flagsBlock: null,
  };
}

function getFallbackCombatNarration(actor, action, result, target) {
  const isCrit = result.toLowerCase().includes('critical');
  const isMiss = result.toLowerCase().includes('miss');

  if (isCrit) {
    const crits = [
      `${actor}'s ${action} tears through ${target || 'the enemy'} with devastating force!`,
      `A perfect strike — ${actor} drives ${action} home with lethal precision!`,
      `${actor} finds a gap in the armor and ${action} lands with bone-shattering impact!`,
    ];
    return crits[Math.floor(Math.random() * crits.length)];
  }

  if (isMiss) {
    const misses = [
      `${actor}'s ${action} whistles past ${target || 'the enemy'}, missing by inches.`,
      `${target || 'The enemy'} dodges as ${actor}'s ${action} swings wide.`,
      `${actor} presses the attack but ${action} fails to connect.`,
    ];
    return misses[Math.floor(Math.random() * misses.length)];
  }

  const hits = [
    `${actor}'s ${action} strikes true against ${target || 'the enemy'}.`,
    `With a fierce cry, ${actor} lands a solid ${action} on ${target || 'the enemy'}.`,
    `${actor} delivers ${action} — it connects with satisfying force.`,
  ];
  return hits[Math.floor(Math.random() * hits.length)];
}

export { isApiConfigured };

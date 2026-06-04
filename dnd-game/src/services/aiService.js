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
      temperature: 0.8,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`AI API error: ${response.status} - ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

export async function generateNarrative(scene, playerAction, character) {
  if (!isApiConfigured()) {
    return getFallbackNarrative(scene, playerAction);
  }

  const systemPrompt = `You are a Dungeon Master for a D&D 5e game. Be dramatic, immersive, and speak in a fantasy style. Keep responses to 2-4 paragraphs. Never break character. The player character is ${character.name}, a level ${character.level} ${character.class}.`;

  const userPrompt = `Scene: "${scene.title}" - ${scene.description}

The player chose: "${playerAction}"

As the Dungeon Master, describe what happens next in an immersive, dramatic way. Include sensory details (sights, sounds, smells). End with 3-4 clear choices for the player's next action. Format your response like this:

[NARRATIVE]
Your immersive description here...
[/NARRATIVE]

[CHOICES]
- Choice 1
- Choice 2
- Choice 3
[/CHOICES]`;

  try {
    const result = await callAI([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ]);
    return parseAIResponse(result);
  } catch (err) {
    console.error('AI generation failed:', err);
    return getFallbackNarrative(scene, playerAction);
  }
}

export async function generateCombatNarration(actor, action, result, target) {
  if (!isApiConfigured()) {
    return getFallbackCombatNarration(actor, action, result, target);
  }

  const prompt = `Describe the following D&D combat action in one short, dramatic sentence:

${actor} uses ${action} against ${target || 'the enemy'}.
Result: ${result}

Keep it under 20 words. Just the narration, no labels.`;

  try {
    const result = await callAI([
      { role: 'user', content: prompt },
    ]);
    return result.trim();
  } catch {
    return getFallbackCombatNarration(actor, action, result, target);
  }
}

function parseAIResponse(text) {
  const narrativeMatch = text.match(/\[NARRATIVE\]([\s\S]*?)\[\/NARRATIVE\]/i);
  const choicesMatch = text.match(/\[CHOICES\]([\s\S]*?)\[\/CHOICES\]/i);

  const narrative = narrativeMatch
    ? narrativeMatch[1].trim()
    : text.split('[CHOICES]')[0].replace('[NARRATIVE]', '').trim();

  const choices = choicesMatch
    ? choicesMatch[1]
        .trim()
        .split('\n')
        .map((c) => c.replace(/^[-*]\s*/, '').trim())
        .filter(Boolean)
        .slice(0, 4)
    : [];

  return { narrative, choices };
}

function getFallbackNarrative(scene, playerAction) {
  const narrations = [
    `You ${playerAction.toLowerCase()}. The air around you crackles with arcane energy as the world shifts in response. Shadows dance at the edge of the lantern light, and you feel the weight of unseen eyes upon you.`,
    `Acting on instinct, you ${playerAction.toLowerCase()}. A nearby patron glances up from their tankard, one eyebrow raised. The barkeep wipes the counter with a practiced motion, pretending not to notice. The tavern hums with quiet tension.`,
    `With determination, you ${playerAction.toLowerCase()}. The old floorboards creak beneath your boots as the scent of hearth smoke and spilled ale fills your lungs. Something stirs in the darkness beyond the window.`,
  ];

  const choiceSets = [
    [
      'Investigate the strange sounds from outside',
      'Strike up a conversation with the barkeep',
      'Check your equipment and prepare for trouble',
    ],
    [
      'Look for clues about recent events in town',
      'Order a meal and listen to the local gossip',
      'Head upstairs to find a room for the night',
    ],
    [
      'Ask the barkeep about work for adventurers',
      'Confront the suspicious patron in the corner',
      'Step outside to patrol the perimeter',
    ],
  ];

  const idx = Math.floor(Math.random() * narrations.length);
  return {
    narrative: narrations[idx],
    choices: choiceSets[idx],
  };
}

function getFallbackCombatNarration(actor, action, result, target) {
  const templates = [
    `${actor} ${action.toLowerCase()}${target ? ' at ' + target : ''} — ${result}!`,
    `With a fierce cry, ${actor} ${action.toLowerCase()} — ${result}!`,
    `${actor}'s ${action.toLowerCase()} lands with ${result}!`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export { isApiConfigured };

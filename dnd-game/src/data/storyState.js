export const initialStoryState = {
  flags: {},
  questLog: [],
  majorEvents: [],
  currentLocation: 'The Crossroads Tavern',
  visitedLocations: ['The Crossroads Tavern'],
  npcAttitudes: {},
  sceneHistory: [],
  playerReputation: 0,
};

export function createStoryContext(storyState, character, scene, gameLog, recentNarrative) {
  const recentLogs = gameLog.slice(0, 15).map(e => e.text).reverse().join('\n');

  const flagsSummary = Object.keys(storyState.flags).length > 0
    ? Object.entries(storyState.flags)
        .map(([k, v]) => `  - ${k}: ${v}`)
        .join('\n')
    : '  (none yet)';

  const npcSummary = Object.keys(storyState.npcAttitudes).length > 0
    ? Object.entries(storyState.npcAttitudes)
        .map(([k, v]) => `  - ${k}: ${v}`)
        .join('\n')
    : '  (none encountered yet)';

  const questSummary = storyState.questLog.length > 0
    ? storyState.questLog.map(q => `  - [${q.status}] ${q.title}`).join('\n')
    : '  (no quests active)';

  const recentNarrativeBlock = recentNarrative
    ? `\nMost recent narrative:\n"${recentNarrative}"\n`
    : '';

  return `=== STORY STATE ===
Current location: ${storyState.currentLocation}
Locations visited: ${storyState.visitedLocations.join(', ')}
Player reputation: ${storyState.playerReputation} (scale: -10 to +10)

Story flags (consequences of past actions):
${flagsSummary}

NPC attitudes:
${npcSummary}

Active quests:
${questSummary}

Major story events:
${storyState.majorEvents.map((e, i) => `  ${i + 1}. ${e}`).join('\n') || '  (none yet)'}
${recentNarrativeBlock}
=== RECENT EVENT LOG ===
${recentLogs || '(beginning of adventure)'}
=== END CONTEXT ===`;
}

export function parseFlags(aiText) {
  const flagsMatch = aiText.match(/\[FLAGS\]([\s\S]*?)\[\/FLAGS\]/i);
  if (!flagsMatch) return { flags: {}, quests: [], events: [], location: null, npcs: {} };

  const lines = flagsMatch[1].trim().split('\n').filter(Boolean);
  const flags = {};
  const quests = [];
  const events = [];
  const npcs = {};
  let location = null;

  for (const line of lines) {
    const trimmed = line.trim();

    if (trimmed.startsWith('location:')) {
      location = trimmed.replace(/^location:\s*/i, '').trim();
      continue;
    }

    if (trimmed.startsWith('quest:')) {
      const q = trimmed.replace(/^quest:\s*/i, '').trim();
      const match = q.match(/^\[(active|completed|failed)\]\s*(.+)/i);
      if (match) {
        quests.push({ status: match[1].toLowerCase(), title: match[2] });
      } else {
        quests.push({ status: 'active', title: q });
      }
      continue;
    }

    if (trimmed.startsWith('event:')) {
      events.push(trimmed.replace(/^event:\s*/i, '').trim());
      continue;
    }

    if (trimmed.startsWith('npc:')) {
      const npc = trimmed.replace(/^npc:\s*/i, '').trim();
      const match = npc.match(/^(.+?):\s*(.+)/);
      if (match) {
        npcs[match[1].trim()] = match[2].trim();
      }
      continue;
    }

    const eqIndex = trimmed.indexOf(':');
    if (eqIndex !== -1) {
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (value === 'true') flags[key] = true;
      else if (value === 'false') flags[key] = false;
      else {
        const num = Number(value);
        flags[key] = isNaN(num) ? value : num;
      }
    }
  }

  return { flags, quests, events, location, npcs };
}

export function applyConsequences(storyState, parsed, playerAction) {
  const next = { ...storyState };

  if (parsed.location) {
    if (!next.visitedLocations.includes(parsed.location)) {
      next.visitedLocations = [...next.visitedLocations, parsed.location];
    }
    next.currentLocation = parsed.location;
  }

  next.flags = { ...next.flags, ...parsed.flags };

  if (parsed.npcs) {
    next.npcAttitudes = { ...next.npcAttitudes, ...parsed.npcs };
  }

  if (parsed.events.length > 0) {
    next.majorEvents = [...next.majorEvents, ...parsed.events].slice(-20);
  }

  if (parsed.quests.length > 0) {
    const existingTitles = new Set(next.questLog.map(q => q.title));
    const updated = [...next.questLog];
    for (const q of parsed.quests) {
      if (existingTitles.has(q.title)) {
        const idx = updated.findIndex(eq => eq.title === q.title);
        updated[idx] = q;
      } else {
        updated.push(q);
        existingTitles.add(q.title);
      }
    }
    next.questLog = updated;
  }

  next.sceneHistory = [...next.sceneHistory, {
    action: playerAction,
    flags: parsed.flags,
    timestamp: Date.now(),
  }];

  return next;
}

export function computePlayerReputation(storyState) {
  const flags = storyState.flags;
  let rep = 0;

  const positiveActions = ['helpedSomeone', 'showedMercy', 'defendedInnocent', 'gaveGold', 'keptPromise', 'savedLife'];
  const negativeActions = ['stoleItem', 'attackedInnocent', 'brokePromise', 'threatenedCivilian', 'lied', 'fledFromDuty'];

  for (const key of positiveActions) {
    if (flags[key]) rep += 2;
  }
  for (const key of negativeActions) {
    if (flags[key]) rep -= 2;
  }

  return Math.max(-10, Math.min(10, rep));
}

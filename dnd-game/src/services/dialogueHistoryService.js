/**
 * Story & Dialogue History Transcript Service
 * Records chronologically all Dungeon Master narrations, choice decisions, and companion reactions.
 */

const _history = [];

export function logDialogueEntry(speaker, text, type = 'narration') {
  _history.push({
    id: `dlg_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
    speaker,
    text,
    type, // 'dm' | 'player_choice' | 'companion'
    timestamp: Date.now(),
  });
  if (_history.length > 100) _history.shift();
  return [..._history];
}

export function getDialogueTranscript() {
  return [..._history];
}


/**
 * Export transcript as plain text string
 */
export function exportTranscriptText() {
  return _history.map(e => `[${e.speaker}]: ${e.text}`).join('\n\n');
}

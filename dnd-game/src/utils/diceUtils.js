export function rollDie(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

export function rollDice(diceNotation) {
  const match = diceNotation.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) return { total: 0, rolls: [], modifier: 0, notation: diceNotation };

  const count = parseInt(match[1], 10);
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  const rolls = [];
  for (let i = 0; i < count; i++) {
    rolls.push(rollDie(sides));
  }

  const sum = rolls.reduce((a, b) => a + b, 0);
  return { total: sum + modifier, rolls, modifier, notation: diceNotation };
}

export function rollD20(modifier = 0) {
  const roll = rollDie(20);
  return {
    roll,
    total: roll + modifier,
    modifier,
    isCrit: roll === 20,
    isFumble: roll === 1,
  };
}

export function rollWithAdvantage(modifier = 0, sides = 20) {
  const r1 = rollDie(sides);
  const r2 = rollDie(sides);
  const better = Math.max(r1, r2);
  return {
    roll: better,
    result: better,
    total: better + modifier,
    modifier,
    rolls: [r1, r2],
    isCrit: better === sides,
    isFumble: better === 1,
    advantage: true,
    type: 'advantage',
  };
}

export function rollWithDisadvantage(modifier = 0, sides = 20) {
  const r1 = rollDie(sides);
  const r2 = rollDie(sides);
  const worse = Math.min(r1, r2);
  return {
    roll: worse,
    result: worse,
    total: worse + modifier,
    modifier,
    rolls: [r1, r2],
    isCrit: worse === sides,
    isFumble: worse === 1,
    disadvantage: true,
    type: 'disadvantage',
  };
}

// Roll history tracker
const _history = [];
export function recordRoll(label, value, max) {
  _history.unshift({ label, value, max, ts: Date.now() });
  if (_history.length > 20) _history.pop();
}
export function getRollHistory() { return [..._history]; }
export function clearRollHistory() { _history.length = 0; }


export function diceNotation(result) {
  return result?.notation || '1d20';
}

export function diceColor(total) {
  if (total === undefined || total === null) return 'text-amber-300';
  if (total >= 18) return 'text-yellow-400';
  if (total >= 12) return 'text-amber-300';
  if (total >= 6) return 'text-amber-50/80';
  return 'text-red-400';
}

export default function DiceRoller({ result, label }) {
  if (!result) return null;

  let display;
  if (result.notation) {
    display = (
      <div className="text-center">
        <div className={`text-3xl font-bold ${diceColor(result.total)} font-display`}>
          {result.total}
        </div>
        <div className="text-xs text-amber-50/40 mt-1">
          {result.rolls.join(' + ')}{result.modifier !== 0 ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : ''} = {result.total}
        </div>
      </div>
    );
  } else if (result.roll !== undefined) {
    display = (
      <div className="text-center">
        <div className={`text-3xl font-bold ${result.isCrit ? 'text-yellow-400 animate-pulse' : result.isFumble ? 'text-red-600' : 'text-amber-300'} font-display`}>
          {result.roll}
        </div>
        <div className="text-xs text-amber-50/40 mt-1">
          d20{result.modifier !== 0 ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : ''} = {result.total}
          {result.advantage && ` (adv: ${result.rolls[0]}, ${result.rolls[1]})`}
          {result.disadvantage && ` (dis: ${result.rolls[0]}, ${result.rolls[1]})`}
        </div>
        <div className="text-xs mt-0.5">
          {result.isCrit && <span className="text-yellow-400">🔥 CRITICAL HIT!</span>}
          {result.isFumble && <span className="text-red-500">💀 CRITICAL MISS!</span>}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-amber-900/20 rounded-lg p-4">
      {label && (
        <div className="text-xs text-amber-50/40 font-display uppercase tracking-wider text-center mb-2">
          {label}
        </div>
      )}
      {display}
    </div>
  );
}

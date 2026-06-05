import { useEffect, useState } from 'react';

function D20Icon({ roll, isCrit, isFumble }) {
  const [spinning, setSpinning] = useState(true);

  useEffect(() => {
    setSpinning(true);
    const t = setTimeout(() => setSpinning(false), 600);
    return () => clearTimeout(t);
  }, [roll]);

  const color = isCrit ? '#fbbf24' : isFumble ? '#ef4444' : '#f59e0b';

  return (
    <div className="relative w-20 h-20 mx-auto">
      <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-lg ${spinning ? 'animate-spin-slow' : ''}`}
        style={{ color }}>
        <polygon points="50,5 90,30 90,70 50,95 10,70 10,30" fill="currentColor" fillOpacity="0.12" stroke="currentColor" strokeWidth="1.5" />
        <polygon points="50,5 50,95" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.3" />
        <polygon points="10,30 90,30" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.3" />
        <polygon points="10,70 90,70" stroke="currentColor" strokeWidth="0.6" strokeOpacity="0.3" />
        <polygon points="50,5 10,30 50,55 90,30" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.8" />
        <polygon points="50,95 10,70 50,55 90,70" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth="0.8" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-amber-100 drop-shadow-[0_0_8px_rgba(252,211,77,0.4)]">
        {roll}
      </span>
    </div>
  );
}

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

  const rollValue = result.roll !== undefined ? result.roll : result.total;
  const isCrit = result.isCrit;
  const isFumble = result.isFumble;

  return (
    <div className="bg-slate-800 border border-amber-900/20 rounded-lg p-4">
      {label && (
        <div className="text-xs text-amber-50/40 font-display uppercase tracking-wider text-center mb-3">
          {label}
        </div>
      )}

      <D20Icon roll={rollValue} isCrit={isCrit} isFumble={isFumble} />

      {result.notation ? (
        <div className="text-center mt-2">
          <div className={`text-xl font-bold ${diceColor(result.total)} font-display`}>
            {result.total}
          </div>
          <div className="text-[10px] text-amber-50/40 mt-1">
            {result.rolls.join(' + ')}{result.modifier !== 0 ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : ''} = {result.total}
          </div>
        </div>
      ) : (
        <div className="text-center mt-2">
          <div className="text-xs text-amber-50/40">
            d20{result.modifier !== 0 ? ` ${result.modifier >= 0 ? '+' : ''}${result.modifier}` : ''} = {result.total}
            {result.advantage && ` (adv: ${result.rolls[0]}, ${result.rolls[1]})`}
            {result.disadvantage && ` (dis: ${result.rolls[0]}, ${result.rolls[1]})`}
          </div>
          <div className="text-[10px] mt-0.5">
            {result.isCrit && <span className="text-yellow-400 font-bold">🔥 CRITICAL HIT!</span>}
            {result.isFumble && <span className="text-red-500 font-bold">💀 CRITICAL MISS!</span>}
          </div>
        </div>
      )}
    </div>
  );
}

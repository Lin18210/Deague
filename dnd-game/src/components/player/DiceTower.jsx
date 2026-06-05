import { Dice5 } from 'lucide-react';

export default function DiceTower({ checkPending, onRollDice, diceRolling, rolledValue, resultMsg, rollSuccess, onResolveCheck }) {
  return (
    <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col items-center justify-center shadow-2xl relative min-h-[200px]">
      <div className="absolute top-2 left-3 text-[10px] tracking-widest uppercase text-stone-500 flex items-center gap-1.5" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <Dice5 size={14} className="text-amber-600" />
        <span>Arcane d20</span>
      </div>

      <div className={`absolute w-28 h-28 rounded-full border border-dashed transition-all duration-1000 flex items-center justify-center ${
        checkPending ? 'border-purple-500/20 bg-purple-950/5 animate-spin-slow' : 'border-stone-800/80'
      }`}>
        <div className="text-stone-950 opacity-10 text-5xl font-extrabold select-none">d20</div>
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center mt-3">
        <div className={`w-24 h-24 flex items-center justify-center relative select-none ${checkPending ? 'cursor-pointer hover:scale-105' : ''}`}
          onClick={checkPending ? onRollDice : undefined}>
          <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-2xl transition-transform duration-300 ${diceRolling ? 'animate-spin-slow text-purple-500' : 'text-amber-600'}`}>
            <polygon points="50,5 90,30 90,70 50,95 10,70 10,30" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
            <polygon points="50,5 50,95" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
            <polygon points="10,30 90,30" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
            <polygon points="10,70 90,70" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
            <polygon points="50,5 10,30 50,55 90,30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
            <polygon points="50,95 10,70 50,55 90,70" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
          </svg>

          {rolledValue !== undefined && (
            <span className={`absolute text-2xl font-extrabold tracking-tight z-20 ${
              diceRolling ? 'text-purple-400' :
              rolledValue === 20 ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]' :
              rolledValue === 1 ? 'text-red-500' : 'text-stone-100'
            }`}>
              {rolledValue}
            </span>
          )}
        </div>

        {resultMsg && (
          <div className="mt-3 text-center max-w-[200px] animate-ink-bleed">
            <p className={`text-[10px] font-bold ${rollSuccess ? 'text-emerald-400' : 'text-red-400'}`} style={{ fontFamily: 'system-ui, sans-serif' }}>
              {rollSuccess ? 'SUCCESS' : 'FAILURE'}
            </p>
            <p className="text-[10px] text-stone-400 leading-relaxed mt-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
              {resultMsg}
            </p>
            {onResolveCheck && (
              <button onClick={onResolveCheck}
                className="mt-2 px-3 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded border border-stone-700 text-[10px] font-medium transition-all cursor-pointer"
                style={{ fontFamily: 'system-ui, sans-serif' }}>
                Proceed Story
              </button>
            )}
          </div>
        )}

        {!resultMsg && checkPending && (
          <p className="text-[9px] text-purple-400 animate-pulse mt-3 text-center" style={{ fontFamily: 'system-ui, sans-serif' }}>
            * DC challenge active. Roll d20!
          </p>
        )}
      </div>
    </div>
  );
}

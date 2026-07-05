import { Swords } from 'lucide-react';

export default function InitiativeTracker({ initiativeOrder, activeIndex }) {
  if (!initiativeOrder || initiativeOrder.length === 0) return null;

  return (
    <div className="w-full bg-stone-950/80 border border-stone-800 rounded-xl p-3">
      <div className="flex items-center gap-2 mb-2">
        <Swords className="w-3.5 h-3.5 text-amber-500" />
        <span className="text-[9px] font-sans tracking-widest uppercase text-amber-500/80 font-bold">
          Initiative Order — Round Turn Sequence
        </span>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {initiativeOrder.map((entry, idx) => {
          const isActive = idx === activeIndex;
          const isDead = entry.hp <= 0;
          const isEnemy = entry.faction === 'enemy';
          const isPast = idx < activeIndex;

          return (
            <div
              key={entry.id + '-' + idx}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-lg border flex-shrink-0 transition-all duration-300
                ${isDead
                  ? 'opacity-25 border-stone-800 bg-stone-950 grayscale'
                  : isActive
                    ? isEnemy
                      ? 'border-red-500 bg-red-900/30 ring-1 ring-red-400 shadow-lg shadow-red-950/50 scale-110'
                      : 'border-amber-500 bg-amber-900/30 ring-1 ring-amber-400 shadow-lg shadow-amber-950/50 scale-110'
                    : isPast
                      ? 'opacity-40 border-stone-800 bg-stone-950/40'
                      : isEnemy
                        ? 'border-purple-800/60 bg-purple-950/20'
                        : 'border-stone-700 bg-stone-900/40'
                }
              `}
              style={{ minWidth: 56 }}
            >
              <span className="text-base leading-none">{entry.emoji}</span>
              <span className={`text-[9px] font-sans font-bold leading-tight text-center ${isActive ? (isEnemy ? 'text-red-300' : 'text-amber-300') : 'text-stone-400'}`}>
                {entry.name.split(' ')[0]}
              </span>
              <div className={`text-[8px] font-sans px-1.5 py-0.5 rounded-full border font-bold ${
                isActive
                  ? isEnemy ? 'bg-red-950/60 text-red-300 border-red-700/50' : 'bg-amber-950/60 text-amber-300 border-amber-700/50'
                  : 'bg-stone-950/60 text-stone-500 border-stone-800'
              }`}>
                {entry.initiative !== undefined ? `${entry.initiative >= 0 ? '+' : ''}${entry.initiative}` : '?'}
              </div>

              {isActive && !isDead && (
                <div className={`w-1.5 h-1.5 rounded-full animate-bounce ${isEnemy ? 'bg-red-400' : 'bg-amber-400'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

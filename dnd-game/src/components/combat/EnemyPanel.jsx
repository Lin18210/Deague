import { Heart, Skull, Target } from 'lucide-react';

const COLOR_MAP = {
  purple: { border: 'border-purple-500', bg: 'bg-purple-900/30', ring: 'ring-purple-400', bar: 'bg-purple-500', text: 'text-purple-300' },
  violet: { border: 'border-violet-500', bg: 'bg-violet-900/30', ring: 'ring-violet-400', bar: 'bg-violet-500', text: 'text-violet-300' },
  red:    { border: 'border-red-500',    bg: 'bg-red-900/30',    ring: 'ring-red-400',    bar: 'bg-red-500',    text: 'text-red-300'    },
  amber:  { border: 'border-amber-500',  bg: 'bg-amber-900/30',  ring: 'ring-amber-400',  bar: 'bg-amber-500',  text: 'text-amber-300'  },
  yellow: { border: 'border-yellow-500', bg: 'bg-yellow-900/30', ring: 'ring-yellow-400', bar: 'bg-yellow-500', text: 'text-yellow-300' },
  orange: { border: 'border-orange-500', bg: 'bg-orange-900/30', ring: 'ring-orange-400', bar: 'bg-orange-500', text: 'text-orange-300' },
  indigo: { border: 'border-indigo-500', bg: 'bg-indigo-900/30', ring: 'ring-indigo-400', bar: 'bg-indigo-500', text: 'text-indigo-300' },
  slate:  { border: 'border-slate-500',  bg: 'bg-slate-900/30',  ring: 'ring-slate-400',  bar: 'bg-slate-400',  text: 'text-slate-300'  },
};

function EnemyCard({ enemy, isActive, isSelected, isPlayerTurn, onSelect }) {
  const isDead = enemy.hp <= 0;
  const hpPct = (enemy.hp / enemy.maxHp) * 100;
  const colors = COLOR_MAP[enemy.colorClass] || COLOR_MAP.purple;

  return (
    <div
      onClick={() => !isDead && isPlayerTurn && onSelect(enemy.id)}
      className={`
        relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 select-none
        ${isDead
          ? 'opacity-30 border-stone-800 bg-stone-950/50 grayscale cursor-not-allowed'
          : isPlayerTurn
            ? `cursor-pointer hover:scale-[1.05] ${colors.bg} ${colors.border}`
            : `cursor-default ${colors.bg} ${colors.border}`
        }
        ${isActive && !isDead ? `ring-2 ring-red-400 shadow-lg shadow-red-950/50 scale-[1.04]` : ''}
        ${isSelected && !isDead && isPlayerTurn ? `ring-2 ring-yellow-400 shadow-lg shadow-yellow-950/50` : ''}
      `}
      style={{ minWidth: 80 }}
      title={isPlayerTurn && !isDead ? `Target ${enemy.name}` : undefined}
    >
      {/* Active Pulse (enemy turn) */}
      {isActive && !isDead && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping opacity-75" />
      )}

      {/* Target indicator */}
      {isSelected && isPlayerTurn && !isDead && (
        <div className="absolute -top-2 left-1/2 -translate-x-1/2">
          <Target className="w-4 h-4 text-yellow-400 animate-bounce" />
        </div>
      )}

      {/* Avatar */}
      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl border-2 ${isDead ? 'border-stone-700 bg-stone-900' : colors.border + ' bg-stone-900/80'}`}>
        {isDead ? <Skull className="w-6 h-6 text-stone-600" /> : <span>{enemy.emoji}</span>}
      </div>

      {/* Name */}
      <span className={`text-[10px] font-sans font-bold text-center leading-tight ${isDead ? 'text-stone-600' : colors.text}`}>
        {enemy.name.split(' ').slice(0, 2).join(' ')}
      </span>

      {/* HP Bar */}
      {!isDead && (
        <div className="w-full">
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${hpPct > 50 ? 'bg-red-500' : hpPct > 25 ? 'bg-orange-500' : 'bg-red-700'}`}
              style={{ width: `${hpPct}%` }}
            />
          </div>
          <p className="text-[9px] text-stone-500 font-sans text-center mt-0.5">{enemy.hp}/{enemy.maxHp}</p>
        </div>
      )}

      {/* AC */}
      {!isDead && (
        <span className="text-[9px] text-stone-500 font-sans">AC {enemy.ac}</span>
      )}

      {/* Status effects */}
      {enemy.statusEffects && enemy.statusEffects.length > 0 && !isDead && (
        <div className="flex flex-wrap gap-0.5 justify-center">
          {enemy.statusEffects.map((fx, i) => (
            <span key={i} className="text-[8px] bg-yellow-950/60 text-yellow-400 border border-yellow-800/40 px-1 py-0.5 rounded-full animate-pulse">
              {fx === 'poisoned' ? '☠️' : fx === 'stunned' ? '💫' : fx}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EnemyPanel({ enemies, activeEntityId, selectedTargetId, isPlayerTurn, onSelectTarget }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[9px] font-sans tracking-widest uppercase text-red-500/70 font-bold flex items-center gap-1">
        <Heart className="w-3 h-3 text-red-500" /> Enemies
        {isPlayerTurn && <span className="text-yellow-500/70 ml-1">(click to target)</span>}
      </p>
      <div className="flex flex-col gap-2">
        {enemies.map((enemy) => (
          <EnemyCard
            key={enemy.id}
            enemy={enemy}
            isActive={activeEntityId === enemy.id}
            isSelected={selectedTargetId === enemy.id}
            isPlayerTurn={isPlayerTurn}
            onSelect={onSelectTarget}
          />
        ))}
      </div>
    </div>
  );
}

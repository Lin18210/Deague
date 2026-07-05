import { Heart, Zap, Shield, Skull } from 'lucide-react';

const COLOR_MAP = {
  sky:     { border: 'border-sky-500',     bg: 'bg-sky-900/30',     ring: 'ring-sky-400',     bar: 'bg-sky-500',     text: 'text-sky-300'     },
  emerald: { border: 'border-emerald-500', bg: 'bg-emerald-900/30', ring: 'ring-emerald-400', bar: 'bg-emerald-500', text: 'text-emerald-300' },
  red:     { border: 'border-red-500',     bg: 'bg-red-900/30',     ring: 'ring-red-400',     bar: 'bg-red-500',     text: 'text-red-300'     },
  amber:   { border: 'border-amber-500',   bg: 'bg-amber-900/30',   ring: 'ring-amber-400',   bar: 'bg-amber-500',   text: 'text-amber-300'   },
};

function MemberCard({ member, isActive, isPlayer }) {
  const isDead = member.hp <= 0;
  const hpPct = (member.hp / member.maxHp) * 100;
  const manaPct = member.mana !== undefined ? (member.mana / member.maxMana) * 100 : 0;
  const colors = COLOR_MAP[member.colorClass] || COLOR_MAP.amber;

  return (
    <div
      className={`
        relative flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all duration-300 select-none
        ${isDead ? 'opacity-40 border-stone-800 bg-stone-950/50 grayscale' : colors.bg + ' ' + colors.border}
        ${isActive && !isDead ? `ring-2 ${colors.ring} shadow-lg scale-[1.04]` : ''}
      `}
      style={{ minWidth: 80 }}
    >
      {/* Active Pulse */}
      {isActive && !isDead && (
        <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${colors.bar} animate-ping opacity-75`} />
      )}

      {/* Avatar */}
      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 ${isDead ? 'border-stone-700 bg-stone-900' : colors.border + ' bg-stone-900/80'}`}>
        {isDead ? <Skull className="w-5 h-5 text-stone-600" /> : <span>{member.emoji || '🧙'}</span>}
      </div>

      {/* Name */}
      <span className={`text-[10px] font-sans font-bold text-center leading-tight ${isDead ? 'text-stone-600' : colors.text}`}>
        {isPlayer ? member.name.split(' ')[0] : member.name.split(' ')[0]}
      </span>
      <span className="text-[9px] text-stone-500 font-sans -mt-1">{member.class}</span>

      {/* HP Bar */}
      <div className="w-full space-y-1">
        <div className="flex items-center gap-1">
          <Heart className="w-2.5 h-2.5 text-red-400 shrink-0" />
          <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${hpPct > 50 ? 'bg-red-500' : hpPct > 25 ? 'bg-orange-500' : 'bg-red-700'}`}
              style={{ width: `${hpPct}%` }}
            />
          </div>
        </div>
        <p className="text-[9px] text-stone-500 font-sans text-center">{member.hp}/{member.maxHp}</p>

        {/* Mana Bar (if applicable) */}
        {member.maxMana > 0 && (
          <div className="flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-indigo-400 shrink-0" />
            <div className="flex-1 h-1 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${manaPct}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* AC Badge */}
      <div className="flex items-center gap-0.5">
        <Shield className="w-2.5 h-2.5 text-stone-500" />
        <span className="text-[9px] text-stone-500 font-sans">AC {member.ac}</span>
      </div>

      {/* Status effects */}
      {member.statusEffects && member.statusEffects.length > 0 && (
        <div className="flex flex-wrap gap-0.5 justify-center">
          {member.statusEffects.map((fx, i) => (
            <span key={i} className="text-[8px] bg-yellow-950/60 text-yellow-400 border border-yellow-800/40 px-1 py-0.5 rounded-full animate-pulse">
              {fx === 'raging' ? '🔥' : fx === 'blessed' ? '✨' : fx === 'stunned' ? '💫' : fx === 'poisoned' ? '☠️' : fx}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function PartyPanel({ party, activeEntityId }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[9px] font-sans tracking-widest uppercase text-amber-500/70 font-bold flex items-center gap-1">
        <Shield className="w-3 h-3" /> Your Party
      </p>
      <div className="flex flex-col gap-2">
        {party.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            isActive={activeEntityId === member.id}
            isPlayer={member.isPlayer}
          />
        ))}
      </div>
    </div>
  );
}

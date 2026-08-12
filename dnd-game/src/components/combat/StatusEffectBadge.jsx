import React from 'react';
import { STATUS_DEFINITIONS } from '../../services/statusEffectService';

export default function StatusEffectBadge({ effect }) {
  if (!effect) return null;
  const def = STATUS_DEFINITIONS[effect.type] || {};

  return (
    <div 
      className="relative group inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-700/60 text-xs shadow-sm cursor-help"
      title={`${def.name || effect.type}: ${def.description || ''} (${effect.duration} turns left)`}
    >
      <span className="text-sm leading-none">{effect.icon || '✨'}</span>
      <span className="font-mono text-amber-200/90 text-[10px] font-bold">
        {effect.duration}
      </span>

      {/* Floating Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 w-44 p-2 rounded bg-slate-950/95 border border-amber-500/30 text-amber-50 shadow-xl pointer-events-none text-left">
        <p className="font-display text-xs text-amber-300 font-semibold">{def.name || effect.type}</p>
        <p className="text-[10px] text-amber-100/70 mt-0.5 leading-snug">{def.description}</p>
        <p className="text-[9px] text-amber-400/80 font-mono mt-1">Remaining: {effect.duration} turn{effect.duration > 1 ? 's' : ''}</p>
      </div>
    </div>
  );
}

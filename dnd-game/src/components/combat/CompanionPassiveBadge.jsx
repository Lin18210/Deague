import React from 'react';

export default function CompanionPassiveBadge({ passive }) {
  if (!passive) return null;

  return (
    <div 
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-950/50 border border-amber-600/40 text-[10px] text-amber-200 cursor-help shadow-sm group relative"
      title={`${passive.name}: ${passive.description}`}
    >
      <span>{passive.icon}</span>
      <span className="font-display font-medium truncate max-w-[120px]">{passive.name}</span>

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:block z-50 w-52 p-2 rounded bg-stone-950 border border-amber-500/40 text-amber-50 shadow-2xl text-left pointer-events-none">
        <p className="font-display text-xs text-amber-300 font-bold">{passive.name}</p>
        <p className="text-[10px] text-stone-300 mt-0.5 leading-snug">{passive.description}</p>
        <p className="text-[9px] text-amber-400 font-mono mt-1">Granted by: {passive.companionName || 'Companion'}</p>
      </div>
    </div>
  );
}

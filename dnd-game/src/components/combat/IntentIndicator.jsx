import React from 'react';
import { Shield, Zap, Skull, AlertCircle } from 'lucide-react';

export default function IntentIndicator({ intent }) {
  if (!intent) return null;

  const isLethal = intent.threat === 'lethal';

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border backdrop-blur-sm transition-all ${
      isLethal 
        ? 'bg-red-950/80 border-red-500/80 text-red-200 animate-pulse' 
        : 'bg-stone-900/80 border-amber-900/40 text-amber-200'
    }`}>
      <span className="text-sm">{intent.icon}</span>
      <span className="font-display font-medium text-[11px]">{intent.label}</span>
      {intent.damageEstimate && intent.damageEstimate !== '0' && (
        <span className="font-mono text-[10px] text-amber-400 font-bold">({intent.damageEstimate} dmg)</span>
      )}
    </div>
  );
}

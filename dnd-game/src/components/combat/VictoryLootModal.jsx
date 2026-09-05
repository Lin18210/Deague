import React from 'react';
import { Trophy, Coins, Sparkles, Check, Gift } from 'lucide-react';
import audio from '../../utils/audioEngine';

export default function VictoryLootModal({ isOpen, onClose, loot, onClaim }) {
  if (!isOpen || !loot) return null;

  const handleClaim = () => {
    audio.play('chest_open');
    if (onClaim) onClaim(loot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-950 border border-amber-500/50 rounded-2xl p-6 shadow-2xl text-amber-50 text-center overflow-hidden">
        {/* Golden Sunburst Backdrop */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="inline-flex p-3 rounded-full bg-amber-950/80 border border-amber-600/70 text-amber-300 mb-3 shadow-lg">
          <Trophy size={32} className="animate-bounce" />
        </div>

        <h2 className="font-display text-2xl font-bold text-amber-200 mb-1">Spoils of Conquest</h2>
        <p className="text-xs text-stone-400 mb-6">The fallen foe leaves their hoarded treasures behind.</p>

        {/* Rewards breakdown */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 flex items-center justify-center gap-2">
            <Coins size={20} className="text-amber-400" />
            <span className="font-mono text-base font-bold text-amber-300">+{loot.gold || 25} Gold</span>
          </div>
          <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-900/60 flex items-center justify-center gap-2">
            <Sparkles size={20} className="text-purple-400" />
            <span className="font-mono text-base font-bold text-purple-300">+{loot.xp || 150} XP</span>
          </div>
        </div>

        {/* Loot items */}
        {loot.items && loot.items.length > 0 && (
          <div className="mb-6 space-y-2 text-left">
            <span className="text-[11px] font-display uppercase tracking-wider text-amber-400/80 block">Acquired Relics</span>
            {loot.items.map((item, idx) => (
              <div key={idx} className="p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 flex items-center gap-2.5">
                <span className="text-lg">{item.icon}</span>
                <div>
                  <p className="text-xs font-display font-semibold text-amber-200">{item.name}</p>
                  <p className="text-[10px] text-stone-400 font-serif italic">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleClaim}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-500 text-stone-950 font-display text-sm font-bold shadow-lg shadow-amber-600/30 transition-all flex items-center justify-center gap-2"
        >
          <Check size={18} />
          Claim All Treasures
        </button>
      </div>
    </div>
  );
}

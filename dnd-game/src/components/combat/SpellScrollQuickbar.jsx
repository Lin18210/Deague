import React from 'react';
import { Scroll, Flame, Shield, Sparkles } from 'lucide-react';
import { getPlayerScrolls, castScroll } from '../../services/spellScrollService';
import audio from '../../utils/audioEngine';

export default function SpellScrollQuickbar({ onCastScroll }) {
  const scrolls = getPlayerScrolls();

  const handleCast = (scroll) => {
    audio.play('scroll_cast');
    const used = castScroll(scroll.id);
    if (used && onCastScroll) onCastScroll(used);
  };

  return (
    <div className="flex items-center gap-2 p-2 rounded-xl bg-stone-950/70 border border-amber-900/30 text-xs">
      <span className="font-display text-[10px] text-amber-400/80 uppercase tracking-wider flex items-center gap-1">
        <Scroll size={12} /> Scrolls:
      </span>
      <div className="flex items-center gap-2">
        {scrolls.map((s) => (
          <button
            key={s.id}
            onClick={() => handleCast(s)}
            disabled={s.charges <= 0}
            className={`px-2.5 py-1 rounded-lg border text-xs font-display flex items-center gap-1.5 transition-all ${
              s.charges > 0 
                ? 'bg-amber-950/40 border-amber-700/60 hover:bg-amber-900 text-amber-200 cursor-pointer shadow-sm hover:scale-105' 
                : 'bg-stone-900 border-stone-800 text-stone-600 opacity-50 cursor-not-allowed'
            }`}
            title={s.description}
          >
            <span>{s.school === 'Evocation' ? '🔥' : (s.school === 'Abjuration' ? '🛡️' : '✨')}</span>
            <span>{s.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

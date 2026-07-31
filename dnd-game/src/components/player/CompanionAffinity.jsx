import React, { useState } from 'react';
import { HeartHandshake, ShieldCheck, Sparkles, Heart, Award, X } from 'lucide-react';

export const COMPANION_DATA = [
  {
    id: 'lyra',
    name: 'Lyra Dawnveil',
    title: 'Cleric of Lathander',
    emoji: '🕊️',
    affinity: 75, // 0 to 100
    affinityStatus: 'Devoted Ally',
    passivePerk: 'Morninglord Blessing: Increases Party Healing Received by +15%.',
    quotes: '"As long as the sun rises, we shall not fall, my friend."'
  },
  {
    id: 'kael',
    name: 'Kael Thornblade',
    title: 'Arcane Trickster Rogue',
    emoji: '🗡️',
    affinity: 60,
    affinityStatus: 'Trusted Partner',
    passivePerk: 'Shadow Tactics: +10% Critical Strike Chance on surprise turns.',
    quotes: '"You keep drawing their fire, I\'ll keep slipping behind them. Deal?"'
  },
  {
    id: 'vorn',
    name: 'Vorn Ashmantle',
    title: 'Totem Barbarian',
    emoji: '🪓',
    affinity: 85,
    affinityStatus: 'Blood Brother',
    passivePerk: 'Ashmantle Vigor: Grants +10 Max HP to all party members.',
    quotes: '"My axe is yours until the shadow is crushed beneath our boots."'
  }
];

export default function CompanionAffinity({ isOpen, onClose }) {
  const [companions, setCompanions] = useState(COMPANION_DATA);

  if (!isOpen) return null;

  const handleAdjustAffinity = (id, delta) => {
    setCompanions(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextVal = Math.min(100, Math.max(0, c.affinity + delta));
          let status = 'Neutral Companion';
          if (nextVal >= 80) status = 'Blood Brother / Devoted Ally';
          else if (nextVal >= 50) status = 'Trusted Partner';
          else if (nextVal >= 25) status = 'Wary Comrade';
          return { ...c, affinity: nextVal, affinityStatus: status };
        }
        return c;
      })
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-sky-500/40 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-amber-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-sky-400/60 hover:text-sky-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-sky-900/40 pb-4">
          <HeartHandshake className="text-sky-400" size={28} />
          <div>
            <h2 className="font-display text-2xl text-sky-300">Party Bonds & Companion Affinity</h2>
            <p className="text-xs text-amber-50/60 font-serif">Relationship status and unlocked passive party perks</p>
          </div>
        </div>

        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
          {companions.map((comp) => {
            const pct = comp.affinity;

            return (
              <div key={comp.id} className="bg-slate-950/70 border border-sky-900/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{comp.emoji}</span>
                    <div>
                      <h4 className="font-display text-sky-200 text-base">{comp.name}</h4>
                      <p className="text-xs text-amber-50/50">{comp.title} · <span className="text-sky-400 font-semibold">{comp.affinityStatus}</span></p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-sky-300">{pct}% Affinity</span>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-3">
                  <div
                    className="h-full bg-gradient-to-r from-sky-500 to-blue-400 rounded-full transition-[width]"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="bg-sky-950/30 border border-sky-800/30 rounded p-2.5 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-200 font-display">
                    <Sparkles size={13} className="text-sky-400" />
                    <span>Unlocked Passive Perk:</span>
                  </div>
                  <p className="text-amber-50/80 font-mono pl-5">{comp.passivePerk}</p>
                </div>

                <p className="text-xs italic text-amber-50/40 font-serif mt-2">{comp.quotes}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

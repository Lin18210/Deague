import React, { useState } from 'react';
import { CloudSnow, Sparkles, Flame, Eye, ShieldAlert, Wind, Zap } from 'lucide-react';

export const ENVIRONMENT_CONDITIONS = [
  {
    id: 'freezing_blizzard',
    act: 1,
    name: 'Freezing Mountain Gale',
    icon: CloudSnow,
    color: 'text-sky-300',
    borderColor: 'border-sky-500/40',
    bgColor: 'bg-sky-950/60',
    effect: 'Freezing cold reduces ranged attack accuracy by -1, but frost shields grant +1 AC.',
    particleType: 'snow'
  },
  {
    id: 'void_miasma',
    act: 2,
    name: 'Corrupted Void Miasma',
    icon: Wind,
    color: 'text-purple-300',
    borderColor: 'border-purple-500/40',
    bgColor: 'bg-purple-950/60',
    effect: 'Eldritch radiation inflicts 2 Necrotic tick damage to all combatants at round start.',
    particleType: 'void'
  },
  {
    id: 'astral_surge',
    act: 3,
    name: 'Astral Mana Surge',
    icon: Sparkles,
    color: 'text-amber-300',
    borderColor: 'border-amber-500/40',
    bgColor: 'bg-amber-950/60',
    effect: 'Ambient magic restores +5 MP whenever a level 1+ spell is cast.',
    particleType: 'stars'
  },
  {
    id: 'volcanic_ash',
    act: 4,
    name: 'Volcanic Ash Cloud',
    icon: Flame,
    color: 'text-orange-300',
    borderColor: 'border-orange-500/40',
    bgColor: 'bg-orange-950/60',
    effect: 'Dense smoke obscure line of sight, granting +2 Stealth Advantage.',
    particleType: 'embers'
  }
];

export default function EnvironmentalHazards({ currentAct = 1 }) {
  const activeHazard = ENVIRONMENT_CONDITIONS.find(c => c.act === currentAct) || ENVIRONMENT_CONDITIONS[0];
  const IconComponent = activeHazard.icon;

  return (
    <div className={`p-3 rounded-lg border ${activeHazard.borderColor} ${activeHazard.bgColor} backdrop-blur-sm shadow-lg mb-4 text-amber-50 flex items-center justify-between transition-all`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-slate-950/60 border ${activeHazard.borderColor}`}>
          <IconComponent className={activeHazard.color} size={20} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">Battlefield Condition</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">Act {currentAct}</span>
          </div>
          <h4 className={`font-display text-sm ${activeHazard.color}`}>{activeHazard.name}</h4>
          <p className="text-xs text-amber-50/80 font-serif mt-0.5">{activeHazard.effect}</p>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Sword, Sparkles, Eye, ChevronRight, Heart, Zap, Shield, Cross, Target, Star, Music, Flame, Leaf, Wind, Moon } from 'lucide-react';
import { CLASS_PRESETS, CLASS_META, getAbilityMod } from '../../data/initialCharacter';
import audio from '../../utils/audioEngine';

const ICON_MAP = {
  shield: Shield,
  sparkles: Sparkles,
  eye: Eye,
  sword: Sword,
  cross: Cross,
  target: Target,
  star: Star,
  music: Music,
  flame: Flame,
  leaf: Leaf,
  wind: Wind,
  zap: Zap,
  moon: Moon,
};

function StatPill({ label, base, char }) {
  const mod = getAbilityMod(char, label);
  return (
    <div className="flex items-center justify-between bg-slate-950/60 px-3 py-2 rounded border border-slate-800/80">
      <span className="text-[10px] text-slate-500 uppercase tracking-widest font-display">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-amber-200">{base}</span>
        <span className="text-[10px] font-bold text-amber-500 bg-amber-950/40 border border-amber-900/40 px-1.5 py-0.5 rounded">
          {mod >= 0 ? '+' : ''}{mod}
        </span>
      </div>
    </div>
  );
}

export default function CharacterSelectScreen({ onSelect }) {
  const [selected, setSelected] = useState('warrior');

  const char = CLASS_PRESETS[selected];
  const meta = CLASS_META[selected];
  const MetaIcon = ICON_MAP[meta.icon] || Sword;
  const stats = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];

  const handleConfirm = () => {
    audio.play('success');
    onSelect(selected);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl space-y-6">
        <div className="text-center space-y-2">
          <p className="text-amber-500 font-display tracking-[0.3em] text-xs uppercase">Chronicle Selection</p>
          <h2 className="text-3xl md:text-4xl font-display text-amber-200">Choose Your Paragon</h2>
          <p className="text-slate-400 text-sm font-serif max-w-xl mx-auto">
            Twelve classes from the Forgotten Realms — each a different path to legend.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[52vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {Object.entries(CLASS_PRESETS).map(([key, preset]) => {
            const presetMeta = CLASS_META[key];
            const PresetIcon = ICON_MAP[presetMeta.icon] || Sword;
            const isSelected = selected === key;

            return (
              <button
                key={key}
                onClick={() => { audio.play('click'); setSelected(key); }}
                className={`relative text-left p-4 rounded-lg border transition-all duration-300 flex flex-col overflow-hidden ${
                  isSelected
                    ? 'border-amber-600 bg-slate-900/90 shadow-lg shadow-amber-950/20 scale-[1.02]'
                    : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-900/30'
                }`}
              >
                {/* Color accent stripe */}
                <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${presetMeta.color} opacity-${isSelected ? '80' : '30'} transition-opacity duration-300`} />

                {isSelected && (
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${presetMeta.color} opacity-5 blur-2xl pointer-events-none rounded-full`} />
                )}

                <div className="flex items-center gap-2 mb-2">
                  <div className={`p-1.5 rounded-md border ${
                    isSelected ? 'border-amber-600/40 text-amber-500' : 'border-slate-800 text-slate-500'
                  }`}>
                    <PresetIcon size={16} />
                  </div>
                  <h3 className={`font-display text-sm leading-tight ${
                    isSelected ? 'text-amber-200' : 'text-slate-300'
                  }`}>
                    {presetMeta.title}
                  </h3>
                </div>

                <p className="text-[10px] text-slate-400 font-serif mb-3 line-clamp-2 leading-relaxed">
                  {presetMeta.desc}
                </p>

                <div className="mt-auto border-t border-slate-800/80 pt-2 grid grid-cols-3 gap-1 text-[9px]">
                  <div className="flex items-center gap-1">
                    <Heart size={9} className="text-red-400" />
                    <span className="text-slate-500">{preset.maxHealth}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={9} className="text-blue-400" />
                    <span className="text-slate-500">{preset.maxMana}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Shield size={9} className="text-amber-400" />
                    <span className="text-slate-500">AC{preset.ac}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <MetaIcon size={22} className="text-amber-500" />
            <h3 className="font-display text-lg text-amber-300">{char.name}</h3>
            <span className="text-[10px] text-slate-500 font-display uppercase tracking-wider ml-auto">
              {meta.title} · Level {char.level}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
            {stats.map(s => (
              <StatPill key={s} label={s} base={char.stats[s]} char={char} />
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 font-serif border-t border-slate-800/60 pt-3">
            <span className="text-slate-400">Equipment:</span>
            {char.weapons.map((w, i) => (
              <span key={i} className="bg-slate-800/50 px-2 py-0.5 rounded text-amber-200/70">{w.name}</span>
            ))}
            {char.spells.length > 0 && (
              <>
                <span className="text-slate-400 ml-2">Spells:</span>
                {char.spells.map((s, i) => (
                  <span key={i} className="bg-slate-800/50 px-2 py-0.5 rounded text-blue-200/70">{s.name}</span>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={handleConfirm}
            className="group flex items-center gap-2 bg-amber-900/40 border-2 border-amber-700 hover:border-amber-300 text-amber-100 px-14 py-5 rounded-lg font-display text-xl tracking-wider hover:scale-105 hover:shadow-[0_0_30px_rgba(252,211,77,0.4)] cursor-pointer transition-all duration-300 mx-auto"
          >
            <Sword size={22} className="text-amber-300 group-hover:rotate-12 transition-transform" />
            Begin Your Chronicle
            <ChevronRight size={20} className="text-amber-300/60 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}

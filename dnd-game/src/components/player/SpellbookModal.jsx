import React, { useState } from 'react';
import { BookOpen, Sparkles, Wand2, Shield, Heart, Zap, X } from 'lucide-react';

export const SPELL_DATABASE = [
  {
    id: 'radiant_burst',
    name: 'Radiant Sunburst',
    school: 'Evocation',
    level: 1,
    manaCost: 15,
    cooldown: 0,
    icon: '✨',
    description: 'Blasts enemies with holy sunlight, dealing 1d10+WIS Radiant damage and blinding targets.',
    effect: 'Damage: 12 Radiant | Blind 1 Turn',
    target: 'Single Enemy / All Undead'
  },
  {
    id: 'arcane_shield',
    name: 'Aegis of the Sun',
    school: 'Abjuration',
    level: 1,
    manaCost: 10,
    cooldown: 2,
    icon: '🛡️',
    description: 'Surrounds the caster in a shimmering barrier of dawn light, granting +4 AC for 2 turns.',
    effect: '+4 AC for 2 Turns',
    target: 'Self'
  },
  {
    id: 'shadow_blade',
    name: 'Shadowstitch Strike',
    school: 'Illusion',
    level: 2,
    manaCost: 20,
    cooldown: 1,
    icon: '🗡️',
    description: 'Infuses blade with dark shadows. Deals 2d8 Piercing + 1d6 Necrotic damage from stealth.',
    effect: 'Damage: 18 Hybrid | Stealth Advantage',
    target: 'Single Enemy'
  },
  {
    id: 'cure_wounds',
    name: 'Grace of Lathander',
    school: 'Evocation',
    level: 1,
    manaCost: 18,
    cooldown: 0,
    icon: '💚',
    description: 'Invokes divine favor to instantly restore 2d8 + Spellcasting modifier hit points.',
    effect: 'Heal: 16 HP',
    target: 'Self or Ally'
  },
  {
    id: 'starfire_deluge',
    name: 'Star-Weaver Deluge',
    school: 'Conjuration',
    level: 3,
    manaCost: 35,
    cooldown: 3,
    icon: '🌌',
    description: 'Summons falling stars from the Astral Plane to crush enemy formations.',
    effect: 'Damage: 28 Astral Damage | Knockdown',
    target: 'All Enemies'
  }
];

export default function SpellbookModal({ isOpen, onClose, character, onCastSpell }) {
  const [selectedSpell, setSelectedSpell] = useState(SPELL_DATABASE[0]);
  const [castMessage, setCastMessage] = useState(null);

  if (!isOpen) return null;

  const handleCast = (spell) => {
    if (character.mana < spell.manaCost) {
      setCastMessage({ type: 'error', text: `Insufficient Mana! Need ${spell.manaCost} MP.` });
      return;
    }
    if (onCastSpell) {
      onCastSpell(spell);
    }
    setCastMessage({ type: 'success', text: `Cast ${spell.name}! (${spell.effect})` });
    setTimeout(() => setCastMessage(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-amber-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-amber-900/40 pb-4">
          <BookOpen className="text-amber-400" size={28} />
          <div>
            <h2 className="font-display text-2xl text-amber-300">Spellbook & Grimoire</h2>
            <p className="text-xs text-amber-50/60 font-serif">Quick-cast prepared spells & arcane rituals</p>
          </div>
          <div className="ml-auto flex items-center gap-4 text-sm font-mono bg-slate-950 px-4 py-2 rounded-lg border border-amber-900/30">
            <span className="flex items-center gap-1 text-blue-400">
              <Zap size={14} /> MP: {character?.mana ?? 30} / {character?.maxMana ?? 30}
            </span>
          </div>
        </div>

        {castMessage && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
            castMessage.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-300'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
          }`}>
            {castMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spell list */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            {SPELL_DATABASE.map((spell) => {
              const isSelected = selectedSpell.id === spell.id;
              const canAfford = (character?.mana ?? 30) >= spell.manaCost;
              return (
                <button
                  key={spell.id}
                  onClick={() => setSelectedSpell(spell)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-950/60 border-amber-400/80 shadow-lg'
                      : 'bg-slate-950/50 border-slate-800 hover:border-amber-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{spell.icon}</span>
                    <div>
                      <h4 className="font-display text-amber-200 text-sm">{spell.name}</h4>
                      <p className="text-xs text-amber-50/50">{spell.school} · Lvl {spell.level}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-mono font-bold ${canAfford ? 'text-blue-400' : 'text-red-400'}`}>
                    {spell.manaCost} MP
                  </span>
                </button>
              );
            })}
          </div>

          {/* Spell detail */}
          {selectedSpell && (
            <div className="bg-slate-950/80 border border-amber-900/30 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{selectedSpell.icon}</span>
                  <div>
                    <h3 className="font-display text-xl text-amber-300">{selectedSpell.name}</h3>
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-700/40 text-amber-400 font-mono">
                      {selectedSpell.school} · Level {selectedSpell.level}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-amber-100/80 font-serif leading-relaxed mb-4">
                  {selectedSpell.description}
                </p>

                <div className="space-y-2 text-xs font-mono border-t border-slate-800 pt-3">
                  <div className="flex justify-between">
                    <span className="text-amber-50/50">Primary Effect:</span>
                    <span className="text-amber-300 font-bold">{selectedSpell.effect}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-50/50">Targeting:</span>
                    <span className="text-amber-100">{selectedSpell.target}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-amber-50/50">Mana Cost:</span>
                    <span className="text-blue-400 font-bold">{selectedSpell.manaCost} MP</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCast(selectedSpell)}
                className="w-full mt-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-amber-950 font-display font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Sparkles size={16} /> Cast {selectedSpell.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

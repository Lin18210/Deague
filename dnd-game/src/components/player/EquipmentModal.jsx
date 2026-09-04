import React from 'react';
import { Shield, Sword, Sparkles, Award, X } from 'lucide-react';
import { ITEM_SLOTS, DEFAULT_EQUIPMENT, calculateTotalGearModifiers } from '../../services/equipmentService';
import audio from '../../utils/audioEngine';

export default function EquipmentModal({ isOpen, onClose, equipment = DEFAULT_EQUIPMENT }) {
  if (!isOpen) return null;

  const bonuses = calculateTotalGearModifiers(equipment);

  const getRarityBadge = (rarity) => {
    switch(rarity) {
      case 'legendary': return 'border-amber-400 text-amber-300 bg-amber-950/70 shadow-amber-500/20';
      case 'epic': return 'border-purple-400 text-purple-300 bg-purple-950/70 shadow-purple-500/20';
      case 'rare': return 'border-blue-400 text-blue-300 bg-blue-950/70 shadow-blue-500/20';
      case 'uncommon': return 'border-emerald-400 text-emerald-300 bg-emerald-950/70 shadow-emerald-500/20';
      default: return 'border-stone-600 text-stone-300 bg-stone-900';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-900/60 rounded-2xl p-6 shadow-2xl text-amber-50">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-5 border-b border-amber-900/30 pb-3">
          <Award size={24} className="text-amber-400" />
          <h2 className="font-display text-xl font-bold text-amber-200">Armory & Hero Loadout</h2>
        </div>

        {/* Gear Summary Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6 p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-center">
          <div>
            <span className="text-[10px] text-stone-400 font-display block uppercase">Bonus Armor</span>
            <span className="font-mono text-base font-bold text-blue-400">+{bonuses.acBonus} AC</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-display block uppercase">Attack Power</span>
            <span className="font-mono text-base font-bold text-red-400">+{bonuses.attackMod} ATK</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-display block uppercase">Strength Mod</span>
            <span className="font-mono text-base font-bold text-amber-400">+{bonuses.strength} STR</span>
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-display block uppercase">Spell Radiance</span>
            <span className="font-mono text-base font-bold text-purple-400">+{bonuses.wisdom || 0} WIS</span>
          </div>
        </div>

        {/* Equipment Slot Cards */}
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
          {Object.entries(equipment).map(([slot, item]) => (
            <div 
              key={slot}
              className={`p-3.5 rounded-xl border flex items-center justify-between shadow-lg transition-all ${getRarityBadge(item.rarity)}`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono font-bold tracking-wider opacity-60">[{slot}]</span>
                  <span className="font-display text-sm font-semibold">{item.name}</span>
                </div>
                <p className="text-xs opacity-75 mt-0.5 font-serif italic">{item.description}</p>
              </div>

              <div className="text-right">
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10 uppercase">
                  {item.rarity}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-700/80 hover:bg-amber-600 text-amber-50 font-display text-sm font-medium transition-colors"
          >
            Confirm Gear
          </button>
        </div>
      </div>
    </div>
  );
}

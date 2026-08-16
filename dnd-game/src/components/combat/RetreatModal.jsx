import React from 'react';
import { ShieldAlert, Footprints, AlertTriangle, X } from 'lucide-react';
import { calculateEscapeProbability } from '../../services/combatRetreatService';

export default function RetreatModal({ isOpen, onClose, onConfirm, partyDexMod = 2, enemyDexMod = 1 }) {
  if (!isOpen) return null;

  const odds = calculateEscapeProbability(partyDexMod, enemyDexMod);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-900 border border-red-900/60 rounded-xl p-6 shadow-2xl text-amber-50">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4 text-red-400">
          <Footprints size={28} className="animate-pulse" />
          <h3 className="font-display text-lg font-bold">Sound Tactical Retreat</h3>
        </div>

        <p className="text-sm text-stone-300 mb-4 leading-relaxed">
          Falling back will break combat and return to the previous safe crossroads. Be warned: foes may inflict opportunistic attacks during disengagement!
        </p>

        <div className="bg-stone-950/70 border border-amber-900/30 rounded-lg p-3.5 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-300/80">
            <AlertTriangle size={16} className="text-amber-400" />
            <span>Escape Probability</span>
          </div>
          <span className="font-mono text-base font-bold text-emerald-400">{odds}%</span>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-sm font-display transition-colors"
          >
            Hold the Line
          </button>
          <button 
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-800 hover:bg-red-700 text-white font-display text-sm font-semibold shadow-lg shadow-red-900/40 transition-colors"
          >
            Disengage & Fall Back
          </button>
        </div>
      </div>
    </div>
  );
}

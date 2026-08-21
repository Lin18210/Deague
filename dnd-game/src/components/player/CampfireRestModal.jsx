import React, { useState } from 'react';
import { Flame, Moon, Heart, Sparkles, X, Shield, Coffee } from 'lucide-react';
import { performShortRest, performLongRest } from '../../services/restService';
import audio from '../../utils/audioEngine';

export default function CampfireRestModal({ isOpen, onClose, character, companions = [], onRestComplete }) {
  const [restLog, setRestLog] = useState('');

  if (!isOpen) return null;

  const handleShortRest = () => {
    audio.play('campfire_rest');
    const updated = performShortRest(character, 1);
    setRestLog(`Short rest finished! Bandaged wounds restored +${updated.lastHealed} Hit Points.`);
    if (onRestComplete) onRestComplete(updated, companions);
  };

  const handleLongRest = () => {
    audio.play('rest_complete');
    const { character: fullChar, companions: fullComp, summary } = performLongRest(character, companions);
    setRestLog(summary);
    if (onRestComplete) onRestComplete(fullChar, fullComp);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-950 border border-amber-900/60 rounded-2xl p-6 shadow-2xl text-amber-50 overflow-hidden">
        {/* Subtle Hearth Flame Backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-400">
            <Flame size={24} className="animate-torch-flicker" />
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-amber-200">High Pass Campfire</h3>
            <p className="text-xs text-amber-100/60">Rest your weary bones beside the crackling embers</p>
          </div>
        </div>

        <p className="text-sm text-stone-300 mb-5 leading-relaxed">
          The freezing mountain wind howls outside your makeshift shelter. Share a pot of spiced broth, sharpen your blades, and recover lost stamina.
        </p>

        {restLog && (
          <div className="mb-4 p-3 rounded-lg bg-amber-950/40 border border-amber-800/40 text-xs text-amber-200 font-serif leading-relaxed animate-fade-in">
            {restLog}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleShortRest}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-900 border border-amber-900/40 hover:border-amber-600/80 hover:bg-stone-850 transition-all text-center group"
          >
            <Coffee size={24} className="text-amber-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="font-display text-sm font-semibold text-amber-200">Short Rest</span>
            <span className="text-[11px] text-stone-400 mt-1">Roll Hit Die for partial recovery</span>
          </button>

          <button
            onClick={handleLongRest}
            className="flex flex-col items-center justify-center p-4 rounded-xl bg-stone-900 border border-amber-900/40 hover:border-amber-600/80 hover:bg-stone-850 transition-all text-center group"
          >
            <Moon size={24} className="text-purple-400 group-hover:scale-110 transition-transform mb-2" />
            <span className="font-display text-sm font-semibold text-amber-200">Full Night's Camp</span>
            <span className="text-[11px] text-stone-400 mt-1">Restore all HP & dispel debuffs</span>
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-700/80 hover:bg-amber-600 text-amber-50 font-display text-sm font-medium transition-colors"
          >
            Pack Up & Advance
          </button>
        </div>
      </div>
    </div>
  );
}

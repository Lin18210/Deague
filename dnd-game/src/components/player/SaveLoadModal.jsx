import React, { useState } from 'react';
import { Save, Download, Trash2, X, Clock, MapPin } from 'lucide-react';
import { getSaveSlots, saveToSlot } from '../../services/saveSlotService';
import audio from '../../utils/audioEngine';

export default function SaveLoadModal({ isOpen, onClose, character, storyState, onLoadSlot }) {
  const [slots, setSlots] = useState(getSaveSlots);

  if (!isOpen) return null;

  const handleSave = (idx) => {
    audio.play('page_turn');
    const updated = saveToSlot(idx, character, storyState);
    setSlots([...updated]);
  };

  const handleLoad = (slot) => {
    if (!slot) return;
    audio.play('quest_fanfare');
    if (onLoadSlot) onLoadSlot(slot);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-950 border border-amber-900/60 rounded-2xl p-6 shadow-2xl text-amber-50">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-amber-900/30 pb-3">
          <Save size={22} className="text-amber-400" />
          <h2 className="font-display text-xl font-bold text-amber-200">Chronicle Save Archives</h2>
        </div>

        <div className="space-y-3.5 mb-6">
          {slots.map((slot, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-xl bg-stone-900/80 border border-stone-800 flex items-center justify-between hover:border-amber-900/50 transition-colors"
            >
              <div>
                <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-wider block">Profile Slot {idx + 1}</span>
                {slot ? (
                  <div>
                    <h4 className="font-display text-sm font-semibold text-amber-200">{slot.heroName} — {slot.heroClass} (Lv {slot.level})</h4>
                    <p className="text-[11px] text-stone-400 flex items-center gap-2 mt-0.5 font-serif">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {slot.location}</span>
                      <span className="flex items-center gap-1"><Clock size={11} /> {new Date(slot.timestamp).toLocaleDateString()}</span>
                    </p>
                  </div>
                ) : (
                  <p className="text-xs text-stone-500 font-serif italic mt-0.5">Empty Parchment Slot</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSave(idx)}
                  className="px-3 py-1.5 rounded-lg bg-amber-900/40 hover:bg-amber-800 text-amber-200 text-xs font-display border border-amber-700/50 transition-colors"
                  title="Overwrite Save"
                >
                  Save
                </button>
                {slot && (
                  <button
                    onClick={() => handleLoad(slot)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-900/40 hover:bg-emerald-800 text-emerald-200 text-xs font-display border border-emerald-700/50 transition-colors"
                    title="Load Game"
                  >
                    Load
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-display text-sm font-medium transition-colors"
          >
            Close Archives
          </button>
        </div>
      </div>
    </div>
  );
}

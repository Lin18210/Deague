import React, { useState } from 'react';
import { BookOpen, Skull, Shield, Zap, X, ChevronRight } from 'lucide-react';
import { BESTIARY_ENTRIES } from '../../services/bestiaryService';
import audio from '../../utils/audioEngine';

export default function BestiaryModal({ isOpen, onClose }) {
  const [selectedId, setSelectedId] = useState(BESTIARY_ENTRIES[0]?.id);

  if (!isOpen) return null;

  const currentMonster = BESTIARY_ENTRIES.find(m => m.id === selectedId) || BESTIARY_ENTRIES[0];

  const handleSelect = (id) => {
    audio.play('page_turn');
    setSelectedId(id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-stone-950 border border-amber-900/60 rounded-2xl shadow-2xl text-amber-50 flex flex-col md:flex-row h-[550px] overflow-hidden">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Left Monster Index */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-amber-900/40 p-4 bg-stone-900/50 flex flex-col">
          <div className="flex items-center gap-2 mb-4 text-amber-300 font-display text-base font-bold">
            <BookOpen size={18} />
            <span>Bestiary Tome</span>
          </div>

          <div className="space-y-1.5 overflow-y-auto flex-1 pr-1 custom-scrollbar">
            {BESTIARY_ENTRIES.map(monster => (
              <button
                key={monster.id}
                onClick={() => handleSelect(monster.id)}
                className={`w-full text-left p-2.5 rounded-lg border text-xs font-display flex items-center justify-between transition-colors ${
                  selectedId === monster.id 
                    ? 'bg-amber-950/60 border-amber-600/70 text-amber-200' 
                    : 'bg-stone-900/70 border-stone-800 text-stone-300 hover:bg-stone-850'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Skull size={14} className={selectedId === monster.id ? 'text-amber-400' : 'text-stone-500'} />
                  <span className="truncate">{monster.name}</span>
                </div>
                <ChevronRight size={14} className="opacity-60" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Dossier Detail */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-between overflow-y-auto bg-stone-950/80">
          <div>
            <div className="flex items-start justify-between border-b border-amber-900/30 pb-3 mb-4">
              <div>
                <h2 className="font-display text-xl font-bold text-amber-200">{currentMonster.name}</h2>
                <span className="text-xs text-amber-400/70 font-serif italic">{currentMonster.category} • Threat CR {currentMonster.cr}</span>
              </div>
            </div>

            <p className="text-sm text-stone-300 leading-relaxed mb-6 font-serif">
              {currentMonster.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 rounded-lg bg-red-950/30 border border-red-900/40">
                <span className="text-xs font-display text-red-400 block mb-1">Vulnerabilities</span>
                <span className="text-xs font-mono text-stone-200">{currentMonster.weakness}</span>
              </div>
              <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/40">
                <span className="text-xs font-display text-blue-400 block mb-1">Resistances</span>
                <span className="text-xs font-mono text-stone-200">{currentMonster.resistance}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-950/20 border border-amber-800/30">
              <span className="text-xs font-display text-amber-300 block mb-1">Combat Tactics</span>
              <p className="text-xs text-amber-100/80 font-serif leading-relaxed">{currentMonster.tactics}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-display transition-colors"
            >
              Close Dossier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

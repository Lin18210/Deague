import React, { useState } from 'react';
import { Scroll, Search, X, MessageSquare } from 'lucide-react';
import { getDialogueTranscript } from '../../services/dialogueHistoryService';

export default function DialogueHistoryModal({ isOpen, onClose }) {
  const [filter, setFilter] = useState('');
  const history = getDialogueTranscript();

  if (!isOpen) return null;

  const filtered = history.filter(entry => 
    entry.text?.toLowerCase().includes(filter.toLowerCase()) || 
    entry.speaker?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-900/60 rounded-2xl p-6 shadow-2xl text-amber-50 h-[560px] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center justify-between border-b border-amber-900/30 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Scroll size={22} className="text-amber-400" />
            <h2 className="font-display text-xl font-bold text-amber-200">Chronicle Dialogue Log</h2>
          </div>

          <div className="relative mr-8">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-stone-900 border border-stone-800 text-xs text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-600"
            />
          </div>
        </div>

        {/* Scrollable Dialogue List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar font-serif">
          {filtered.length === 0 ? (
            <p className="text-center text-xs text-stone-500 italic py-10">No matching dialogue records found in this chronicle.</p>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="p-3 rounded-lg bg-stone-900/50 border border-stone-850">
                <span className="font-display text-xs text-amber-400 font-bold block mb-1">
                  [{item.speaker}]
                </span>
                <p className="text-sm text-stone-200 leading-relaxed">{item.text}</p>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-display text-sm font-medium transition-colors"
          >
            Close Log
          </button>
        </div>
      </div>
    </div>
  );
}

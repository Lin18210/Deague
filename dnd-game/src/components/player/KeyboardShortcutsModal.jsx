import React from 'react';
import { Keyboard, X } from 'lucide-react';
import { getShortcutsList } from '../../services/keyboardShortcutsService';

export default function KeyboardShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null;
  const shortcuts = getShortcutsList();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-stone-950 border border-amber-900/60 rounded-2xl p-6 shadow-2xl text-amber-50">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-amber-900/30 pb-3">
          <Keyboard size={22} className="text-amber-400" />
          <h2 className="font-display text-xl font-bold text-amber-200">Keyboard Shortcuts</h2>
        </div>

        <div className="space-y-2 mb-6">
          {shortcuts.map((sc, idx) => (
            <div key={idx} className="flex items-center justify-between py-1.5 border-b border-stone-850">
              <span className="text-xs text-stone-300 font-serif">{sc.action}</span>
              <kbd className="px-2 py-0.5 rounded bg-stone-900 border border-stone-700 text-amber-300 font-mono text-xs font-bold shadow-sm">
                {sc.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-700/80 hover:bg-amber-600 text-amber-50 font-display text-sm font-medium transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}

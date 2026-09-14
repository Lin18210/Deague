import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { THEMES, applyTheme, getSavedTheme } from '../../services/themeService';
import audio from '../../utils/audioEngine';

export default function ThemeSelector() {
  const [currentTheme, setCurrentTheme] = useState(getSavedTheme);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id) => {
    audio.play('click');
    applyTheme(id);
    setCurrentTheme(id);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 rounded-lg bg-stone-900/80 border border-amber-900/40 hover:border-amber-600/70 text-amber-300 hover:text-amber-100 transition-colors"
        title="Change Visual Theme"
      >
        <Palette size={16} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-stone-950 border border-amber-900/60 shadow-2xl p-1.5 z-50 animate-fade-in">
          <div className="px-2 py-1 text-[10px] font-display uppercase tracking-wider text-amber-400/70 border-b border-stone-800 mb-1">
            Visual Ambiance
          </div>
          {THEMES.map(theme => (
            <button
              key={theme.id}
              onClick={() => handleSelect(theme.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-display flex items-center justify-between transition-colors ${
                currentTheme === theme.id 
                  ? 'bg-amber-950/70 text-amber-200 font-bold border border-amber-800/40' 
                  : 'text-stone-300 hover:bg-stone-900'
              }`}
            >
              <span>{theme.name}</span>
              <div 
                className="w-2.5 h-2.5 rounded-full border border-white/20" 
                style={{ backgroundColor: theme.primary }} 
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

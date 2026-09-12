import React, { useState } from 'react';
import { Settings, Volume2, Monitor, Eye, X, Check } from 'lucide-react';
import { loadSettings, saveSettings } from '../../services/gameSettingsService';
import audio from '../../utils/audioEngine';

export default function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState(loadSettings);

  if (!isOpen) return null;

  const handleChange = (key, val) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    saveSettings(updated);
    if (key === 'masterVolume' && audio.setVolume) {
      audio.setVolume(val / 100);
    }
  };

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
          <Settings size={22} className="text-amber-400" />
          <h2 className="font-display text-xl font-bold text-amber-200">Game Preferences</h2>
        </div>

        {/* Volume Sliders */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-xs font-display mb-1 text-amber-300">
              <span className="flex items-center gap-1.5"><Volume2 size={14} /> Master Volume</span>
              <span className="font-mono">{settings.masterVolume}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={settings.masterVolume} 
              onChange={(e) => handleChange('masterVolume', parseInt(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-display mb-1 text-amber-300">
              <span>Sound Effects</span>
              <span className="font-mono">{settings.sfxVolume}%</span>
            </div>
            <input 
              type="range" min="0" max="100" 
              value={settings.sfxVolume} 
              onChange={(e) => handleChange('sfxVolume', parseInt(e.target.value))}
              className="w-full h-1.5 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          <div className="pt-2 border-t border-stone-800 space-y-3">
            <label className="flex items-center justify-between text-xs font-display cursor-pointer select-none">
              <span className="text-stone-300 flex items-center gap-1.5"><Monitor size={14} /> Combat Screen Shake</span>
              <input 
                type="checkbox" 
                checked={settings.screenShake} 
                onChange={(e) => handleChange('screenShake', e.target.checked)}
                className="w-4 h-4 rounded bg-stone-800 border-stone-700 text-amber-600 focus:ring-0 cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between text-xs font-display cursor-pointer select-none">
              <span className="text-stone-300 flex items-center gap-1.5"><Eye size={14} /> Reduced Motion Mode</span>
              <input 
                type="checkbox" 
                checked={settings.reducedMotion} 
                onChange={(e) => handleChange('reducedMotion', e.target.checked)}
                className="w-4 h-4 rounded bg-stone-800 border-stone-700 text-amber-600 focus:ring-0 cursor-pointer"
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-amber-700/80 hover:bg-amber-600 text-amber-50 font-display text-sm font-medium transition-colors"
          >
            Save & Return
          </button>
        </div>
      </div>
    </div>
  );
}

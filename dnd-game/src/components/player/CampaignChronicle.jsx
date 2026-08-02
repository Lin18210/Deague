import React from 'react';
import { Trophy, Star, Shield, Heart, Sparkles, RefreshCw, ScrollText, Award, CheckCircle } from 'lucide-react';

export default function CampaignChronicle({ isOpen, onClose, character, storyState, onRestart }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-yellow-500/50 rounded-2xl max-w-3xl w-full p-8 shadow-2xl relative text-amber-50 overflow-y-auto max-h-[90vh]">
        <div className="text-center mb-8 border-b border-yellow-900/40 pb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-500/10 border border-yellow-500/40 text-yellow-400 mb-3 animate-bounce">
            <Trophy size={36} />
          </div>
          <h1 className="font-display text-4xl text-yellow-300 tracking-wider">CAMPAIGN COMPLETE</h1>
          <p className="text-sm text-yellow-200/70 font-serif mt-1">Eldritch Ascent — Chronicle of the High Pass</p>
          <div className="mt-3 inline-block px-4 py-1 rounded-full bg-yellow-950 border border-yellow-600/40 text-yellow-300 font-mono text-xs font-bold">
            Title Awarded: Hero of the Moonsea Pass
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 text-center">
            <span className="text-xs text-amber-50/50 font-display uppercase">Final Hero Level</span>
            <p className="text-2xl font-mono font-bold text-amber-300 mt-1">Level {character?.level || 5}</p>
            <p className="text-xs text-amber-400/80 font-serif">{character?.class || 'Champion'}</p>
          </div>
          <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 text-center">
            <span className="text-xs text-amber-50/50 font-display uppercase">Campaign Reputation</span>
            <p className="text-2xl font-mono font-bold text-emerald-400 mt-1">Heroic (+8)</p>
            <p className="text-xs text-emerald-400/80 font-serif">Loved by the Realm</p>
          </div>
          <div className="bg-slate-950/70 border border-amber-900/30 rounded-xl p-4 text-center">
            <span className="text-xs text-amber-50/50 font-display uppercase">Rift Status</span>
            <p className="text-2xl font-mono font-bold text-sky-400 mt-1">Sealed</p>
            <p className="text-xs text-sky-400/80 font-serif">The Void Depths Sealed</p>
          </div>
        </div>

        {/* Companion fate recap */}
        <div className="mb-8 bg-slate-950/60 border border-amber-900/30 rounded-xl p-5">
          <h3 className="font-display text-sm text-yellow-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Award size={16} /> Companion Fates & Bonds
          </h3>
          <div className="space-y-3 font-serif text-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-100">🕊️ Lyra Dawnveil</span>
              <span className="text-emerald-400 text-xs font-mono font-bold">Survived · Devoted Ally</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-amber-100">🗡️ Kael Thornblade</span>
              <span className="text-emerald-400 text-xs font-mono font-bold">Survived · Trusted Partner</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-amber-100">🪓 Vorn Ashmantle</span>
              <span className="text-emerald-400 text-xs font-mono font-bold">Survived · Blood Brother</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={onRestart || onClose}
            className="flex-1 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-500 hover:to-amber-500 text-yellow-950 font-display font-bold rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <RefreshCw size={18} /> Begin New Legend
          </button>
        </div>
      </div>
    </div>
  );
}

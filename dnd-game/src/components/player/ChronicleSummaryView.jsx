import React from 'react';
import { Award, BookOpen, CheckCircle, Milestone, X } from 'lucide-react';
import { getChronicleMilestones } from '../../services/campaignChronicleService';

export default function ChronicleSummaryView({ isOpen, onClose }) {
  if (!isOpen) return null;
  const milestones = getChronicleMilestones();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-stone-950 border border-amber-900/60 rounded-2xl p-6 shadow-2xl text-amber-50 h-[560px] flex flex-col">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-5 border-b border-amber-900/30 pb-3">
          <BookOpen size={22} className="text-amber-400" />
          <h2 className="font-display text-xl font-bold text-amber-200">The Ascent Chronicle</h2>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
          {milestones.map((m) => (
            <div key={m.act} className="p-4 rounded-xl bg-stone-900/80 border border-amber-900/30 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-display text-sm font-bold text-amber-300">{m.title}</h3>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                  m.status === 'completed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                }`}>
                  {m.status}
                </span>
              </div>
              <p className="text-xs text-stone-300 leading-relaxed font-serif mb-2">{m.summary}</p>
              <div className="p-2.5 rounded bg-black/40 border border-amber-950 text-[11px] text-amber-200/90 font-serif italic">
                Pivotal Choice: {m.decision}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-stone-800 flex justify-end">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-display text-sm font-medium transition-colors"
          >
            Close Chronicle
          </button>
        </div>
      </div>
    </div>
  );
}

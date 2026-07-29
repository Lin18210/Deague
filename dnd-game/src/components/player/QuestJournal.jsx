import React, { useState } from 'react';
import { ScrollText, Award, CheckCircle2, Circle, Star, Shield, Trophy, X } from 'lucide-react';

export const ACHIEVEMENTS = [
  {
    id: 'first_blood',
    title: 'First Blood',
    description: 'Survive your first skirmish against the darkness.',
    icon: '⚔️',
    unlocked: true,
    progress: '1/1'
  },
  {
    id: 'relic_hunter',
    title: 'Relic Hunter',
    description: 'Discover ancient artifacts hidden within forgotten crypts.',
    icon: '🔮',
    unlocked: true,
    progress: '3/3'
  },
  {
    id: 'master_alchemist',
    title: 'Master Alchemist',
    description: 'Brew a potion using gathered herbs and void elements.',
    icon: '🧪',
    unlocked: true,
    progress: '1/1'
  },
  {
    id: 'undying_bond',
    title: 'Bond of Valor',
    description: 'Earn maximum affinity with one of your party companions.',
    icon: '🤝',
    unlocked: false,
    progress: '70/100'
  },
  {
    id: 'void_slayer',
    title: 'Champion of the Light',
    description: 'Vanquish Seraphax the Void Herald and seal the rift.',
    icon: '✨',
    unlocked: false,
    progress: '0/1'
  }
];

export default function QuestJournal({ isOpen, onClose, storyState }) {
  const [activeTab, setActiveTab] = useState('quests'); // 'quests' | 'achievements'

  if (!isOpen) return null;

  const questLog = storyState?.questLog || [
    { title: 'The Bleeding Runes', status: 'completed', desc: 'Investigate the seal at the High Pass.' },
    { title: 'Crypt of Malveth', status: 'active', desc: 'Find the Sunken Vault keys.' },
    { title: 'The Dreaming One', status: 'active', desc: 'Stop the ritual before the moon rises.' }
  ];

  const activeQuests = questLog.filter(q => q.status === 'active');
  const completedQuests = questLog.filter(q => q.status === 'completed');

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/40 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-amber-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-amber-400/60 hover:text-amber-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-amber-900/40 pb-4">
          <ScrollText className="text-amber-400" size={28} />
          <div>
            <h2 className="font-display text-2xl text-amber-300">Quest Journal & Feats of Valor</h2>
            <p className="text-xs text-amber-50/60 font-serif">Track campaign progression and heroic deeds</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('quests')}
            className={`pb-3 px-4 font-display text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'quests'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-amber-50/50 hover:text-amber-200'
            }`}
          >
            <ScrollText size={16} /> Campaign Quests ({questLog.length})
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`pb-3 px-4 font-display text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'achievements'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-amber-50/50 hover:text-amber-200'
            }`}
          >
            <Trophy size={16} /> Feats of Valor ({ACHIEVEMENTS.filter(a => a.unlocked).length}/{ACHIEVEMENTS.length})
          </button>
        </div>

        {/* Quests View */}
        {activeTab === 'quests' && (
          <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
            <div>
              <h3 className="text-xs font-display text-amber-400 uppercase tracking-wider mb-2">Active Objectives</h3>
              <div className="space-y-2">
                {activeQuests.map((q, idx) => (
                  <div key={idx} className="bg-slate-950/70 border border-amber-900/40 rounded-lg p-3.5 flex items-start gap-3">
                    <Circle className="text-amber-400 shrink-0 mt-0.5" size={18} />
                    <div>
                      <h4 className="font-display text-amber-200 text-sm">{q.title}</h4>
                      <p className="text-xs text-amber-50/70 font-serif mt-1">{q.desc || 'Follow the story markers in the main campaign.'}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {completedQuests.length > 0 && (
              <div>
                <h3 className="text-xs font-display text-amber-50/40 uppercase tracking-wider mb-2">Completed Quests</h3>
                <div className="space-y-2">
                  {completedQuests.map((q, idx) => (
                    <div key={idx} className="bg-slate-950/40 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3 opacity-75">
                      <CheckCircle2 className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                      <div>
                        <h4 className="font-display text-amber-100 text-sm line-through decoration-amber-500/40">{q.title}</h4>
                        <p className="text-xs text-amber-50/50 font-serif mt-1">{q.desc || 'Objective fulfilled.'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Achievements View */}
        {activeTab === 'achievements' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {ACHIEVEMENTS.map((feat) => (
              <div
                key={feat.id}
                className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                  feat.unlocked
                    ? 'bg-amber-950/30 border-amber-500/40 text-amber-100'
                    : 'bg-slate-950/40 border-slate-800 text-amber-50/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{feat.icon}</span>
                  <div>
                    <h4 className="font-display text-sm text-amber-200">{feat.title}</h4>
                    <p className="text-xs text-amber-50/60 font-serif">{feat.description}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs px-2.5 py-1 rounded font-mono font-bold ${
                    feat.unlocked
                      ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300'
                      : 'bg-slate-800 border border-slate-700 text-slate-400'
                  }`}>
                    {feat.unlocked ? 'Unlocked' : feat.progress}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

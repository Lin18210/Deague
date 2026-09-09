import React, { useState } from 'react';
import { Compass, CheckSquare, Square, ChevronDown, ChevronUp } from 'lucide-react';
import { getPinnedObjectives } from '../../services/questTrackerService';
import audio from '../../utils/audioEngine';

export default function QuestTrackerWidget() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const objectives = getPinnedObjectives();

  return (
    <div className="fixed top-20 right-4 z-30 w-64 bg-stone-950/85 border border-amber-900/40 rounded-xl p-3 shadow-xl backdrop-blur-md text-amber-50">
      <div 
        className="flex items-center justify-between cursor-pointer select-none border-b border-amber-900/20 pb-2 mb-2"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-1.5 text-amber-300 font-display text-xs font-bold">
          <Compass size={14} className="text-amber-400" />
          <span>Active Quests</span>
        </div>
        <button className="text-stone-400 hover:text-amber-200">
          {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-2.5">
          {objectives.map((obj) => (
            <div key={obj.id} className="text-xs">
              <span className="font-display text-[11px] text-amber-200/90 font-semibold block">{obj.title}</span>
              <div className="flex items-start gap-1.5 mt-0.5 text-stone-300">
                {obj.completed ? (
                  <CheckSquare size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <Square size={13} className="text-amber-500/60 mt-0.5 flex-shrink-0" />
                )}
                <span className={`text-[10px] leading-tight font-serif ${obj.completed ? 'line-through text-stone-500' : 'text-stone-300'}`}>
                  {obj.step}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function SceneEditor({ scene, onUpdate, onSceneChange }) {
  return (
    <div className="bg-slate-900 border border-amber-900/30 rounded-lg p-6">
      <h3 className="font-display text-lg text-amber-300 mb-4">Scene Editor</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-display text-amber-50/60 mb-1">Scene Title</label>
          <input
            type="text"
            value={scene.title}
            onChange={(e) => onSceneChange({ title: e.target.value })}
            className="w-full bg-slate-800 border border-amber-900/30 rounded-lg px-4 py-2 text-amber-50 font-serif focus:outline-none focus:border-amber-300"
          />
        </div>
        <div>
          <label className="block text-sm font-display text-amber-50/60 mb-1">Scene Description</label>
          <textarea
            value={scene.description}
            onChange={(e) => onSceneChange({ description: e.target.value })}
            rows={5}
            className="w-full bg-slate-800 border border-amber-900/30 rounded-lg px-4 py-2 text-amber-50 font-serif focus:outline-none focus:border-amber-300 resize-none"
          />
        </div>
        <button
          onClick={onUpdate}
          className="group flex items-center gap-2 bg-amber-900/40 border border-amber-700 hover:border-amber-300 text-amber-100 px-5 py-2 rounded-lg font-display text-sm tracking-wider hover:scale-105 hover:shadow-[0_0_20px_rgba(252,211,77,0.2)] cursor-pointer"
        >
          <Send size={16} />
          Update Scene
        </button>
      </div>
    </div>
  );
}

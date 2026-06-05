import { useState } from 'react';
import GameHeader from '../player/GameHeader';
import SceneEditor from './SceneEditor';
import ChoicesManager from './ChoicesManager';
import PlayerPreview from './PlayerPreview';
import DMLog from './DMLog';
import { generateNarrative } from '../../services/aiService';
import { createStoryContext } from '../../data/storyState';

export default function DMScreen({
  scene,
  character,
  gameLog,
  storyState,
  addLog,
  onUpdateScene,
  onAddChoice,
  onDeleteChoice,
  onReturn,
}) {
  const [dmPrompt, setDmPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAIStory = async () => {
    const prompt = dmPrompt.trim();
    if (!prompt) return;
    setIsGenerating(true);
    addLog(`🤖 DM asks AI: "${prompt}"`);

    const context = createStoryContext(storyState, character, scene, gameLog, '');

    const result = await generateNarrative(
      scene,
      `[DM DIRECTIVE - Generate new scene content]: ${prompt}`,
      character,
      context
    );

    if (result.narrative) {
      onUpdateScene({ description: result.narrative });
      addLog(`📜 AI generated new scene description`);
    }
    if (result.choices && result.choices.length > 0) {
      result.choices.forEach((c) => onAddChoice(c));
    }

    setDmPrompt('');
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <GameHeader title="🎲 Dungeon Master" onReturn={onReturn} />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <SceneEditor
            scene={scene}
            onUpdate={() => addLog(`📜 Scene updated: "${scene.title}"`)}
            onSceneChange={(updates) => onUpdateScene(updates)}
          />

          <div className="bg-slate-900 border border-purple-900/30 rounded-lg p-6">
            <h3 className="font-display text-lg text-purple-300 mb-4">🤖 AI Story Generator</h3>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={dmPrompt}
                onChange={(e) => setDmPrompt(e.target.value)}
                placeholder="Tell the AI what to create..."
                className="flex-1 bg-slate-800 border border-purple-900/30 rounded-lg px-4 py-2 text-amber-50 font-serif placeholder:text-amber-50/30 focus:outline-none focus:border-purple-300"
              />
              <button
                onClick={handleAIStory}
                disabled={isGenerating || !dmPrompt.trim()}
                className="bg-purple-900/40 border border-purple-700 hover:border-purple-300 text-purple-100 px-4 py-2 rounded-lg font-display text-sm tracking-wider hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-amber-50/30 font-serif">
              Example: "The party is ambushed by goblins" or "The sorcerer offers them a dark deal"
            </p>
          </div>

          <ChoicesManager
            choices={scene.choices}
            onAdd={(c) => onAddChoice(c)}
            onDelete={(i) => onDeleteChoice(i)}
          />
        </div>

        <div className="lg:w-80 bg-slate-900 border-l border-amber-900/30 p-6 space-y-6 overflow-y-auto shrink-0">
          <PlayerPreview scene={scene} />
          <DMLog entries={gameLog} />
        </div>
      </div>
    </div>
  );
}

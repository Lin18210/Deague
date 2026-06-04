import { useCallback } from 'react';
import { generateNarrative } from '../services/aiService';

export function useAIStoryteller(scene, character, addLog) {
  const generateScene = useCallback(async (prompt, currentScene) => {
    const result = await generateNarrative(
      currentScene || scene,
      prompt,
      character
    );
    return result;
  }, [scene, character]);

  const dmGenerateScene = useCallback(async (customPrompt, currentScene) => {
    addLog('🤖 AI is weaving a new scene...');
    const result = await generateNarrative(
      currentScene || scene,
      `[DM INSTRUCTION]: ${customPrompt}`,
      character
    );
    addLog(`📜 Scene generated: ${result.narrative.substring(0, 80)}...`);
    return result;
  }, [scene, character, addLog]);

  return { generateScene, dmGenerateScene };
}

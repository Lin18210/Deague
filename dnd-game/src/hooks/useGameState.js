import { useState, useCallback } from 'react';
import { initialScene } from '../data/initialScene';
import { initialCharacter } from '../data/initialCharacter';
import { generateNarrative } from '../services/aiService';

export function useGameState() {
  const [screen, setScreen] = useState('lobby');
  const [scene, setScene] = useState(initialScene);
  const [character, setCharacter] = useState(initialCharacter);
  const [gameLog, setGameLog] = useState([
    { id: 1, text: '🎲 The adventure begins at the Crossroads Tavern...' },
  ]);
  const [narrative, setNarrative] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addLog = useCallback((text) => {
    setGameLog((prev) => [{ id: Date.now(), text }, ...prev]);
  }, []);

  const updateCharacter = useCallback((updates) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateScene = useCallback((updates) => {
    setScene((prev) => ({ ...prev, ...updates }));
  }, []);

  const handlePlayerChoice = useCallback(async (choice) => {
    addLog(`⚔️ ${character.name} chose: ${choice}`);
    setIsLoading(true);

    try {
      const result = await generateNarrative(scene, choice, character);
      setNarrative(result.narrative);
      addLog(`📖 ${result.narrative.substring(0, 100)}...`);

      if (result.choices && result.choices.length > 0) {
        setScene((prev) => ({ ...prev, choices: result.choices }));
      }
    } catch (err) {
      addLog('❌ Failed to generate narrative. Using fallback...');
    }

    setIsLoading(false);
  }, [scene, character, addLog]);

  const endCombat = useCallback((victory, enemyName) => {
    if (victory) {
      addLog(`🏆 ${character.name} defeated ${enemyName}!`);
    } else {
      addLog(`💀 ${character.name} was defeated by ${enemyName}...`);
    }
    setScreen('player');
    setNarrative('');
  }, [character, addLog]);

  const resetGame = useCallback(() => {
    setScreen('lobby');
    setScene(initialScene);
    setCharacter(initialCharacter);
    setNarrative('');
    setGameLog([{ id: Date.now(), text: '🎲 A new adventure begins...' }]);
  }, []);

  return {
    screen,
    setScreen,
    scene,
    updateScene,
    character,
    updateCharacter,
    gameLog,
    addLog,
    narrative,
    isLoading,
    handlePlayerChoice,
    endCombat,
    resetGame,
  };
}

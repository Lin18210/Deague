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
  const [combat, setCombat] = useState(null);

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

    const result = await generateNarrative(scene, choice, character);
    setNarrative(result.narrative);
    addLog(`📖 ${result.narrative.substring(0, 100)}...`);

    if (result.choices.length > 0) {
      setScene((prev) => ({ ...prev, choices: result.choices }));
    }

    setIsLoading(false);
  }, [scene, character, addLog]);

  const startCombat = useCallback((enemy) => {
    setCombat({
      active: true,
      enemy,
      turn: 'player',
      round: 1,
      combatLog: [`⚔️ Combat begins! ${enemy.name} appears!`],
      playerAC: character.ac,
    });
    addLog(`⚔️ Combat started against ${enemy.name}!`);
    setScreen('combat');
  }, [character, addLog]);

  const endCombat = useCallback((victory) => {
    if (victory) {
      addLog(`🏆 ${character.name} defeated ${combat?.enemy?.name}!`);
    } else {
      addLog(`💀 ${character.name} was defeated by ${combat?.enemy?.name}...`);
    }
    setCombat(null);
    setScreen('player');
  }, [character, combat, addLog]);

  const resetGame = useCallback(() => {
    setScreen('lobby');
    setScene(initialScene);
    setCharacter(initialCharacter);
    setNarrative('');
    setCombat(null);
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
    combat,
    startCombat,
    endCombat,
    resetGame,
  };
}

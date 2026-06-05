import { useState, useCallback, useRef, useEffect } from 'react';
import { initialScene } from '../data/initialScene';
import { initialCharacter, CLASS_PRESETS } from '../data/initialCharacter';
import { generateNarrative, generateCombatOutcome } from '../services/aiService';
import {
  initialStoryState,
  createStoryContext,
  parseFlags,
  applyConsequences,
  computePlayerReputation,
} from '../data/storyState';

export function useGameState() {
  const [screen, setScreen] = useState('lobby');
  const [selectedClass, setSelectedClass] = useState(null);
  const [scene, setScene] = useState(initialScene);
  const [character, setCharacter] = useState(initialCharacter);
  const [gameLog, setGameLog] = useState([
    { id: 1, text: '🎲 The adventure begins at the Crossroads Tavern...' },
  ]);
  const [narrative, setNarrative] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [storyState, setStoryState] = useState(initialStoryState);

  const storyStateRef = useRef(storyState);
  useEffect(() => {
    storyStateRef.current = storyState;
  }, [storyState]);

  const narrativeRef = useRef(narrative);
  useEffect(() => {
    narrativeRef.current = narrative;
  }, [narrative]);

  const addLog = useCallback((text) => {
    setGameLog((prev) => [{ id: Date.now(), text }, ...prev]);
  }, []);

  const updateCharacter = useCallback((updates) => {
    setCharacter((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateScene = useCallback((updates) => {
    setScene((prev) => ({ ...prev, ...updates }));
  }, []);

  const applyAIResponse = useCallback((result, choice) => {
    setNarrative(result.narrative);

    if (result.narrative) {
      addLog(`📖 ${result.narrative.substring(0, 120)}...`);
    }

    if (result.choices && result.choices.length > 0) {
      setScene((prev) => ({ ...prev, choices: result.choices }));
    }

    if (result.flagsBlock) {
      const parsed = parseFlags(result.flagsBlock);
      if (parsed.flags && Object.keys(parsed.flags).length > 0) {
        const flagSummary = Object.entries(parsed.flags)
          .slice(0, 5)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ');
        addLog(`⚡ Consequences: ${flagSummary}${Object.keys(parsed.flags).length > 5 ? '...' : ''}`);
      }

      setStoryState((prev) => {
        const next = applyConsequences(prev, parsed, choice);
        next.playerReputation = computePlayerReputation(next);
        return next;
      });

      if (parsed.location) {
        setScene((prev) => ({
          ...prev,
          title: parsed.location,
        }));
      }
    }
  }, [addLog]);

  const handlePlayerChoice = useCallback(async (choice) => {
    addLog(`⚔️ ${character.name} chose: ${choice}`);
    setIsLoading(true);

    const context = createStoryContext(
      storyStateRef.current,
      character,
      scene,
      gameLog,
      narrativeRef.current,
    );

    try {
      const result = await generateNarrative(scene, choice, character, context);
      setNarrative(result.narrative);
      addLog(`📖 ${result.narrative.substring(0, 120)}...`);

      if (result.choices && result.choices.length > 0) {
        setScene((prev) => ({ ...prev, choices: result.choices }));
      }

      if (result.flagsBlock) {
        const parsed = parseFlags(result.flagsBlock);
        if (parsed.flags && Object.keys(parsed.flags).length > 0) {
          const flagSummary = Object.entries(parsed.flags)
            .slice(0, 5)
            .map(([k, v]) => `${k}: ${v}`)
            .join(', ');
          addLog(`⚡ Consequences: ${flagSummary}${Object.keys(parsed.flags).length > 5 ? '...' : ''}`);
        }

        setStoryState((prev) => {
          const next = applyConsequences(prev, parsed, choice);
          next.playerReputation = computePlayerReputation(next);
          return next;
        });

        if (parsed.location) {
          setScene((prev) => ({
            ...prev,
            title: parsed.location,
          }));
        }
      }
    } catch (err) {
      addLog('❌ Failed to generate narrative. Using fallback...');
    }

    setIsLoading(false);
  }, [scene, character, gameLog, addLog]);

  const endCombat = useCallback(async (victory, enemyName, combatLog, enemy) => {
    const context = createStoryContext(
      storyStateRef.current,
      character,
      scene,
      gameLog,
      narrativeRef.current,
    );

    const outcomeLabel = victory
      ? `🏆 ${character.name} defeated ${enemyName}!`
      : `💀 ${character.name} was defeated by ${enemyName}...`;
    addLog(outcomeLabel);

    setScreen('player');
    setNarrative('');

    if (victory) {
      const lootPool = [
        'Gold Pouch (25 gp)',
        'Healing Potion',
        'Silver Dagger',
        'Scroll of Identification',
        'Enchanted Ring',
        'Healing Potion',
        'Gemstone (50 gp)',
        'Oil Flask',
        'Antidote Vial',
        'Healing Potion',
      ];
      const lootCount = Math.random() < 0.4 ? 2 : 1;
      const shuffled = [...lootPool].sort(() => Math.random() - 0.5);
      const loot = shuffled.slice(0, lootCount);

      setCharacter((prev) => ({
        ...prev,
        inventory: [...prev.inventory, ...loot],
      }));
      addLog(`🎒 Found loot: ${loot.join(', ')}`);

      try {
        const result = await generateCombatOutcome(
          character,
          enemy || { name: enemyName },
          true,
          combatLog,
          context,
        );

        if (result.narrative) {
          setNarrative(result.narrative);
          addLog(`📖 ${result.narrative.substring(0, 120)}...`);
        }

        if (result.choices && result.choices.length > 0) {
          setScene((prev) => ({ ...prev, choices: result.choices }));
        }

        if (result.flagsBlock) {
          const parsed = parseFlags(result.flagsBlock);
          setStoryState((prev) => {
            const next = applyConsequences(prev, parsed, `Victory against ${enemyName}`);
            next.playerReputation = computePlayerReputation(next);
            return next;
          });
        }
      } catch {
        setNarrative(`The dust settles. ${enemyName} lies defeated at your feet. You catch your breath and survey your surroundings.`);
      }
    }
  }, [character, scene, gameLog, addLog]);

  const selectCharacter = useCallback((classKey) => {
    const preset = CLASS_PRESETS[classKey];
    if (!preset) return;
    setSelectedClass(classKey);
    setCharacter({ ...preset });
    setScreen('prologue');
  }, []);

  const resetGame = useCallback(() => {
    setScreen('character-select');
    setSelectedClass(null);
    setScene(initialScene);
    setCharacter(initialCharacter);
    setNarrative('');
    setStoryState(initialStoryState);
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
    storyState,
    handlePlayerChoice,
    endCombat,
    selectCharacter,
    resetGame,
  };
}

import { useState } from 'react';
import LobbyScreen from './components/lobby/LobbyScreen';
import CharacterSelectScreen from './components/lobby/CharacterSelectScreen';
import PlayerScreen from './components/player/PlayerScreen';
import PrologueScreen from './components/player/PrologueScreen';
import DMScreen from './components/dm/DMScreen';
import CombatScreen from './components/combat/CombatScreen';
import { useGameState } from './hooks/useGameState';
import { useCombat } from './hooks/useCombat';
import { getAbilityMod } from './data/initialCharacter';
import audio from './utils/audioEngine';

export default function App() {
  const game = useGameState();
  const combat = useCombat(
    game.character,
    game.updateCharacter,
    game.addLog,
    game.endCombat,
    game.storyState,
  );

  const [checkPending, setCheckPending] = useState(false);
  const [checkData, setCheckData] = useState(null);
  const [diceRolling, setDiceRolling] = useState(false);
  const [rolledValue, setRolledValue] = useState(null);
  const [rollResultMsg, setRollResultMsg] = useState('');
  const [rollSuccess, setRollSuccess] = useState(false);

  const handlePlayerStartCombat = (enemy) => {
    combat.startCombat(enemy);
    game.setScreen('combat');
  };

  const handleUsePotion = (index) => {
    const item = game.character.inventory[index];
    if (!item) return;
    const itemName = typeof item === 'string' ? item : item.name;
    if (!itemName.toLowerCase().includes('potion') && !itemName.toLowerCase().includes('healing')) return;

    const healAmount = Math.floor(Math.random() * 4 + 1) + Math.floor(Math.random() * 4 + 1) + 2;
    const newHp = Math.min(game.character.health + healAmount, game.character.maxHealth);
    game.updateCharacter({ health: newHp });

    const newInventory = [...game.character.inventory];
    newInventory.splice(index, 1);
    game.updateCharacter({ inventory: newInventory });

    game.addLog(`🧪 ${game.character.name} drinks a potion: +${healAmount} HP (${newHp}/${game.character.maxHealth})`);
  };

  const handleDiceCheck = (stat, difficulty, successAction, failAction) => {
    setCheckData({ stat, difficulty, successAction, failAction });
    setCheckPending(true);
    setRolledValue(null);
    setRollResultMsg('');
    audio.play('dice');
  };

  const handleRollDice = () => {
    if (diceRolling || !checkData) return;
    setDiceRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      audio.play('dice');
      setRolledValue(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setRolledValue(finalRoll);

        const statScore = game.character.stats[checkData.stat];
        const modifier = getAbilityMod(game.character, checkData.stat);
        const total = finalRoll + modifier;
        const passed = total >= checkData.difficulty;
        setRollSuccess(passed);

        let msg = `Rolled ${finalRoll} + ${modifier >= 0 ? '+' : ''}${modifier} = ${total}. `;
        if (finalRoll === 20) msg += 'NATURAL 20! Critical Success!';
        else if (finalRoll === 1) msg += 'NATURAL 1! Critical Fumble!';
        else msg += passed ? `Passed! (DC ${checkData.difficulty})` : `Failed! (DC ${checkData.difficulty})`;
        setRollResultMsg(msg);

        if (passed) audio.play('success');
        else audio.play('fail');
        setDiceRolling(false);
      }
    }, 70);
  };

  const handleResolveCheck = () => {
    if (!checkData) return;
    audio.play('click');
    const action = rollSuccess ? checkData.successAction : checkData.failAction;
    setCheckPending(false);
    setCheckData(null);
    setRolledValue(null);
    setRollResultMsg('');
    if (typeof action === 'function') action();
  };

  const handleStoryChoice = (choice) => {
    const match = choice.match(/\[CHECK\s*:\s*(\w+)\s*:\s*(\d+)\s*:\s*(.+?)\s*:\s*(.+?)\s*\]/i);
    if (match) {
      const [, stat, difficulty, successNode, failNode] = match;
      handleDiceCheck(stat.toLowerCase(), parseInt(difficulty),
        () => game.handlePlayerChoice(successNode.trim()),
        () => game.handlePlayerChoice(failNode.trim())
      );
      return;
    }
    game.handlePlayerChoice(choice);
  };

  if (game.screen === 'character-select') {
    return <CharacterSelectScreen onSelect={game.selectCharacter} />;
  }

  if (game.screen === 'prologue') {
    return (
      <PrologueScreen
        onBegin={() => game.setScreen('player')}
        onSkip={() => game.setScreen('player')}
        character={game.character}
      />
    );
  }

  if (game.screen === 'combat' && combat.combatState) {
    return (
      <CombatScreen
        combatState={combat.combatState}
        diceResult={combat.diceResult}
        processing={combat.processing}
        combatNarration={combat.combatNarration}
        character={game.character}
        onAttack={combat.playerAttack}
        onCastSpell={combat.playerCastSpell}
        onUsePotion={combat.usePotion}
        onDodge={combat.dodge}
        onFlee={combat.flee}
        onReturn={game.resetGame}
      />
    );
  }

  if (game.screen === 'player') {
    return (
      <PlayerScreen
        scene={game.scene}
        character={game.character}
        gameLog={game.gameLog}
        narrative={game.narrative}
        isLoading={game.isLoading || diceRolling}
        storyState={game.storyState}
        onChoice={handleStoryChoice}
        onReturn={() => game.setScreen('character-select')}
        onStartCombat={handlePlayerStartCombat}
        onUsePotion={handleUsePotion}
        onDiceCheck={handleDiceCheck}
        checkPending={checkPending}
        checkData={checkData}
        onRollDice={handleRollDice}
        onResolveCheck={handleResolveCheck}
        diceRolling={diceRolling}
        rolledValue={rolledValue}
        rollResultMsg={rollResultMsg}
        rollSuccess={rollSuccess}
      />
    );
  }

  if (game.screen === 'dm') {
    return (
      <DMScreen
        scene={game.scene}
        character={game.character}
        gameLog={game.gameLog}
        storyState={game.storyState}
        addLog={game.addLog}
        onUpdateScene={game.updateScene}
        onAddChoice={(choice) => {
          game.updateScene({ choices: [...game.scene.choices, choice] });
          game.addLog(`➕ DM added choice: "${choice}"`);
        }}
        onDeleteChoice={(index) => {
          const choice = game.scene.choices[index];
          game.updateScene({
            choices: game.scene.choices.filter((_, i) => i !== index),
          });
          game.addLog(`🗑️ DM removed choice: "${choice}"`);
        }}
        onReturn={() => game.setScreen('lobby')}
      />
    );
  }

  return (
    <LobbyScreen
      onSelectDM={() => game.setScreen('dm')}
      onSelectPlayer={() => game.setScreen('character-select')}
    />
  );
}

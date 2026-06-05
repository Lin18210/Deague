import LobbyScreen from './components/lobby/LobbyScreen';
import CharacterSelectScreen from './components/lobby/CharacterSelectScreen';
import PlayerScreen from './components/player/PlayerScreen';
import PrologueScreen from './components/player/PrologueScreen';
import DMScreen from './components/dm/DMScreen';
import CombatScreen from './components/combat/CombatScreen';
import { useGameState } from './hooks/useGameState';
import { useCombat } from './hooks/useCombat';

export default function App() {
  const game = useGameState();
  const combat = useCombat(
    game.character,
    game.updateCharacter,
    game.addLog,
    game.endCombat,
    game.storyState,
  );

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
        isLoading={game.isLoading}
        storyState={game.storyState}
        onChoice={game.handlePlayerChoice}
        onReturn={() => game.setScreen('character-select')}
        onStartCombat={handlePlayerStartCombat}
        onUsePotion={handleUsePotion}
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

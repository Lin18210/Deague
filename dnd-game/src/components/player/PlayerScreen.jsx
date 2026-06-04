import { useState } from 'react';
import GameHeader from './GameHeader';
import SceneDisplay from './SceneDisplay';
import ChoiceButtons from './ChoiceButtons';
import EventLog from './EventLog';
import CharacterHUD from './CharacterHUD';
import { Swords } from 'lucide-react';

export default function PlayerScreen({
  scene,
  character,
  gameLog,
  narrative,
  isLoading,
  onChoice,
  onReturn,
  onStartCombat,
}) {
  const [showCombatPrompt, setShowCombatPrompt] = useState(false);

  const handleCombatClick = () => {
    setShowCombatPrompt(true);
  };

  const startTestCombat = () => {
    onStartCombat({
      name: 'Shadow Stalker',
      hp: 20,
      maxHp: 20,
      ac: 15,
      attackMod: 5,
      damage: '1d6',
      damageMod: 3,
      dexMod: 2,
      xp: 150,
    });
    setShowCombatPrompt(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <GameHeader
        title={scene.title}
        subtitle="A brave adventurer's tale"
        onReturn={onReturn}
      />

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-6">
          <SceneDisplay scene={scene} narrative={narrative} />

          <EventLog entries={gameLog} />

          {!showCombatPrompt && (
            <>
              <ChoiceButtons choices={scene.choices} onChoice={onChoice} isLoading={isLoading} />
              <button
                onClick={handleCombatClick}
                className="w-full text-left bg-red-900/20 border border-red-700/30 hover:border-red-400 text-red-100 px-5 py-3 rounded-lg font-serif hover:translate-x-1 cursor-pointer flex items-center gap-2"
              >
                <Swords size={18} className="text-red-400" />
                Seek out danger... (Start Combat)
              </button>
            </>
          )}

          {showCombatPrompt && (
            <div className="bg-slate-900 border border-red-900/30 rounded-lg p-6 space-y-4">
              <h3 className="font-display text-lg text-red-300">⚔️ A Foe Approaches!</h3>
              <p className="font-serif text-amber-50/70">
                A Shadow Stalker emerges from the darkness — a creature of living shadow
                with gleaming red eyes and razor-sharp claws.
              </p>
              <div className="bg-slate-800 rounded-lg p-3 text-sm font-mono text-amber-50/60 space-y-1">
                <div>Name: Shadow Stalker</div>
                <div>HP: 20 | AC: 15 | ATK: +5</div>
                <div>Damage: 1d6+3 | XP: 150</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={startTestCombat}
                  className="flex items-center gap-2 bg-red-900/50 border border-red-700 hover:border-red-400 text-red-100 px-5 py-3 rounded-lg font-display tracking-wider hover:scale-105 cursor-pointer"
                >
                  <Swords size={18} />
                  Roll Initiative!
                </button>
                <button
                  onClick={() => setShowCombatPrompt(false)}
                  className="text-amber-50/40 hover:text-amber-50/80 font-serif cursor-pointer"
                >
                  Step back
                </button>
              </div>
            </div>
          )}
        </div>

        <CharacterHUD character={character} combatActive={false} />
      </div>
    </div>
  );
}

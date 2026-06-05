import { useState } from 'react';
import GameHeader from './GameHeader';
import ChoiceButtons from './ChoiceButtons';
import EventLog from './EventLog';
import CharacterHUD from './CharacterHUD';
import DiceTower from './DiceTower';
import { Swords, Heart, Zap, User, BookOpen, Scroll, Shield, FlaskConical } from 'lucide-react';
import { getAbilityMod } from '../../data/initialCharacter';
import audio from '../../utils/audioEngine';

export default function PlayerScreen({
  scene,
  character,
  gameLog,
  narrative,
  isLoading,
  storyState,
  onChoice,
  onReturn,
  onStartCombat,
  onUsePotion,
  onDiceCheck,
  checkPending,
  checkData,
  onRollDice,
  onResolveCheck,
  diceRolling,
  rolledValue,
  rollResultMsg,
  rollSuccess,
}) {
  const [showCombatPrompt, setShowCombatPrompt] = useState(false);

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

  const handleUsePotion = (index) => {
    audio.play('potion');
    if (onUsePotion) onUsePotion(index);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-serif">
      <GameHeader
        title={scene.title}
        subtitle={storyState?.currentLocation || 'A brave adventurer\'s tale'}
        onReturn={onReturn}
      />

      <div className="w-full bg-stone-900/50 border-b border-amber-900/20 px-4 sm:px-6 py-2.5 flex flex-wrap justify-between items-center gap-3 z-10 text-sm" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
            <User size={14} className="text-amber-500" />
            <span className="font-semibold text-stone-200 text-xs">{character.name}</span>
          </div>

          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
            <Heart size={14} className={character.health < character.maxHealth / 3 ? 'text-red-500' : 'text-red-500 fill-red-900'} />
            <div className="w-20 bg-stone-800 h-1.5 rounded overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-500 h-full rounded transition-all duration-300"
                style={{ width: `${(character.health / character.maxHealth) * 100}%` }} />
            </div>
            <span className="text-[10px] text-stone-300 font-bold">{character.health}/{character.maxHealth}</span>
          </div>

          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
            <Zap size={14} className="text-indigo-400" />
            <div className="w-20 bg-stone-800 h-1.5 rounded overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full rounded transition-all duration-300"
                style={{ width: `${(character.mana / character.maxMana) * 100}%` }} />
            </div>
            <span className="text-[10px] text-stone-300 font-bold">{character.mana}/{character.maxMana}</span>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {Object.entries(character.stats).map(([stat, val]) => {
            const mod = getAbilityMod(character, stat);
            return (
              <div key={stat} className="flex flex-col items-center bg-stone-950/60 border border-stone-800/80 px-2 py-1 rounded w-12 flex-shrink-0"
                style={{ fontFamily: 'system-ui, sans-serif' }}>
                <span className="text-[9px] uppercase text-stone-400 tracking-wider font-semibold">{stat}</span>
                <span className="text-xs font-bold text-amber-500">{val}</span>
                <span className="text-[9px] text-stone-500">({mod >= 0 ? '+' : ''}{mod})</span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full gap-4 p-4 md:p-6 overflow-hidden">
        <div className="flex-1 flex flex-col bg-stone-900/35 border border-stone-800/60 rounded-xl overflow-hidden shadow-2xl relative min-h-[400px]">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-parchment">
            {narrative ? (
              <div className="space-y-3 animate-ink-bleed">
                <h3 className="text-xs text-amber-500 tracking-widest uppercase font-bold flex items-center gap-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  <BookOpen size={14} />
                  {scene.title}
                </h3>
                <p className="text-stone-100 text-base md:text-lg leading-relaxed font-serif tracking-wide first-letter:text-3xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1">
                  {narrative}
                </p>
              </div>
            ) : (
              <div className="space-y-3 animate-ink-bleed">
                <h3 className="text-xs text-amber-500 tracking-widest uppercase font-bold flex items-center gap-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
                  <BookOpen size={14} />
                  {scene.title}
                </h3>
                <p className="text-stone-100 text-base md:text-lg leading-relaxed font-serif tracking-wide first-letter:text-3xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1">
                  {scene.description}
                </p>
              </div>
            )}

            {gameLog.length > 0 && (
              <EventLog entries={gameLog} />
            )}
          </div>

          {!checkPending && !showCombatPrompt && (
            <div className="p-4 md:p-6 border-t border-stone-800/60 bg-stone-900/60 backdrop-blur-sm">
              <ChoiceButtons choices={scene.choices} onChoice={onChoice} isLoading={isLoading} onDiceCheck={onDiceCheck} />

              <button
                onClick={() => setShowCombatPrompt(true)}
                className="w-full text-left bg-red-950/20 border border-red-800/30 hover:border-red-400 text-red-200 px-5 py-3 rounded-lg mt-3 hover:translate-x-1 cursor-pointer flex items-center gap-2 transition-all text-sm"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                <Swords size={16} className="text-red-400" />
                Seek out danger... (Start Combat)
              </button>
            </div>
          )}

          {checkPending && checkData && (
            <div className="p-4 bg-stone-950/80 border-t border-purple-900/40 flex flex-col items-center justify-center space-y-4 animate-ink-bleed">
              <div className="text-center space-y-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                <span className="text-[10px] tracking-widest text-purple-400 font-bold uppercase">Dangerous Venture</span>
                <h4 className="text-base font-bold text-stone-200">{checkData.stat.toUpperCase()} Check required!</h4>
                <p className="text-[11px] text-stone-400">
                  Difficulty Class (DC): <span className="text-purple-400 font-bold">{checkData.difficulty}</span>
                </p>
              </div>
              <button
                onClick={onRollDice}
                disabled={isLoading}
                className="px-5 py-2 rounded-lg font-bold tracking-wider uppercase transition-all flex items-center gap-2 text-xs bg-purple-900 hover:bg-purple-800 text-stone-100 border border-purple-500 shadow-lg shadow-purple-950/40 active:scale-95 cursor-pointer disabled:opacity-50"
                style={{ fontFamily: 'system-ui, sans-serif' }}
              >
                Roll d20
              </button>
            </div>
          )}

          {showCombatPrompt && (
            <div className="p-4 bg-stone-950/80 border-t border-red-900/30 space-y-4 animate-ink-bleed">
              <h3 className="font-display text-lg text-red-300">⚔️ A Foe Approaches!</h3>
              <p className="font-serif text-stone-300 text-sm">
                A Shadow Stalker emerges from the darkness — a creature of living shadow with gleaming red eyes and razor-sharp claws.
              </p>
              <div className="bg-stone-900 rounded-lg p-3 text-xs space-y-1" style={{ fontFamily: 'system-ui, sans-serif' }}>
                <div className="text-stone-400">Name: <span className="text-stone-200">Shadow Stalker</span></div>
                <div className="text-stone-400">HP: <span className="text-stone-200">20</span> | AC: <span className="text-stone-200">15</span> | ATK: <span className="text-stone-200">+5</span></div>
              </div>
              <div className="flex gap-3">
                <button onClick={startTestCombat}
                  className="flex items-center gap-2 bg-red-900/50 border border-red-700 hover:border-red-400 text-red-100 px-4 py-2 rounded cursor-pointer hover:scale-105 text-xs font-bold tracking-wider"
                  style={{ fontFamily: 'system-ui, sans-serif' }}>
                  <Swords size={14} /> Roll Initiative!
                </button>
                <button onClick={() => setShowCombatPrompt(false)}
                  className="text-stone-400 hover:text-stone-200 cursor-pointer text-xs">Step back</button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full md:w-72 flex flex-col gap-4 shrink-0">
          <DiceTower
            checkPending={checkPending}
            onRollDice={onRollDice}
            onResolveCheck={onResolveCheck}
            diceRolling={diceRolling}
            rolledValue={rolledValue}
            resultMsg={rollResultMsg}
            rollSuccess={rollSuccess}
          />

          <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-4 flex flex-col shadow-2xl">
            <p className="text-[10px] text-amber-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: 'system-ui, sans-serif' }}>
              <Shield size={14} />
              Backpack
            </p>
            <div className="space-y-1.5 max-h-48 overflow-y-auto scrollbar-parchment">
              {character.inventory.length === 0 ? (
                <p className="text-[10px] text-stone-500 italic py-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Empty.</p>
              ) : (
                character.inventory.map((item, i) => {
                  const itemName = typeof item === 'string' ? item : item.name;
                  const isPotion = typeof item === 'string'
                    ? (item.toLowerCase().includes('potion') || item.toLowerCase().includes('healing'))
                    : item.type === 'potion';

                  if (isPotion) {
                    return (
                      <button key={i} onClick={() => handleUsePotion(i)}
                        className="w-full flex items-center justify-between bg-green-950/15 border border-green-900/30 hover:border-green-500 text-green-200 px-3 py-2 rounded text-xs cursor-pointer transition-all"
                        style={{ fontFamily: 'system-ui, sans-serif' }}>
                        <span className="flex items-center gap-1.5">
                          <FlaskConical size={12} className="text-green-400" />
                          {itemName}
                        </span>
                        <span className="text-[9px] text-green-400/60">Drink</span>
                      </button>
                    );
                  }

                  return (
                    <div key={i} className="flex items-center gap-2 bg-stone-950/60 border border-stone-800/60 px-3 py-2 rounded text-xs text-stone-400"
                      style={{ fontFamily: 'system-ui, sans-serif' }}>
                      <Scroll size={12} className="text-amber-800 shrink-0" />
                      <span className="truncate">{itemName}</span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

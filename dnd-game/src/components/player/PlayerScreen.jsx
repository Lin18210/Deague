import { useState } from 'react';
import { Sword, Shield, Sparkles, Flame, Scroll, User, BookOpen, Dice5, Heart, ChevronRight, ShieldAlert, Skull, FlaskConical, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import ChoiceButtons from './ChoiceButtons';
import DiceTower from './DiceTower';
import EnvironmentalHazards from './EnvironmentalHazards';
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
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-serif relative overflow-hidden select-none">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-950/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-950/30 blur-[130px]" />
        <div className="absolute bottom-0 left-[15%] w-1.5 h-1.5 bg-amber-500 rounded-full animate-float opacity-0" style={{ animationDelay: '0.1s', animationDuration: '4.2s' }} />
        <div className="absolute bottom-0 left-[38%] w-2 h-2 bg-amber-600 rounded-full animate-float opacity-0" style={{ animationDelay: '1.4s', animationDuration: '5.6s' }} />
        <div className="absolute bottom-0 left-[64%] w-1 h-1 bg-red-500 rounded-full animate-float opacity-0" style={{ animationDelay: '0.8s', animationDuration: '3.9s' }} />
        <div className="absolute bottom-0 left-[83%] w-2.5 h-2.5 bg-amber-400 rounded-full animate-float opacity-0" style={{ animationDelay: '2.8s', animationDuration: '6.2s' }} />
      </div>

      <header className="border-b border-amber-900/30 bg-stone-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="text-amber-500 w-6 h-6 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-amber-500 uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>Deague</h1>
            <p className="text-xs text-stone-400 tracking-widest uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>Interactive D&D Campaign</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { audio.setMuted(!audio.muted); }}
            className={`p-2 rounded border transition-all bg-stone-950/60 ${audio.muted ? 'border-stone-800 text-stone-500 hover:text-stone-300' : 'border-amber-900/50 text-amber-500 hover:text-amber-400'}`}
            title={audio.muted ? 'Enable sound' : 'Mute sound'}>
            {audio.muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <button onClick={onReturn}
            className="flex items-center gap-2 text-xs px-3 py-1.5 rounded border border-red-950 bg-red-950/30 text-red-300 hover:bg-red-900/40 transition-all"
            style={{ fontFamily: 'system-ui, sans-serif' }}>
            <RefreshCw size={14} />
            Retreat
          </button>
        </div>
      </header>

      <div className="w-full bg-stone-900/50 border-b border-amber-900/20 px-6 py-3 flex flex-wrap justify-between items-center gap-4 z-10" style={{ fontFamily: 'system-ui, sans-serif' }}>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
            <User className="w-4 h-4 text-amber-500" />
            <span className="font-semibold text-stone-200 text-xs">{character.name}</span>
          </div>
          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
            <Heart className={`w-4 h-4 ${character.health < character.maxHealth / 3 ? 'text-red-500 animate-bounce' : 'text-red-500 fill-red-900'}`} />
            <div className="w-24 bg-stone-800 h-2 rounded overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300"
                style={{ width: `${(character.health / character.maxHealth) * 100}%` }} />
            </div>
            <span className="text-xs text-stone-300 font-bold">{character.health}/{character.maxHealth}</span>
          </div>
          <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <div className="w-20 bg-stone-800 h-2 rounded overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full transition-all duration-300"
                style={{ width: `${(character.mana / character.maxMana) * 100}%` }} />
            </div>
            <span className="text-xs text-stone-300 font-bold">{character.mana}/{character.maxMana}</span>
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto">
          {Object.entries(character.stats).map(([stat, val]) => {
            const modifier = getAbilityMod(character, stat);
            return (
              <div key={stat} className="flex flex-col items-center bg-stone-950/60 border border-stone-800/80 px-2.5 py-1 rounded w-14 flex-shrink-0">
                <span className="text-[10px] uppercase text-stone-400 tracking-wider font-semibold">{stat.substring(0, 3)}</span>
                <span className="text-sm font-bold text-amber-500">{val}</span>
                <span className="text-[10px] text-stone-500">({modifier >= 0 ? '+' : ''}{modifier})</span>
              </div>
            );
          })}
        </div>
      </div>

      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 z-10 overflow-hidden">
        <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
          <div className="flex-1 flex flex-col bg-stone-900/35 border border-stone-800/60 rounded-xl overflow-hidden shadow-2xl relative min-h-[400px]">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-600 animate-pulse" />

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-parchment flex flex-col justify-start relative">
              <EnvironmentalHazards currentAct={scene.act || 1} />

              {(narrative || scene.description) && (
                <div className="space-y-3 animate-ink-bleed">
                  <h3 className="text-xs text-amber-500 tracking-widest uppercase font-bold flex items-center gap-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <Flame className="w-3.5 h-3.5" />
                    {scene.title}
                  </h3>
                  <p className="text-stone-100 text-base md:text-lg leading-relaxed font-serif tracking-wide first-letter:text-3xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1">
                    {narrative || scene.description}
                  </p>
                </div>
              )}

              {gameLog.length > 0 && (
                <div className="bg-stone-900/60 rounded border border-stone-800 p-4">
                  <h3 className="text-[10px] text-stone-500 tracking-widest uppercase font-bold mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Chronicle</h3>
                  <div className="max-h-32 overflow-y-auto scrollbar-parchment space-y-1.5">
                    {gameLog.slice(0, 20).map((entry) => (
                      <p key={entry.id} className="text-stone-400 text-[12px] font-serif leading-relaxed border-l-2 border-stone-800/60 pl-2">
                        {entry.text}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {!checkPending && (
              <div className="p-4 md:p-6 border-t border-stone-800/60 bg-stone-900/50 backdrop-blur-sm">
                {!showCombatPrompt && (
                  <div className="space-y-3">
                    <p className="text-[10px] text-stone-500 tracking-widest uppercase mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Select your path:</p>
                    <ChoiceButtons choices={scene.choices} onChoice={onChoice} isLoading={isLoading} />
                  </div>
                )}

                {!showCombatPrompt && (
                  <button onClick={() => setShowCombatPrompt(true)}
                    className="w-full text-left bg-red-950/20 border border-red-800/30 hover:border-red-400 text-red-200 px-5 py-3 rounded-lg mt-3 hover:translate-x-1 cursor-pointer flex items-center gap-2 transition-all text-sm"
                    style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <Sword size={16} className="text-red-400" />
                    Seek out danger... (Start Combat)
                  </button>
                )}

                {showCombatPrompt && (
                  <div className="bg-stone-950/80 border border-red-900/30 rounded-lg p-4 space-y-4 animate-ink-bleed">
                    <h3 className="font-bold text-red-300" style={{ fontFamily: 'system-ui, sans-serif' }}>⚔️ A Foe Approaches!</h3>
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
                        <Sword size={14} /> Roll Initiative!
                      </button>
                      <button onClick={() => setShowCombatPrompt(false)}
                        className="text-stone-400 hover:text-stone-200 cursor-pointer text-xs" style={{ fontFamily: 'system-ui, sans-serif' }}>Step back</button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {checkPending && checkData && (
              <div className="p-4 md:p-6 border-t border-stone-800/60 bg-stone-900/50 backdrop-blur-sm">
                <div className="p-4 bg-stone-950/80 border border-purple-950/60 rounded-lg flex flex-col items-center justify-center space-y-4 animate-ink-bleed">
                  <div className="text-center space-y-1">
                    <span className="text-[11px] tracking-widest text-purple-400 font-bold uppercase" style={{ fontFamily: 'system-ui, sans-serif' }}>Dangerous Venture</span>
                    <h4 className="text-lg font-bold text-stone-200" style={{ fontFamily: 'system-ui, sans-serif' }}>
                      {checkData.stat.toUpperCase()} Check required!
                    </h4>
                    <p className="text-xs text-stone-400" style={{ fontFamily: 'system-ui, sans-serif' }}>
                      Difficulty Class (DC): <span className="text-purple-400 font-bold">{checkData.difficulty}</span>
                    </p>
                  </div>
                  <button onClick={onRollDice} disabled={diceRolling || isLoading}
                    className={`px-6 py-2.5 rounded-lg text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 ${
                      diceRolling
                        ? 'bg-purple-950/30 border border-purple-900/40 text-purple-400 cursor-not-allowed'
                        : 'bg-purple-900 hover:bg-purple-800 text-stone-100 border border-purple-500 shadow-lg shadow-purple-950/40 active:scale-95 cursor-pointer'
                    }`} style={{ fontFamily: 'system-ui, sans-serif' }}>
                    <Dice5 className={`w-5 h-5 ${diceRolling ? 'animate-spin' : ''}`} />
                    {diceRolling ? 'Rolling...' : 'Roll d20 Initiative'}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
            <DiceTower
              checkPending={checkPending}
              onRollDice={onRollDice}
              onResolveCheck={onResolveCheck}
              diceRolling={diceRolling}
              rolledValue={rolledValue}
              resultMsg={rollResultMsg}
              rollSuccess={rollSuccess}
            />

            <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col shadow-2xl">
              <p className="text-xs text-amber-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5" style={{ fontFamily: 'system-ui, sans-serif' }}>
                <Shield className="w-3.5 h-3.5" />
                Your Backpack
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-parchment">
                {character.inventory.length === 0 ? (
                  <p className="text-[11px] text-stone-500 italic py-2" style={{ fontFamily: 'system-ui, sans-serif' }}>Your inventory bags are empty.</p>
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
        </div>
      </main>

      <footer className="border-t border-stone-900/60 bg-stone-950 py-3 text-center text-[10px] text-stone-600 z-10 tracking-widest uppercase shrink-0" style={{ fontFamily: 'system-ui, sans-serif' }}>
        Deague • Interactive D&D Tabletop Engine
      </footer>
    </div>
  );
}

import { useState, useCallback } from 'react';
import { Heart, Zap, Swords, Wand2, FlaskConical, Shield, Skull, Volume2, VolumeX, Wind } from 'lucide-react';
import DiceRoller from './DiceRoller';
import audio from '../../utils/audioEngine';

function DamagePopup({ amount, type }) {
  const isCrit = type === 'crit';
  const isHeal = type === 'heal';
  const isSpell = type === 'spell';
  return (
    <span
      className={`absolute font-bold pointer-events-none select-none z-30 animate-damage-pop ${
        isCrit ? 'text-yellow-300 text-2xl' :
        isHeal ? 'text-green-400 text-lg' :
        isSpell ? 'text-purple-300 text-xl' :
        'text-red-400 text-xl'
      }`}
    >
      {isHeal ? `+${amount}` : `-${amount}`}
    </span>
  );
}

export default function CombatScreen({
  combatState,
  diceResult,
  processing,
  combatNarration,
  character,
  onAttack,
  onCastSpell,
  onUsePotion,
  onDodge,
  onFlee,
  onReturn,
  onToggleMute,
  isMuted,
}) {
  const [popups, setPopups] = useState([]);
  const [shake, setShake] = useState('');

  const spawnPopup = useCallback((amount, type = 'hit') => {
    const id = Date.now() + Math.random();
    const x = 30 + Math.random() * 40;
    const y = 10 + Math.random() * 20;
    setPopups(prev => [...prev, { id, amount, type, x, y }]);
    setTimeout(() => setPopups(prev => prev.filter(p => p.id !== id)), 900);
  }, []);

  const triggerShake = useCallback((target) => {
    setShake(target);
    setTimeout(() => setShake(''), 400);
  }, []);

  const handleAttack = () => {
    audio.play('hit');
    onAttack();
  };

  const handleSpell = (spell) => {
    audio.play('magic');
    onCastSpell(spell);
  };

  const handlePotion = () => {
    audio.play('potion');
    onUsePotion();
  };

  const handleFlee = () => {
    audio.play('click');
    onFlee();
  };

  const handleDodge = () => {
    audio.play('click');
    onDodge();
  };

  const handleMute = () => {
    const next = !audio.muted;
    audio.setMuted(next);
    if (onToggleMute) onToggleMute(next);
    if (!next) audio.play('click');
  };

  if (!combatState) return null;

  const { enemy, turn, round, log } = combatState;
  const hpPct = (enemy.hp / enemy.maxHp) * 100;
  const playerHpPct = (character.health / character.maxHealth) * 100;
  const isPlayerTurn = turn === 'player' && !processing;

  return (
    <div className={`min-h-screen bg-slate-950 text-amber-50 flex flex-col ${shake === 'screen' ? 'animate-shake-screen' : ''}`}>
      <header className="border-b border-red-900/30 bg-slate-900/80 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-display text-red-300">⚔️ COMBAT</h2>
          <p className="text-xs text-amber-50/40 font-serif">
            Round {round} · {isPlayerTurn ? 'Your Turn' : "Enemy's Turn"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleMute}
            className={`p-1.5 rounded border transition-all ${audio.muted ? 'border-slate-800 text-slate-600 hover:text-slate-400' : 'border-amber-900/50 text-amber-500 hover:text-amber-400'}`}
            title={audio.muted ? 'Enable sound' : 'Mute sound'}
          >
            {audio.muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button
            onClick={onReturn}
            className="text-amber-50/60 hover:text-amber-300 font-display text-sm tracking-wider cursor-pointer"
          >
            Return to Lobby
          </button>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-amber-900/20 rounded-lg p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-900/30 border border-amber-700 flex items-center justify-center">
                  <Swords size={24} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-display text-amber-200">{character.name}</h3>
                  <p className="text-xs text-amber-50/50 font-serif">{character.class} Lv.{character.level}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div>
                  <div className="flex items-center gap-1 text-xs mb-1">
                    <Heart size={12} className="text-red-400" />
                    <span className="text-amber-50/60">HP</span>
                    <span className="ml-auto text-amber-50/50">{character.health}/{character.maxHealth}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full transition-all duration-300"
                      style={{ width: `${playerHpPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs mb-1">
                    <Zap size={12} className="text-blue-400" />
                    <span className="text-amber-50/60">Mana</span>
                    <span className="ml-auto text-amber-50/50">{character.mana}/{character.maxMana}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-600 to-blue-500 rounded-full transition-all duration-300"
                      style={{ width: `${(character.mana / character.maxMana) * 100}%` }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-red-900/20 rounded-lg p-6 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center ${shake === 'monster' ? 'animate-monster-shake' : ''}`}>
                  <Skull size={24} className="text-red-400" />
                </div>
                <div>
                  <h3 className="font-display text-red-300">{enemy.name}</h3>
                  <p className="text-xs text-red-50/50 font-serif">AC: {enemy.ac}</p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1 text-xs mb-1 text-red-50/70">
                  <Heart size={12} className="text-red-400" />
                  <span>HP</span>
                  <span className="ml-auto">{enemy.hp}/{enemy.maxHp}</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${hpPct > 50 ? 'bg-red-500' : hpPct > 25 ? 'bg-orange-500' : 'bg-red-700'}`}
                    style={{ width: `${hpPct}%` }} />
                </div>
              </div>
              {popups.filter(p => p.type !== 'heal').map(p => (
                <DamagePopup key={p.id} amount={p.amount} type={p.type} />
              ))}
            </div>
          </div>

          <DiceRoller result={diceResult} />

          {combatNarration && (
            <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4">
              <p className="font-serif text-red-100/80 italic">{combatNarration}</p>
            </div>
          )}

          {isPlayerTurn && (
            <div className="bg-slate-900 border border-amber-900/20 rounded-lg p-6">
              <h3 className="font-display text-lg text-amber-300 mb-4">Your Turn</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button onClick={handleAttack} disabled={processing}
                  className="flex flex-col items-center gap-1 bg-amber-900/30 border border-amber-700 hover:border-amber-300 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Swords size={28} className="text-amber-300" />
                  <span className="text-sm font-display text-amber-100">Attack</span>
                  <span className="text-xs text-amber-50/40 font-mono">d20+7</span>
                </button>

                {character.spells.map((spell, i) => (
                  <button key={i} onClick={() => handleSpell(spell)}
                    disabled={processing || character.mana < spell.manaCost}
                    className={`flex flex-col items-center gap-1 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all ${
                      character.mana >= spell.manaCost
                        ? spell.effect ? 'bg-purple-900/30 border border-purple-700 hover:border-purple-300' : 'bg-blue-900/30 border border-blue-700 hover:border-blue-300'
                        : 'bg-slate-800/50 border border-slate-800'}`}>
                    <Wand2 size={28} className={character.mana >= spell.manaCost ? spell.effect ? 'text-purple-300' : 'text-blue-300' : 'text-slate-600'} />
                    <span className="text-sm font-display text-amber-100">{spell.name}</span>
                    <span className="text-xs text-blue-50/40 font-mono">{spell.effect ? '+2 AC' : `${spell.manaCost} mp`}</span>
                  </button>
                ))}

                <button onClick={handlePotion} disabled={processing}
                  className="flex flex-col items-center gap-1 bg-green-900/20 border border-green-700/30 hover:border-green-400 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <FlaskConical size={28} className="text-green-300" />
                  <span className="text-sm font-display text-green-100">Potion</span>
                  <span className="text-xs text-green-50/40 font-mono">2d4+2</span>
                </button>

                <button onClick={handleDodge} disabled={processing}
                  className="flex flex-col items-center gap-1 bg-teal-900/20 border border-teal-700/30 hover:border-teal-400 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Wind size={28} className="text-teal-300" />
                  <span className="text-sm font-display text-teal-100">Dodge</span>
                  <span className="text-xs text-teal-50/40 font-mono">DEX roll</span>
                </button>

                <button onClick={handleFlee} disabled={processing}
                  className="flex flex-col items-center gap-1 bg-slate-800/30 border border-slate-700 hover:border-slate-500 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  <Shield size={28} className="text-slate-400" />
                  <span className="text-sm font-display text-slate-300">Flee</span>
                  <span className="text-xs text-slate-50/40 font-mono">DC 14</span>
                </button>
              </div>
            </div>
          )}

          {!isPlayerTurn && (
            <div className="bg-slate-900 border border-red-900/10 rounded-lg p-6 text-center">
              <p className="font-serif text-amber-50/50 italic animate-pulse">
                {enemy.name} is preparing to strike...
              </p>
            </div>
          )}
        </div>

        <div className="lg:w-80 bg-slate-900 border-l border-amber-900/30 p-6 overflow-y-auto shrink-0">
          <h3 className="font-display text-lg text-amber-300 mb-3">Combat Log</h3>
          <div className="bg-slate-800 border border-amber-900/20 rounded-lg p-4 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {log.map((entry, i) => (
              <p key={i} className={`text-xs font-serif ${entry.startsWith('🔥') || entry.startsWith('💀') ? 'text-yellow-300' : entry.startsWith('❌') ? 'text-red-400' : 'text-amber-50/50'}`}>
                {entry}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

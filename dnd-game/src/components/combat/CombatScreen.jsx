import { Heart, Zap, Swords, Wand2, FlaskConical, Shield, Skull } from 'lucide-react';
import DiceRoller from './DiceRoller';

export default function CombatScreen({
  combatState,
  diceResult,
  processing,
  combatNarration,
  character,
  onAttack,
  onCastSpell,
  onUsePotion,
  onFlee,
  onReturn,
}) {
  if (!combatState) return null;

  const { enemy, turn, round, log } = combatState;
  const hpPct = (enemy.hp / enemy.maxHp) * 100;
  const isPlayerTurn = turn === 'player' && !processing;

  return (
    <div className="min-h-screen bg-slate-950 text-amber-50 flex flex-col">
      <header className="border-b border-red-900/30 bg-slate-900/80 px-6 py-4 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-display text-red-300">⚔️ COMBAT</h2>
          <p className="text-xs text-amber-50/40 font-serif">
            Round {round} · {isPlayerTurn ? 'Your Turn' : "Enemy's Turn"}
          </p>
        </div>
        <button
          onClick={onReturn}
          className="text-amber-50/60 hover:text-amber-300 font-display text-sm tracking-wider cursor-pointer"
        >
          Return to Lobby
        </button>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-900 border border-amber-900/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-amber-900/30 border border-amber-700 flex items-center justify-center">
                  <Swords size={24} className="text-amber-300" />
                </div>
                <div>
                  <h3 className="font-display text-amber-200">{character.name}</h3>
                  <p className="text-xs text-amber-50/50 font-serif">
                    {character.class} Lv.{character.level}
                  </p>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div>
                  <div className="flex items-center gap-1 text-xs mb-1">
                    <Heart size={12} className="text-red-400" />
                    <span className="text-amber-50/60">HP</span>
                    <span className="ml-auto text-amber-50/50">{character.health}/{character.maxHealth}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-red-500 rounded-full"
                      style={{ width: `${(character.health / character.maxHealth) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs mb-1">
                    <Zap size={12} className="text-blue-400" />
                    <span className="text-amber-50/60">Mana</span>
                    <span className="ml-auto text-amber-50/50">{character.mana}/{character.maxMana}</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${(character.mana / character.maxMana) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-red-900/20 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700 flex items-center justify-center">
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
                  <div
                    className={`h-full rounded-full ${hpPct > 50 ? 'bg-red-500' : hpPct > 25 ? 'bg-orange-500' : 'bg-red-700'}`}
                    style={{ width: `${hpPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <DiceRoller result={diceResult} />

          {combatNarration && (
            <div className="bg-red-900/10 border border-red-900/20 rounded-lg p-4 animate-in">
              <p className="font-serif text-red-100/80 italic">{combatNarration}</p>
            </div>
          )}

          {isPlayerTurn && (
            <div className="bg-slate-900 border border-amber-900/20 rounded-lg p-6">
              <h3 className="font-display text-lg text-amber-300 mb-4">Your Turn</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={onAttack}
                  disabled={processing}
                  className="flex flex-col items-center gap-1 bg-amber-900/30 border border-amber-700 hover:border-amber-300 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Swords size={28} className="text-amber-300" />
                  <span className="text-sm font-display text-amber-100">Attack</span>
                  <span className="text-xs text-amber-50/40 font-mono">d20+7</span>
                </button>

                {character.spells.map((spell, i) => (
                  <button
                    key={i}
                    onClick={() => onCastSpell(spell)}
                    disabled={processing || character.mana < spell.manaCost}
                    className={`flex flex-col items-center gap-1 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                      character.mana >= spell.manaCost
                        ? spell.effect
                          ? 'bg-purple-900/30 border border-purple-700 hover:border-purple-300'
                          : 'bg-blue-900/30 border border-blue-700 hover:border-blue-300'
                        : 'bg-slate-800/50 border border-slate-800'
                    }`}
                  >
                    <Wand2 size={28} className={character.mana >= spell.manaCost ? spell.effect ? 'text-purple-300' : 'text-blue-300' : 'text-slate-600'} />
                    <span className="text-sm font-display text-amber-100">{spell.name}</span>
                    <span className="text-xs text-blue-50/40 font-mono">
                      {spell.effect ? `+2 AC` : `${spell.manaCost} mp`}
                    </span>
                  </button>
                ))}

                <button
                  onClick={onUsePotion}
                  disabled={processing}
                  className="flex flex-col items-center gap-1 bg-green-900/20 border border-green-700/30 hover:border-green-400 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FlaskConical size={28} className="text-green-300" />
                  <span className="text-sm font-display text-green-100">Potion</span>
                  <span className="text-xs text-green-50/40 font-mono">2d4+2</span>
                </button>

                <button
                  onClick={onFlee}
                  disabled={processing}
                  className="flex flex-col items-center gap-1 bg-slate-800/30 border border-slate-700 hover:border-slate-500 rounded-lg p-4 hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
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
              <p
                key={i}
                className={`text-xs font-serif ${
                  entry.startsWith('🔥') || entry.startsWith('💀')
                    ? 'text-yellow-300'
                    : entry.startsWith('❌')
                      ? 'text-red-400'
                      : 'text-amber-50/50'
                }`}
              >
                {entry}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

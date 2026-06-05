import { Heart, Zap, Shield, Star, ScrollText } from 'lucide-react';
import { getAbilityMod } from '../../data/initialCharacter';

function StatBar({ icon: Icon, label, current, max, color }) {
  const pct = max > 0 ? (current / max) * 100 : 0;
  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Icon size={16} className={color} />
        <span className="text-sm font-display text-amber-50/80">{label}</span>
        <span className="text-sm ml-auto text-amber-50/60">
          {current}/{max}
        </span>
      </div>
      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color === 'text-red-400' ? 'bg-red-500' : 'bg-blue-500'} rounded-full transition-[width]`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function StatRow({ label, value, mod }) {
  return (
    <div className="flex items-center justify-between py-1 border-b border-amber-900/10">
      <span className="text-xs font-display text-amber-50/50 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-amber-50/80 font-mono">
        {value} <span className="text-amber-300">({mod >= 0 ? '+' : ''}{mod})</span>
      </span>
    </div>
  );
}

function ReputationBar({ reputation }) {
  const pct = ((reputation + 10) / 20) * 100;
  let label, color;
  if (reputation >= 7) { label = 'Heroic'; color = 'text-yellow-300'; }
  else if (reputation >= 3) { label = 'Respected'; color = 'text-green-300'; }
  else if (reputation >= -2) { label = 'Neutral'; color = 'text-amber-300'; }
  else if (reputation >= -6) { label = 'Suspicious'; color = 'text-orange-300'; }
  else { label = 'Feared'; color = 'text-red-300'; }

  return (
    <div>
      <div className="flex items-center gap-2 mb-1">
        <Star size={16} className={color} />
        <span className="text-sm font-display text-amber-50/80">Reputation</span>
        <span className={`text-sm ml-auto font-display ${color}`}>{label}</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-yellow-400 rounded-full transition-[width]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CharacterHUD({ character, combatActive, storyState }) {
  const stats = character.stats;
  const strMod = getAbilityMod(character, 'STR');
  const dexMod = getAbilityMod(character, 'DEX');
  const conMod = getAbilityMod(character, 'CON');
  const intMod = getAbilityMod(character, 'INT');
  const wisMod = getAbilityMod(character, 'WIS');
  const chaMod = getAbilityMod(character, 'CHA');

  const activeQuests = storyState?.questLog?.filter(q => q.status === 'active') || [];
  const completedQuests = storyState?.questLog?.filter(q => q.status === 'completed') || [];

  return (
    <div className="lg:w-80 bg-slate-900 border-l border-amber-900/30 p-6 space-y-6 overflow-y-auto shrink-0">
      <div className="text-center">
        <h3 className="font-display text-xl text-amber-300 mb-1">{character.name}</h3>
        <p className="text-amber-50/50 text-sm font-serif">
          {character.class} · Level {character.level}
          {combatActive && <span className="ml-2 text-red-400">⚔️ IN COMBAT</span>}
        </p>
        {storyState && (
          <p className="text-amber-50/30 text-xs font-serif mt-1">{storyState.currentLocation}</p>
        )}
      </div>

      <div className="space-y-3">
        <StatBar icon={Heart} label="Health" current={character.health} max={character.maxHealth} color="text-red-400" />
        <StatBar icon={Zap} label="Mana" current={character.mana} max={character.maxMana} color="text-blue-400" />
        <div className="flex items-center gap-2 py-1">
          <Shield size={16} className="text-amber-400" />
          <span className="text-sm font-display text-amber-50/80">Armor Class</span>
          <span className="text-sm ml-auto text-amber-50/60 font-mono">{character.ac}</span>
        </div>
        {storyState && <ReputationBar reputation={storyState.playerReputation} />}
      </div>

      {activeQuests.length > 0 && (
        <div>
          <h4 className="font-display text-xs text-amber-300 mb-2 uppercase tracking-wider flex items-center gap-1">
            <ScrollText size={12} />
            Active Quests
          </h4>
          <ul className="space-y-1">
            {activeQuests.map((q, i) => (
              <li key={i} className="text-xs text-amber-50/70 font-serif bg-slate-800/50 border border-amber-900/20 rounded px-3 py-1.5">
                {q.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h4 className="font-display text-xs text-amber-300 mb-2 uppercase tracking-wider">
          Ability Scores
        </h4>
        <div className="bg-slate-800/50 border border-amber-900/20 rounded-lg px-3 py-1">
          <StatRow label="STR" value={stats.STR} mod={strMod} />
          <StatRow label="DEX" value={stats.DEX} mod={dexMod} />
          <StatRow label="CON" value={stats.CON} mod={conMod} />
          <StatRow label="INT" value={stats.INT} mod={intMod} />
          <StatRow label="WIS" value={stats.WIS} mod={wisMod} />
          <StatRow label="CHA" value={stats.CHA} mod={chaMod} />
        </div>
      </div>

      <div>
        <h4 className="font-display text-xs text-amber-300 mb-2 uppercase tracking-wider">
          Inventory
        </h4>
        <ul className="space-y-1">
          {character.inventory.map((item, i) => (
            <li
              key={i}
              className="text-sm text-amber-50/60 font-serif bg-slate-800/50 border border-amber-900/20 rounded px-3 py-1.5"
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { Heart, Zap, Shield, Star, ScrollText, FlaskConical, BookOpen } from 'lucide-react';
import { getAbilityMod } from '../../data/initialCharacter';
import SpellbookModal from './SpellbookModal';
import AlchemyCrafting from './AlchemyCrafting';
import QuestJournal from './QuestJournal';

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

export default function CharacterHUD({ character, combatActive, storyState, onUsePotion }) {
  const [isSpellbookOpen, setIsSpellbookOpen] = useState(false);
  const [isAlchemyOpen, setIsAlchemyOpen] = useState(false);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
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

      <div className="pt-1 space-y-2">
        <button
          onClick={() => setIsSpellbookOpen(true)}
          className="w-full py-2 px-3 bg-indigo-950/70 hover:bg-indigo-900 border border-indigo-700/50 hover:border-indigo-400 text-indigo-200 rounded-lg font-display text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <BookOpen size={14} className="text-indigo-400" />
          <span>Open Spellbook & Grimoire</span>
        </button>

        <button
          onClick={() => setIsAlchemyOpen(true)}
          className="w-full py-2 px-3 bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-700/50 hover:border-emerald-400 text-emerald-200 rounded-lg font-display text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <FlaskConical size={14} className="text-emerald-400" />
          <span>Alchemy & Crafting Lab</span>
        </button>

        <button
          onClick={() => setIsJournalOpen(true)}
          className="w-full py-2 px-3 bg-amber-950/70 hover:bg-amber-900 border border-amber-700/50 hover:border-amber-400 text-amber-200 rounded-lg font-display text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
        >
          <ScrollText size={14} className="text-amber-400" />
          <span>Quest Journal & Achievements</span>
        </button>
      </div>

      <SpellbookModal
        isOpen={isSpellbookOpen}
        onClose={() => setIsSpellbookOpen(false)}
        character={character}
        onCastSpell={(spell) => {
          if (character.mana >= spell.manaCost && character.mana !== undefined) {
            character.mana -= spell.manaCost;
          }
        }}
      />

      <AlchemyCrafting
        isOpen={isAlchemyOpen}
        onClose={() => setIsAlchemyOpen(false)}
        character={character}
        onBrewPotion={(newItem) => {
          if (character?.inventory) {
            character.inventory.push(newItem);
          }
        }}
      />

      <QuestJournal
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
        storyState={storyState}
      />

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
          {character.inventory.map((item, i) => {
            const isPotion = typeof item === 'string'
              ? (item.toLowerCase().includes('potion') || item.toLowerCase().includes('healing'))
              : item.type === 'potion';

            const itemName = typeof item === 'string' ? item : item.name;

            if (isPotion && onUsePotion) {
              return (
                <li key={i}>
                  <button
                    onClick={(e) => { e.stopPropagation(); onUsePotion(i); }}
                    className="w-full text-left text-sm text-green-300/80 font-serif bg-green-900/15 border border-green-700/20 hover:border-green-400 rounded px-3 py-1.5 cursor-pointer flex items-center gap-2 group transition-all"
                  >
                    <FlaskConical size={14} className="text-green-400 group-hover:scale-110 transition-transform" />
                    <span>{itemName}</span>
                    <span className="ml-auto text-[10px] text-green-400/60 group-hover:text-green-300">Drink</span>
                  </button>
                </li>
              );
            }

            return (
              <li
                key={i}
                className="text-sm text-amber-50/60 font-serif bg-slate-800/50 border border-amber-900/20 rounded px-3 py-1.5"
              >
                {itemName}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

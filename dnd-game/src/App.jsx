import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, 
  Sword, 
  Sparkles, 
  Flame, 
  Scroll, 
  User, 
  BookOpen, 
  Dice5, 
  Heart, 
  Compass, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  ChevronRight, 
  Award,
  Volume2,
  VolumeX,
  AlertCircle,
  PlusCircle,
  ShieldAlert,
  Skull,
  Send,
  Sparkle,
  HelpCircle,
  FlaskConical,
  Cross,
  Target,
  Star,
  Music,
  Leaf,
  Wind,
  Moon,
  Zap,
  Axe
} from 'lucide-react';
import audio from './utils/audioEngine';
import PrologueScreen from './components/player/PrologueScreen';
import SceneIllustration from './components/player/SceneIllustration';
import MiniMap from './components/player/MiniMap';
import { rollDice, rollD20 } from './utils/diceUtils';
import PartyPanel from './components/combat/PartyPanel';
import EnemyPanel from './components/combat/EnemyPanel';
import InitiativeTracker from './components/combat/InitiativeTracker';
import { DEFAULT_COMPANIONS, ENEMY_GROUPS, rollDiceNotation, getDexMod } from './data/companions';
import { STORY_NODES } from './data/storyNodes';

const STYLE_INJECTION = `
@keyframes float-up {
  0% { transform: translateY(15px) scale(0.8); opacity: 0; }
  50% { opacity: 0.6; }
  100% { transform: translateY(-120px) scale(1.3); opacity: 0; }
}
@keyframes campfire-glow {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 15px rgba(239, 68, 68, 0.4)); }
  50% { transform: scale(1.08); filter: drop-shadow(0 0 30px rgba(245, 158, 11, 0.7)); }
}
@keyframes pulse-ring {
  0% { transform: scale(0.95); opacity: 0.2; }
  50% { opacity: 0.5; }
  100% { transform: scale(1.15); opacity: 0; }
}
@keyframes rune-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
@keyframes ink-bleed {
  from { filter: blur(6px) contrast(150%); opacity: 0; transform: scale(0.98); }
  to { filter: blur(0px) contrast(100%); opacity: 1; transform: scale(1); }
}
@keyframes damage-pop {
  0% { transform: translateY(0) scale(0.8); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
}
@keyframes shake {
  10%, 90% { transform: translate3d(-2px, 0, 0); }
  20%, 80% { transform: translate3d(4px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-6px, 0, 0); }
  40%, 60% { transform: translate3d(6px, 0, 0); }
}
@keyframes red-flash {
  0% { opacity: 0; }
  10% { opacity: 0.45; }
  100% { opacity: 0; }
}
@keyframes green-flash {
  0% { opacity: 0; }
  15% { opacity: 0.35; }
  100% { opacity: 0; }
}
@keyframes purple-flash {
  0% { opacity: 0; }
  15% { opacity: 0.35; }
  100% { opacity: 0; }
}
@keyframes player-strike {
  0% { transform: scale(1) translate(0, 0); }
  30% { transform: scale(1.08) translate(30px, -15px) rotate(8deg); }
  100% { transform: scale(1) translate(0, 0); }
}
@keyframes monster-strike {
  0% { transform: scale(1) translate(0, 0); }
  30% { transform: scale(1.08) translate(-30px, 15px) rotate(-8deg); }
  100% { transform: scale(1) translate(0, 0); }
}
@keyframes monster-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
.animate-float { animation: float-up 3.5s ease-out infinite; }
.animate-glow { animation: campfire-glow 2s ease-in-out infinite; }
.animate-ring { animation: pulse-ring 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite; }
.animate-spin-slow { animation: rune-spin 25s linear infinite; }
.animate-ink-bleed { animation: ink-bleed 1s ease-out forwards; }
.animate-damage { animation: damage-pop 0.8s ease-out forwards; }
.animate-shake-screen { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
.animate-red-flash { animation: red-flash 0.5s ease-out forwards; }
.animate-green-flash { animation: green-flash 0.6s ease-out forwards; }
.animate-purple-flash { animation: purple-flash 0.6s ease-out forwards; }
.animate-player-strike { animation: player-strike 0.35s ease-in-out forwards; }
.animate-monster-strike { animation: monster-strike 0.35s ease-in-out forwards; }
.animate-monster-shake { animation: monster-shake 0.35s cubic-bezier(.36,.07,.19,.97) both; }
.scrollbar-parchment::-webkit-scrollbar { width: 5px; }
.scrollbar-parchment::-webkit-scrollbar-track { background: rgba(28, 25, 23, 0.9); }
.scrollbar-parchment::-webkit-scrollbar-thumb { background: rgba(217, 119, 6, 0.3); border-radius: 4px; }
`;

// Class-specific signature abilities for combat
const CLASS_ABILITIES = {
  warrior:   { name: 'Battle Cry',       manaCost: 0,  stat: 'strength',     icon: '⚔️', color: 'amber',   tooltip: 'Free. Unleash a war cry — boosts your next strike by +5 damage and intimidates the foe.' },
  mage:      { name: 'Arcane Surge',     manaCost: 4,  stat: 'intelligence',  icon: '✨', color: 'purple',  tooltip: '4 MP. Channel raw aether into a devastating bolt scaled to your Intelligence.' },
  rogue:     { name: 'Sneak Attack',     manaCost: 2,  stat: 'dexterity',    icon: '🗡️', color: 'emerald', tooltip: '2 MP. Strike from the shadows — deals bonus sneak damage. Chance to score a critical hit.' },
  paladin:   { name: 'Divine Smite',     manaCost: 3,  stat: 'charisma',     icon: '✝️', color: 'yellow',  tooltip: '3 MP. Channel divine wrath through your blade. Deals holy damage and restores 8 HP.' },
  ranger:    { name: "Hunter's Mark",    manaCost: 2,  stat: 'wisdom',       icon: '🎯', color: 'green',   tooltip: "2 MP. Mark your quarry — your next physical attack deals +1d6 bonus hunter's damage." },
  cleric:    { name: 'Sacred Flame',     manaCost: 1,  stat: 'wisdom',       icon: '🔥', color: 'sky',     tooltip: '1 MP. Radiant flame descends from above — auto-hits for divine fire damage. No attack roll needed.' },
  bard:      { name: 'Vicious Mockery',  manaCost: 1,  stat: 'charisma',     icon: '🎵', color: 'pink',    tooltip: '1 MP. Unleash a torrent of biting words. Deals psychic damage and weakens the enemy next turn.' },
  barbarian: { name: 'Rage',             manaCost: 0,  stat: 'strength',     icon: '🔥', color: 'red',     tooltip: 'Free. Enter a berserker rage — halves incoming damage and powers up your next strike.' },
  druid:     { name: 'Thorn Whip',       manaCost: 2,  stat: 'wisdom',       icon: '🌿', color: 'lime',    tooltip: '2 MP. Lash a thorned vine at the enemy. Deals nature damage and drags them into melee range.' },
  monk:      { name: 'Stunning Strike',  manaCost: 2,  stat: 'dexterity',    icon: '👊', color: 'cyan',    tooltip: '2 MP. Channel Ki into your fist — precise strike that may stun the enemy, causing them to lose their next action.' },
  sorcerer:  { name: 'Chaos Bolt',       manaCost: 2,  stat: 'charisma',     icon: '⚡', color: 'violet',  tooltip: '2 MP. Hurl a bolt of wild, random elemental energy. May chain to deal bonus damage a second time.' },
  warlock:   { name: 'Eldritch Blast',   manaCost: 0,  stat: 'charisma',     icon: '🌑', color: 'slate',   tooltip: 'Free. Your pact grants an endless beam of necrotic force — reliable CHA-scaled damage at no cost.' },
};

const CLASSES = {
  warrior: {
    key: "warrior",
    name: "Vanguard",
    desc: "A veteran heavy knight armored in steel plating. Specializes in direct, brutal physical checks.",
    icon: Sword,
    color: "from-amber-700 to-red-800",
    themeColor: "amber",
    stats: { strength: 16, dexterity: 14, constitution: 15, intelligence: 10, wisdom: 12, charisma: 8 },
    hp: 34,
    mana: 4,
    inventory: [
      { id: "sword_1", name: "Steel Broadsword", desc: "Adds +2 to Strength Checks when equipped.", statBonus: { strength: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 }
    ]
  },
  mage: {
    key: "mage",
    name: "Aether Weaver",
    desc: "A sage who studies cosmic anomalies and spells. Excellent at solving runic patterns and magic.",
    icon: Sparkles,
    color: "from-purple-700 to-indigo-900",
    themeColor: "purple",
    stats: { strength: 7, dexterity: 12, constitution: 12, intelligence: 17, wisdom: 14, charisma: 11 },
    hp: 20,
    mana: 28,
    inventory: [
      { id: "staff_1", name: "Aether Conduit Staff", desc: "Adds +2 to Intelligence Checks when equipped.", statBonus: { intelligence: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 }
    ]
  },
  rogue: {
    key: "rogue",
    name: "Shadowstalker",
    desc: "A master of silent infiltration and trap disabling. Highly proficient in reflexes and acrobatics.",
    icon: Compass,
    color: "from-emerald-700 to-teal-900",
    themeColor: "emerald",
    stats: { strength: 11, dexterity: 17, constitution: 13, intelligence: 11, wisdom: 10, charisma: 14 },
    hp: 24,
    mana: 10,
    inventory: [
      { id: "daggers_1", name: "Dual Silent Daggers", desc: "Adds +2 to Dexterity Checks when equipped.", statBonus: { dexterity: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 }
    ]
  },
  paladin: {
    key: "paladin",
    name: "Oathkeeper",
    desc: "A holy warrior bound by sacred oath, channeling divine power to smite evil and shield the innocent.",
    icon: Cross,
    color: "from-yellow-600 to-amber-800",
    themeColor: "yellow",
    stats: { strength: 16, dexterity: 10, constitution: 14, intelligence: 10, wisdom: 12, charisma: 16 },
    hp: 30,
    mana: 18,
    inventory: [
      { id: "longsword_1", name: "Sacred Longsword", desc: "Adds +2 to Strength and Charisma Checks when equipped.", statBonus: { strength: 2, charisma: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "holysymbol_1", name: "Holy Symbol", desc: "Adds +1 to Charisma Checks while worn.", statBonus: { charisma: 1 }, type: "trinket", equipped: true }
    ]
  },
  ranger: {
    key: "ranger",
    name: "Wildstrider",
    desc: "A hunter of the wilds, striking from a distance with deadly precision and primal survival instincts.",
    icon: Target,
    color: "from-green-700 to-emerald-900",
    themeColor: "green",
    stats: { strength: 13, dexterity: 17, constitution: 14, intelligence: 11, wisdom: 14, charisma: 10 },
    hp: 26,
    mana: 14,
    inventory: [
      { id: "bow_1", name: "Longbow of the Forest", desc: "Adds +2 to Dexterity Checks when equipped.", statBonus: { dexterity: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "trap_1", name: "Hunting Trap", desc: "Can be placed to immobilize enemies.", type: "tool", equipped: false }
    ]
  },
  cleric: {
    key: "cleric",
    name: "Divine Herald",
    desc: "A vessel of divine magic, healing allies and smiting foes with sacred flames granted by the gods.",
    icon: Star,
    color: "from-sky-600 to-blue-900",
    themeColor: "sky",
    stats: { strength: 13, dexterity: 10, constitution: 14, intelligence: 12, wisdom: 17, charisma: 13 },
    hp: 26,
    mana: 24,
    inventory: [
      { id: "mace_1", name: "Sacred Mace", desc: "Adds +1 to Strength and Wisdom Checks when equipped.", statBonus: { strength: 1, wisdom: 1 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "symbol_1", name: "Holy Symbol of Lathander", desc: "Adds +2 to Wisdom Checks while worn.", statBonus: { wisdom: 2 }, type: "trinket", equipped: true }
    ]
  },
  bard: {
    key: "bard",
    name: "Maestro",
    desc: "A silver-tongued performer who weaves magic through music, inspiring allies and bewildering foes.",
    icon: Music,
    color: "from-pink-700 to-rose-900",
    themeColor: "pink",
    stats: { strength: 9, dexterity: 14, constitution: 13, intelligence: 13, wisdom: 11, charisma: 18 },
    hp: 22,
    mana: 22,
    inventory: [
      { id: "lute_1", name: "Lute of Sharpness", desc: "Adds +2 to Charisma Checks when equipped.", statBonus: { charisma: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "scroll_1", name: "Spellbook of Songs", desc: "Adds +1 to Intelligence Checks while carried.", statBonus: { intelligence: 1 }, type: "tool", equipped: false }
    ]
  },
  barbarian: {
    key: "barbarian",
    name: "Berserker",
    desc: "A primal warrior who channels fury into devastating combat, shrugging off wounds that would fell others.",
    icon: Flame,
    color: "from-red-700 to-orange-900",
    themeColor: "red",
    stats: { strength: 18, dexterity: 14, constitution: 17, intelligence: 7, wisdom: 10, charisma: 8 },
    hp: 42,
    mana: 4,
    inventory: [
      { id: "axe_1", name: "Greataxe of Fury", desc: "Adds +3 to Strength Checks when equipped.", statBonus: { strength: 3 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 }
    ]
  },
  druid: {
    key: "druid",
    name: "Shapeshifter",
    desc: "A guardian of nature who commands the elements and transforms into beasts to overwhelm enemies.",
    icon: Leaf,
    color: "from-lime-700 to-green-900",
    themeColor: "lime",
    stats: { strength: 10, dexterity: 13, constitution: 13, intelligence: 13, wisdom: 17, charisma: 12 },
    hp: 22,
    mana: 22,
    inventory: [
      { id: "staff_1", name: "Thornwood Staff", desc: "Adds +2 to Wisdom Checks when equipped.", statBonus: { wisdom: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "focus_1", name: "Druidic Focus", desc: "Adds +1 to Wisdom Checks while carried.", statBonus: { wisdom: 1 }, type: "trinket", equipped: false }
    ]
  },
  monk: {
    key: "monk",
    name: "Way of Shadow",
    desc: "A disciplined martial artist who harnesses Ki energy to strike with supernatural speed and precision.",
    icon: Wind,
    color: "from-cyan-700 to-slate-800",
    themeColor: "cyan",
    stats: { strength: 12, dexterity: 17, constitution: 14, intelligence: 12, wisdom: 16, charisma: 9 },
    hp: 24,
    mana: 16,
    inventory: [
      { id: "kama_1", name: "Kama of the Wind", desc: "Adds +2 to Dexterity Checks when equipped.", statBonus: { dexterity: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "crystal_1", name: "Meditation Crystal", desc: "Adds +1 to Wisdom Checks while carried.", statBonus: { wisdom: 1 }, type: "trinket", equipped: false }
    ]
  },
  sorcerer: {
    key: "sorcerer",
    name: "Stormcaller",
    desc: "A spellcaster of raw arcane bloodline, bending reality through sheer force of will and innate charisma.",
    icon: Zap,
    color: "from-violet-700 to-purple-900",
    themeColor: "violet",
    stats: { strength: 7, dexterity: 13, constitution: 13, intelligence: 14, wisdom: 10, charisma: 18 },
    hp: 18,
    mana: 30,
    inventory: [
      { id: "wand_1", name: "Crystal Wand", desc: "Adds +2 to Charisma and Intelligence Checks when equipped.", statBonus: { charisma: 2, intelligence: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 }
    ]
  },
  warlock: {
    key: "warlock",
    name: "Hexblade",
    desc: "A pact-bound conduit of dark power, wielding eldritch forces granted by an otherworldly patron.",
    icon: Moon,
    color: "from-slate-700 to-gray-900",
    themeColor: "slate",
    stats: { strength: 10, dexterity: 13, constitution: 13, intelligence: 13, wisdom: 11, charisma: 17 },
    hp: 22,
    mana: 12,
    inventory: [
      { id: "blade_1", name: "Pact Blade", desc: "Adds +2 to Charisma Checks when equipped.", statBonus: { charisma: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 },
      { id: "tome_1", name: "Tome of the Forgotten", desc: "Adds +1 to Intelligence Checks while carried.", statBonus: { intelligence: 1 }, type: "tool", equipped: false }
    ]
  }
};

// STORY_NODES imported from ./data/storyNodes.js

const GEMINI_MODEL = 'gemini-2.5-flash';

const getClassAC = (className) => {
  const acMap = {
    warrior: 18,
    mage: 14,
    rogue: 16,
    paladin: 19,
    ranger: 16,
    cleric: 17,
    bard: 15,
    barbarian: 15,
    druid: 15,
    monk: 17,
    sorcerer: 14,
    warlock: 16
  };
  return acMap[className] || 15;
};

const getClassWeaponDamage = (className) => {
  const damageMap = {
    warrior: '1d10',
    mage: '1d6',
    rogue: '1d6',
    paladin: '1d8',
    ranger: '1d8',
    cleric: '1d6',
    bard: '1d6',
    barbarian: '1d12',
    druid: '1d6',
    monk: '1d6',
    sorcerer: '1d4',
    warlock: '1d8'
  };
  return damageMap[className] || '1d8';
};

const getClassKeyStat = (className) => {
  const statMap = {
    warrior: 'strength',
    mage: 'intelligence',
    rogue: 'dexterity',
    paladin: 'strength',
    ranger: 'dexterity',
    cleric: 'wisdom',
    bard: 'charisma',
    barbarian: 'strength',
    druid: 'wisdom',
    monk: 'dexterity',
    sorcerer: 'charisma',
    warlock: 'charisma'
  };
  return statMap[className] || 'strength';
};

export default function App() {
  const [gameState, setGameState] = useState('character-select');
  const [postCombatNode, setPostCombatNode] = useState('act1_hound_victory'); // node to advance to after combat victory
  const [selectedClass, setSelectedClass] = useState('warrior');
  const [campaignMode, setCampaignMode] = useState('static'); // 'static' or 'ai'
  const [charStats, setCharStats] = useState(CLASSES.warrior.stats);
  const [inventory, setInventory] = useState(CLASSES.warrior.inventory);
  const [hp, setHp] = useState(CLASSES.warrior.hp);
  const [maxHp, setMaxHp] = useState(CLASSES.warrior.hp);
  const [mana, setMana] = useState(CLASSES.warrior.mana);
  const [maxMana, setMaxMana] = useState(CLASSES.warrior.mana);
  const [currentNodeKey, setCurrentNodeKey] = useState('intro_camp_chat');
  const [journal, setJournal] = useState([]);
  
  // Custom API configuration
  const [apiKey, setApiKey] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [currentAiNode, setCurrentAiNode] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [aiPrologueParagraphs, setAiPrologueParagraphs] = useState(null);

  // Dice rolling state variables
  const [diceRolling, setDiceRolling] = useState(false);
  const [rolledValue, setRolledValue] = useState(20);
  const [activeCheck, setActiveCheck] = useState(null); 
  const [rollResultMsg, setRollResultMsg] = useState('');
  const [rollSuccess, setRollSuccess] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  // Combat systems
  const [combatLog, setCombatLog] = useState([]);
  const [damagePopups, setDamagePopups] = useState([]); 
  // Active combat buffs: { battleCry, rage, huntersMarkActive, bardDebuff, stunned }
  const [combatBuffs, setCombatBuffs] = useState({ battleCry: false, rage: false, huntersMarkActive: false, bardDebuff: false, enemyStunned: false });
  
  // Refactored immersive combat states
  const [combatPhase, setCombatPhase] = useState('select-action'); // 'initiative-roll' | 'select-action' | 'player-roll' | 'player-resolve' | 'enemy-wait' | 'enemy-roll' | 'enemy-resolve'
  const [combatRollDetails, setCombatRollDetails] = useState(''); // E.g. "Attack roll: 1d20 + STR (+3)"
  const [activeFlashEffect, setActiveFlashEffect] = useState(''); // 'red' | 'green' | 'purple' | ''

  // ── Party Combat System (BG3-style) ────────────────────────────────────────
  const [party, setParty] = useState([]);           // All 4 party members (player + companions)
  const [enemies, setEnemies] = useState([]);        // Enemy group (1-4 enemies)
  const [initiativeOrder, setInitiativeOrder] = useState([]); // All combatants sorted by dex roll
  const [activeInitiativeIndex, setActiveInitiativeIndex] = useState(0);
  const [selectedTargetId, setSelectedTargetId] = useState(null); // Enemy id selected by player
  const [companionActing, setCompanionActing] = useState(false); // Lock UI while companion acts
  const initiativeOrderRef = useRef([]);
  const enemiesRef = useRef([]);
  const partyRef = useRef([]);
  const activeInitiativeIndexRef = useRef(0);
  useEffect(() => { initiativeOrderRef.current = initiativeOrder; }, [initiativeOrder]);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { partyRef.current = party; }, [party]);
  useEffect(() => { activeInitiativeIndexRef.current = activeInitiativeIndex; }, [activeInitiativeIndex]);

  const textEndRef = useRef(null);
  const activeCheckRef = useRef(null);

  useEffect(() => {
    activeCheckRef.current = activeCheck;
  }, [activeCheck]);

  useEffect(() => {
    audio.setMuted(isMuted);
  }, [isMuted]);

  const handleClassChange = (key) => {
    playSoundEffect('click');
    setSelectedClass(key);
    setCharStats(CLASSES[key].stats);
    setHp(CLASSES[key].hp);
    setMaxHp(CLASSES[key].hp);
    setMana(CLASSES[key].mana);
    setMaxMana(CLASSES[key].mana);
    setInventory(CLASSES[key].inventory);
  };

  const playSoundEffect = (type) => {
    audio.play(type);
  };

  const handleMuteToggle = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    playSoundEffect('click');
  };

  const generateAiPrologue = async () => {
    setIsAiLoading(true);
    setApiError(null);
    playSoundEffect('magic');

    const userQuery = `The player is starting a dark fantasy campaign "Eldritch Ascent" as a ${CLASSES[selectedClass].name}.
Generate a compelling 3-4 paragraph cinematic prologue backstory that explains why this adventurer is at the High Pass of the frozen mountain of Eldritch Ascent tonight.
Include their class theme, a personal motivation for ascending the mountain, a past failure or regret, and a hint of the ancient malevolent force waking inside the mountain.
Make it feel like the opening of an epic dark-fantasy novel.
Return a JSON array of paragraphs, where each paragraph has:
{
  "text": "The narrative paragraph text...",
  "subtitle": "A short dramatic phrase summarizing this paragraph (under 5 words)"
}`;

    const systemPrompt = `You are a master fantasy novelist and AI Dungeon Master.
Your task is to write a highly immersive, cinematic prologue backstory in a dark-fantasy style.
You MUST respond strictly with a valid JSON array matching this schema structure:
[
  {
    "text": "Paragraph text...",
    "subtitle": "A short dramatic subtitle"
  }
]`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "ARRAY",
          items: {
            type: "OBJECT",
            properties: {
              text: { type: "STRING" },
              subtitle: { type: "STRING" }
            },
            required: ["text", "subtitle"]
          }
        }
      },
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const activeKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";
    if (!activeKey) {
      setIsAiLoading(false);
      setAiPrologueParagraphs(null);
      setGameState('prologue');
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${activeKey}`;
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("API call failed");

      const result = await response.json();
      const rawJsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsedParagraphs = JSON.parse(rawJsonText);
      if (Array.isArray(parsedParagraphs) && parsedParagraphs.length > 0) {
        setAiPrologueParagraphs(parsedParagraphs);
      } else {
        setAiPrologueParagraphs(null);
      }
    } catch (err) {
      console.warn("Failed to generate AI prologue backstory, using fallback static prologue.", err);
      setAiPrologueParagraphs(null);
    } finally {
      setIsAiLoading(false);
      setGameState('prologue');
    }
  };

  const startGame = () => {
    playSoundEffect('success');
    if (campaignMode === 'ai') {
      generateAiPrologue();
    } else {
      setAiPrologueParagraphs(null);
      setGameState('prologue');
    }
  };

  const beginAdventureAfterPrologue = async () => {
    playSoundEffect('success');
    setApiError(null);
    if (campaignMode === 'ai') {
      setGameState('active');
      setJournal([]);
      await fetchNextAiNode("Begin the adventure! Introduce the dark environment and give initial options.");
    } else {
      setGameState('active');
      setCurrentNodeKey('intro_camp_chat');
      setJournal([{ title: STORY_NODES.intro_camp_chat.title, text: STORY_NODES.intro_camp_chat.text, act: STORY_NODES.intro_camp_chat.act, actLabel: STORY_NODES.intro_camp_chat.actLabel, companionDialogue: STORY_NODES.intro_camp_chat.companionDialogue }]);
    }
  };

  const fetchNextAiNode = async (actionTaken, isSuccessRoll = null, rollDetails = "") => {
    setIsAiLoading(true);
    setApiError(null);
    playSoundEffect('magic');

    // Build current profile descriptors to context-feed the Gemini model
    const profile = {
      className: CLASSES[selectedClass].name,
      hp: `${hp}/${maxHp}`,
      mana: `${mana}/${maxMana}`,
      inventory: inventory.map(item => `${item.name} (${item.desc})`).join(', '),
      stats: charStats
    };

    const actionContext = isSuccessRoll !== null
      ? `The player tried to perform a stat check: "${actionTaken}".\nRoll detail description: ${rollDetails || `Roll result was a ${isSuccessRoll ? 'SUCCESS' : 'FAILURE'}`}.\nDescribe the aftermath of this check based on the success/failure.`
      : `The player chose to: "${actionTaken}".`;

    // Incorporate story journal history so the DM maintains context
    const recentJournalContext = journal.slice(-6).map(j => `Scene: ${j.title}\nNarrative: ${j.text}`).join('\n\n');

    const userQuery = `=== STORY JOURNAL SO FAR ===
${recentJournalContext || "None. The adventure has just begun."}

=== CURRENT CHARACTER STATUS ===
Profile: ${JSON.stringify(profile)}

=== PLAYER ACTION TO RESOLVE ===
${actionContext}

Generate the next exciting narrative event. Keep the tone dark, serious, and immersive. 
Give exactly 2 choices, scaling difficulty classes for stat checks between 11 and 17. 
If an action should logically lead to a dangerous fight, indicate a "combatStart: true" choice.
If they are caught in a hazard, traps, or fail checks, damage them dynamically by setting a damage number.`;

    const systemPrompt = `You are a world-class AI Dungeon Master for a premium text-based dark-fantasy D&D game.
Your task is to generate the next segment of the adventure based on the player's profile and choice actions.

You MUST respond strictly with a valid JSON object matching this schema structure:
{
  "title": "Scene Name",
  "text": "A vivid 3-4 sentence paragraph highlighting visual sights, smells, ambient noises, and the outcome of actions.",
  "visualType": "hearth" | "arcane" | "battle",
  "damage": 0, // Optional integer if they get hurt or fall into traps
  "loot": null | { "id": "unique_id", "name": "Ancient Shield", "desc": "Adds +2 to Strength", "type": "weapon", "statBonus": { "strength": 2 } },
  "choices": [
    { "text": "Take standard route" },
    { 
      "text": "Try something risky", 
      "check": { "stat": "strength" | "dexterity" | "constitution" | "intelligence" | "wisdom" | "charisma", "difficulty": 12 } 
    }
  ]
}`;

    const payload = {
      contents: [{ parts: [{ text: userQuery }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            title: { type: "STRING" },
            text: { type: "STRING" },
            visualType: { type: "STRING", enum: ["hearth", "arcane", "battle"] },
            damage: { type: "INTEGER" },
            loot: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                name: { type: "STRING" },
                desc: { type: "STRING" },
                type: { type: "STRING", enum: ["potion", "weapon"] },
                value: { type: "INTEGER" },
                statBonus: {
                  type: "OBJECT",
                  properties: {
                    strength: { type: "INTEGER" },
                    dexterity: { type: "INTEGER" },
                    constitution: { type: "INTEGER" },
                    intelligence: { type: "INTEGER" },
                    wisdom: { type: "INTEGER" },
                    charisma: { type: "INTEGER" }
                  }
                }
              },
              required: ["id", "name", "desc", "type"]
            },
            choices: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  text: { type: "STRING" },
                  combatStart: { type: "BOOLEAN" },
                  check: {
                    type: "OBJECT",
                    properties: {
                      stat: { type: "STRING", enum: ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"] },
                      difficulty: { type: "INTEGER" }
                    },
                    required: ["stat", "difficulty"]
                  }
                },
                required: ["text"]
              }
            }
          },
          required: ["title", "text", "visualType", "choices"]
        }
      },
      systemInstruction: { parts: [{ text: systemPrompt }] }
    };

    const activeKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || "";
    
    if (!activeKey) {
      setIsAiLoading(false);
      setApiError("API Key is missing. Please provide a key in the lobby or configure your environment file (.env).");
      return;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${activeKey}`;

    let delay = 1000;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(`API Connection Failed: ${response.status} - ${errText}`);
        }

        const result = await response.json();
        const rawJsonText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        const parsedNode = JSON.parse(rawJsonText);

        triggerShake();

        // Apply health hazards if generated
        if (parsedNode.damage) {
          setHp(prev => Math.max(1, prev - parsedNode.damage));
          playSoundEffect('fail');
        }

        // Apply item gains
        if (parsedNode.loot) {
          setInventory(prev => {
            if (prev.some(item => item.id === parsedNode.loot.id)) return prev;
            return [...prev, parsedNode.loot];
          });
          playSoundEffect('success');
        }

        setCurrentAiNode(parsedNode);
        setJournal(prev => [...prev, { title: parsedNode.title, text: parsedNode.text }]);
        setIsAiLoading(false);
        return;

      } catch (err) {
        console.warn(`Attempt ${attempt + 1} failed. Retrying...`, err);
        if (attempt === 2) {
          setApiError(err.message || "Failed to contact Gemini API. Please verify your connection or API key.");
        } else {
          await new Promise(r => setTimeout(r, delay));
          delay *= 2;
        }
      }
    }

    setIsAiLoading(false);
  };

  /**
   * Build player entity for party system from current character state
   */
  const buildPlayerEntity = (currentHp, currentMana) => {
    const cls = CLASSES[selectedClass];
    let dexBonus = 0;
    inventory.forEach(item => {
      if (item.equipped && item.statBonus && item.statBonus.dexterity) dexBonus += item.statBonus.dexterity;
    });
    return {
      id: 'player',
      name: cls.name,
      class: selectedClass,
      isPlayer: true,
      emoji: '⚔️',
      colorClass: 'amber',
      hp: currentHp,
      maxHp: maxHp,
      mana: currentMana,
      maxMana: maxMana,
      ac: getClassAC(selectedClass),
      stats: charStats,
      faction: 'party',
      statusEffects: [],
    };
  };

  /**
   * Initialize party combat: build party array, enemy group, roll initiative for all, sort.
   */
  const initializePartyCombat = (enemyGroupKey = 'shadow_hound_pack') => {
    // Build party
    const playerEntity = buildPlayerEntity(hp, mana);
    const companions = DEFAULT_COMPANIONS.map(c => ({
      ...c,
      hp: c.maxHp,
      mana: c.maxMana,
      faction: 'party',
      statusEffects: [],
    }));
    const fullParty = [playerEntity, ...companions];

    // Build enemy group
    const enemyGroup = (ENEMY_GROUPS[enemyGroupKey] || ENEMY_GROUPS.shadow_hound_pack).map(e => ({
      ...e,
      faction: 'enemy',
      statusEffects: [],
    }));

    // Roll initiative: 1d20 + DEX mod for every combatant
    const allCombatants = [
      ...fullParty.map(m => ({
        ...m,
        initiativeRoll: Math.floor(Math.random() * 20) + 1,
        dexMod: getDexMod(m),
      })),
      ...enemyGroup.map(e => ({
        ...e,
        initiativeRoll: Math.floor(Math.random() * 20) + 1,
        dexMod: getDexMod(e),
      }))
    ].map(c => ({
      ...c,
      initiative: c.initiativeRoll + c.dexMod,
    })).sort((a, b) => b.initiative - a.initiative || b.dexMod - a.dexMod);

    setParty(fullParty);
    setEnemies(enemyGroup);
    setInitiativeOrder(allCombatants);
    setActiveInitiativeIndex(0);
    setSelectedTargetId(null);
    setCompanionActing(false);

    // Log the initiative rolls
    const initLog = allCombatants.map(c =>
      `🎲 ${c.name}: rolled ${c.initiativeRoll} + DEX(${c.dexMod >= 0 ? '+' : ''}${c.dexMod}) = ${c.initiative}`
    );
    setCombatLog([
      `📋 Initiative Order Determined!`,
      ...initLog,
      `\n⚔️ ${allCombatants[0].name} acts first!`
    ]);

    return { party: fullParty, enemies: enemyGroup, order: allCombatants };
  };

  const handleChoice = (choice) => {
    playSoundEffect('click');
    if (choice.check) {
      setActiveCheck({ ...choice.check, text: choice.text });
      setGameState('check-pending');
      setRolledValue(20);
      setRollResultMsg('');
    } else if (choice.combatStart) {
      setGameState('combat');
      setCombatPhase('initiative-setup');
      setCombatLog([]);
      // Use enemyGroup from choice, fallback to shadow_hound_pack
      const groupKey = choice.enemyGroup || (campaignMode === 'ai' ? 'shadow_hound_pack' : 'shadow_hound_pack');
      // Store post-combat destination node
      if (choice.nextNode) {
        setPostCombatNode(choice.nextNode);
      }
      const { order } = initializePartyCombat(groupKey);
      // After a short delay, begin the first turn
      setTimeout(() => {
        startTurnForIndex(0, order);
      }, 1200);
    } else {
      if (campaignMode === 'ai') {
        fetchNextAiNode(choice.text);
      } else {
        advanceStory(choice.nextNode);
      }
    }
  };

  /**
   * Start the turn for the combatant at `index` in `order`.
   * If player → set phase to 'select-action'
   * If companion → auto-execute companion AI
   * If enemy → execute enemy attack
   */
  const startTurnForIndex = (index, order) => {
    const safeOrder = order || initiativeOrderRef.current;
    if (!safeOrder || safeOrder.length === 0) return;

    // Skip dead combatants
    let nextIndex = index % safeOrder.length;
    let loopCount = 0;
    while (safeOrder[nextIndex] && safeOrder[nextIndex].hp <= 0) {
      nextIndex = (nextIndex + 1) % safeOrder.length;
      loopCount++;
      if (loopCount > safeOrder.length) {
        // All combatants dead — should not happen, but bail
        return;
      }
    }

    setActiveInitiativeIndex(nextIndex);
    const current = safeOrder[nextIndex];
    if (!current) return;

    if (current.statusEffects?.includes('poisoned')) {
      const poisonDmg = 3;
      const newHp = Math.max(0, current.hp - poisonDmg);
      
      if (current.faction === 'party') {
        const updatedParty = partyRef.current.map(m => m.id === current.id ? { ...m, hp: newHp } : m);
        setParty(updatedParty);
        if (current.isPlayer) setHp(newHp);
      } else {
        const updatedEnemies = enemiesRef.current.map(e => e.id === current.id ? { ...e, hp: newHp } : e);
        setEnemies(updatedEnemies);
      }
      
      current.hp = newHp;
      setCombatLog(prev => [`☠️ Poison DoT: ${current.name} takes ${poisonDmg} poison damage.`, ...prev]);
      spawnDamagePopup(poisonDmg.toString(), current.faction === 'party' ? 'player' : 'enemy', 'damage');
      playSoundEffect('fail');

      if (newHp <= 0) {
        setCombatLog(prev => [`💀 ${current.name} has succumbed to poison!`, ...prev]);
        setTimeout(() => {
          advanceInitiative(nextIndex, safeOrder);
        }, 1200);
        return;
      }
    }

    if (current.faction === 'party') {
      if (current.isPlayer) {
        setCombatPhase('select-action');
        setCombatRollDetails(`Your turn! Select a combat command.`);
        setCompanionActing(false);
      } else {
        // Companion AI turn
        setCompanionActing(true);
        setCombatPhase('companion-acting');
        setCombatRollDetails(`${current.name} is taking their turn...`);
        setTimeout(() => {
          executeCompanionTurn(current, nextIndex, safeOrder);
        }, 800);
      }
    } else {
      // Enemy turn
      setCompanionActing(true);
      setCombatPhase('enemy-wait');
      setTimeout(() => {
        executeEnemyGroupTurn(current, nextIndex, safeOrder);
      }, 700);
    }
  };

  /**
   * Advance to the next combatant's turn.
   */
  const advanceInitiative = (currentIndex, currentOrder) => {
    const safeOrder = currentOrder || initiativeOrderRef.current;
    const nextRaw = (currentIndex + 1) % safeOrder.length;

    // Check victory: all enemies dead
    const currentEnemies = enemiesRef.current;
    if (currentEnemies.every(e => e.hp <= 0)) {
      resolvePartyVictory();
      return;
    }

    // Check defeat: player + all companions dead
    const currentParty = partyRef.current;
    if (currentParty.every(m => m.hp <= 0)) {
      resolvePartyDefeat();
      return;
    }

    // Find next alive combatant
    let nextIndex = nextRaw;
    let loops = 0;
    while (safeOrder[nextIndex] && safeOrder[nextIndex].hp <= 0) {
      nextIndex = (nextIndex + 1) % safeOrder.length;
      loops++;
      if (loops > safeOrder.length) return;
    }

    setActiveInitiativeIndex(nextIndex);

    // Sync initiative order hp from live party/enemies refs
    const updatedOrder = safeOrder.map(entry => {
      if (entry.faction === 'party') {
        const liveParty = partyRef.current.find(m => m.id === entry.id);
        return liveParty ? { ...entry, hp: liveParty.hp, mana: liveParty.mana, statusEffects: liveParty.statusEffects } : entry;
      } else {
        const liveEnemy = enemiesRef.current.find(e => e.id === entry.id);
        return liveEnemy ? { ...entry, hp: liveEnemy.hp, statusEffects: liveEnemy.statusEffects } : entry;
      }
    });
    setInitiativeOrder(updatedOrder);

    startTurnForIndex(nextIndex, updatedOrder);
  };

  /**
   * Execute an AI companion's turn.
   */
  const executeCompanionTurn = (companion, idx, currentOrder) => {
    const currentEnemies = enemiesRef.current;
    const currentParty = partyRef.current;

    // Find alive enemies
    const aliveEnemies = currentEnemies.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0) {
      advanceInitiative(idx, currentOrder);
      return;
    }

    let logMsg = '';
    let updatedEnemies = [...currentEnemies];
    let updatedParty = [...currentParty];
    let didAction = false;

    // Attack: target lowest HP enemy
    const target = aliveEnemies.reduce((lowest, e) => e.hp < lowest.hp ? e : lowest, aliveEnemies[0]);

    // 1. Lyra (Support behavior)
    if (companion.id === 'lyra') {
      const woundedAlly = currentParty.find(m => m.hp > 0 && m.hp / m.maxHp < 0.50 && m.id !== companion.id);
      const healAbility = companion.abilities.find(a => a.type === 'heal');
      const sacredFlame = companion.abilities.find(a => a.id === 'sacred_flame');

      if (woundedAlly && healAbility && companion.mana >= healAbility.manaCost) {
        // Cast Healing Word
        const healAmt = rollDiceNotation(healAbility.healAmount);
        const newHp = Math.min(woundedAlly.maxHp, woundedAlly.hp + healAmt);
        
        updatedParty = updatedParty.map(m => {
          if (m.id === woundedAlly.id) return { ...m, hp: newHp };
          if (m.id === companion.id) return { ...m, mana: Math.max(0, m.mana - healAbility.manaCost) };
          return m;
        });
        
        if (woundedAlly.isPlayer) setHp(newHp);

        logMsg = `💚 Lyra Dawnveil casts Healing Word on ${woundedAlly.name}, restoring ${healAmt} HP!`;
        setActiveFlashEffect('green');
        setTimeout(() => setActiveFlashEffect(''), 500);
        playSoundEffect('success');
        spawnDamagePopup(`+${healAmt}`, woundedAlly.isPlayer ? 'player' : 'companion', 'heal');
        
        setParty(updatedParty);
        setCombatLog(prev => [logMsg, ...prev]);
        didAction = true;
      } else if (sacredFlame && companion.mana >= sacredFlame.manaCost && Math.random() < 0.5) {
        // Cast Sacred Flame (auto-hits)
        const dmg = rollDiceNotation(sacredFlame.damage);
        const newHp = Math.max(0, target.hp - dmg);
        
        updatedParty = updatedParty.map(m => m.id === companion.id ? { ...m, mana: Math.max(0, m.mana - sacredFlame.manaCost) } : m);
        updatedEnemies = currentEnemies.map(e => e.id === target.id ? { ...e, hp: newHp } : e);
        
        logMsg = `🔥 Lyra Dawnveil casts Sacred Flame! Radiant fire descends on ${target.name} for ${dmg} holy damage!`;
        setActiveFlashEffect('purple');
        setTimeout(() => setActiveFlashEffect(''), 500);
        playSoundEffect('magic');
        spawnDamagePopup(dmg.toString(), 'enemy', 'damage');
        
        setParty(updatedParty);
        setEnemies(updatedEnemies);
        setCombatLog(prev => [logMsg, ...prev]);
        didAction = true;

        if (updatedEnemies.every(e => e.hp <= 0)) {
          setTimeout(() => resolvePartyVictory(), 1000);
          return;
        }
      }
    }

    // 2. Kael (Arcane Trickster / Rogue)
    if (companion.id === 'kael' && !didAction) {
      const sneakAttack = companion.abilities.find(a => a.id === 'sneak_attack');
      const poisonBlade = companion.abilities.find(a => a.id === 'poison_blade');
      
      const useSneak = sneakAttack && companion.mana >= sneakAttack.manaCost && Math.random() < 0.4;
      const usePoison = poisonBlade && !target.statusEffects?.includes('poisoned') && Math.random() < 0.5;

      if (useSneak) {
        // Sneak Attack: attack roll with extra damage
        const attackRoll = Math.floor(Math.random() * 20) + 1;
        const totalAttack = attackRoll + companion.attackMod;
        const isCrit = attackRoll === 20;
        const isMiss = attackRoll === 1;
        const hit = isCrit || (!isMiss && totalAttack >= target.ac);

        updatedParty = updatedParty.map(m => m.id === companion.id ? { ...m, mana: Math.max(0, m.mana - sneakAttack.manaCost) } : m);

        if (hit) {
          let dmg = rollDiceNotation(sneakAttack.damage);
          if (isCrit) dmg *= 2;
          const newHp = Math.max(0, target.hp - dmg);
          updatedEnemies = currentEnemies.map(e => e.id === target.id ? { ...e, hp: newHp } : e);
          
          logMsg = isCrit
            ? `🗡️ CRIT! Kael Thornblade strikes from the shadows — SNEAK ATTACK on ${target.name} for ${dmg} damage!`
            : `🗡️ Kael Thornblade strikes from shadows — SNEAK ATTACK on ${target.name} for ${dmg} damage! (${totalAttack} vs AC ${target.ac})`;
          
          playSoundEffect('hit');
          setActiveCombatEffect('shake-monster');
          setTimeout(() => setActiveCombatEffect(''), 400);
          spawnDamagePopup(dmg.toString(), 'enemy', isCrit ? 'crit' : 'damage');
          
          setEnemies(updatedEnemies);
        } else {
          logMsg = `💨 Kael Thornblade attempts a Sneak Attack on ${target.name} but MISSES!`;
          playSoundEffect('fail');
        }

        setParty(updatedParty);
        setCombatLog(prev => [logMsg, ...prev]);
        didAction = true;

        if (hit && updatedEnemies.every(e => e.hp <= 0)) {
          setTimeout(() => resolvePartyVictory(), 1000);
          return;
        }
      } else if (usePoison) {
        // Poison Blade
        const attackRoll = Math.floor(Math.random() * 20) + 1;
        const totalAttack = attackRoll + companion.attackMod;
        const isCrit = attackRoll === 20;
        const isMiss = attackRoll === 1;
        const hit = isCrit || (!isMiss && totalAttack >= target.ac);

        if (hit) {
          let dmg = rollDiceNotation(poisonBlade.damage);
          if (isCrit) dmg *= 2;
          const newHp = Math.max(0, target.hp - dmg);
          
          updatedEnemies = currentEnemies.map(e => {
            if (e.id === target.id) {
              const currentFX = e.statusEffects || [];
              const nextFX = currentFX.includes('poisoned') ? currentFX : [...currentFX, 'poisoned'];
              return { ...e, hp: newHp, statusEffects: nextFX };
            }
            return e;
          });

          logMsg = `☠️ Kael Thornblade uses Poison Blade on ${target.name}! Deals ${dmg} damage and inflicts POISONED!`;
          playSoundEffect('hit');
          setActiveCombatEffect('shake-monster');
          setTimeout(() => setActiveCombatEffect(''), 400);
          spawnDamagePopup(dmg.toString(), 'enemy', isCrit ? 'crit' : 'damage');
          
          setEnemies(updatedEnemies);
        } else {
          logMsg = `💨 Kael Thornblade attempts to poison ${target.name} but misses.`;
          playSoundEffect('fail');
        }

        setCombatLog(prev => [logMsg, ...prev]);
        didAction = true;

        if (hit && updatedEnemies.every(e => e.hp <= 0)) {
          setTimeout(() => resolvePartyVictory(), 1000);
          return;
        }
      }
    }

    // 3. Vorn (Barbarian)
    if (companion.id === 'vorn' && !didAction) {
      const isRaging = companion.statusEffects?.includes('raging');
      const rageStrike = companion.abilities.find(a => a.id === 'rage_strike');

      if (!isRaging && Math.random() < 0.50) {
        // Enter Rage!
        updatedParty = updatedParty.map(m => {
          if (m.id === companion.id) {
            const currentFX = m.statusEffects || [];
            return { ...m, statusEffects: [...currentFX, 'raging'] };
          }
          return m;
        });

        logMsg = `🔥 Vorn Ashmantle enters a BERSERKER RAGE! Halves incoming damage and powers up attacks!`;
        setActiveFlashEffect('red');
        setTimeout(() => setActiveFlashEffect(''), 500);
        playSoundEffect('success');
        
        setParty(updatedParty);
        setCombatLog(prev => [logMsg, ...prev]);
        didAction = true;
      } else if (isRaging && rageStrike && Math.random() < 0.5) {
        // Rage Strike
        const attackRoll = Math.floor(Math.random() * 20) + 1;
        const totalAttack = attackRoll + companion.attackMod;
        const isCrit = attackRoll === 20;
        const isMiss = attackRoll === 1;
        const hit = isCrit || (!isMiss && totalAttack >= target.ac);

        if (hit) {
          let dmg = rollDiceNotation(rageStrike.damage);
          if (isCrit) dmg *= 2;
          const newHp = Math.max(0, target.hp - dmg);
          updatedEnemies = currentEnemies.map(e => e.id === target.id ? { ...e, hp: newHp } : e);

          logMsg = isCrit
            ? `💥 CRIT! Vorn Ashmantle unleashes a furious Rage Strike on ${target.name} for ${dmg} damage!`
            : `💥 Vorn Ashmantle strikes with absolute fury — RAGE STRIKE on ${target.name} for ${dmg} damage!`;
          
          playSoundEffect('hit');
          setActiveCombatEffect('shake-monster');
          setTimeout(() => setActiveCombatEffect(''), 400);
          spawnDamagePopup(dmg.toString(), 'enemy', isCrit ? 'crit' : 'damage');

          setEnemies(updatedEnemies);
        } else {
          logMsg = `💨 Vorn Ashmantle swings his greataxe in rage but misses ${target.name}.`;
          playSoundEffect('fail');
        }

        setCombatLog(prev => [logMsg, ...prev]);
        didAction = true;

        if (hit && updatedEnemies.every(e => e.hp <= 0)) {
          setTimeout(() => resolvePartyVictory(), 1000);
          return;
        }
      }
    }

    if (!didAction) {
      // Basic Attack fallback
      const attackRoll = Math.floor(Math.random() * 20) + 1;
      const totalAttack = attackRoll + companion.attackMod;
      const isCrit = attackRoll === 20;
      const isMiss = attackRoll === 1;
      const hit = isCrit || (!isMiss && totalAttack >= target.ac);

      if (hit) {
        let dmg = rollDiceNotation(companion.attackDamage);
        if (isCrit) dmg *= 2;
        const newHp = Math.max(0, target.hp - dmg);
        updatedEnemies = currentEnemies.map(e => e.id === target.id ? { ...e, hp: newHp } : e);

        logMsg = isCrit
          ? `🔥 CRIT! ${companion.name} rolls 20 — CRITICAL HIT on ${target.name} for ${dmg} damage!`
          : `⚔️ ${companion.name} rolls ${attackRoll}+${companion.attackMod}=${totalAttack} vs AC ${target.ac} — HIT! Deals ${dmg} damage to ${target.name}.`;

        playSoundEffect('hit');
        setActiveCombatEffect('shake-monster');
        setTimeout(() => setActiveCombatEffect(''), 400);
        spawnDamagePopup(dmg.toString(), 'enemy', isCrit ? 'crit' : 'damage');

        setEnemies(updatedEnemies);
        setCombatLog(prev => [logMsg, ...prev]);

        if (updatedEnemies.every(e => e.hp <= 0)) {
          setTimeout(() => resolvePartyVictory(), 1000);
          return;
        }
      } else {
        logMsg = isMiss
          ? `❌ ${companion.name} rolled a natural 1 — CRITICAL MISS! Their strike goes wide.`
          : `💨 ${companion.name} rolled ${attackRoll}+${companion.attackMod}=${totalAttack} vs AC ${target.ac} — MISS!`;
        playSoundEffect('fail');
        setCombatLog(prev => [logMsg, ...prev]);
      }
    }

    setTimeout(() => advanceInitiative(idx, currentOrder), 1400);
  };

  /**
   * Execute an enemy's turn — picks a random living party member to attack.
   */
  const executeEnemyGroupTurn = (enemy, idx, currentOrder) => {
    const currentParty = partyRef.current;
    const aliveParty = currentParty.filter(m => m.hp > 0);

    if (aliveParty.length === 0) {
      resolvePartyDefeat();
      return;
    }

    setCombatPhase('enemy-roll');
    setCombatRollDetails(`${enemy.name} attacks...`);

    // Pick random alive party member
    const target = aliveParty[Math.floor(Math.random() * aliveParty.length)];

    const attackRoll = Math.floor(Math.random() * 20) + 1;
    const totalAttack = attackRoll + enemy.attackMod;
    const isCrit = attackRoll === 20;
    const isMiss = attackRoll === 1;
    const hit = isCrit || (!isMiss && totalAttack >= target.ac);

    setIsEnemyAttacking(true);
    setTimeout(() => setIsEnemyAttacking(false), 350);

    let updatedParty = [...currentParty];
    let logMsg = '';

    if (hit) {
      let dmg = rollDiceNotation(enemy.damage);
      if (isCrit) dmg *= 2;

      // Apply rage damage reduction for barbarian companion
      if (target.id === 'vorn' && target.statusEffects?.includes('raging')) {
        dmg = Math.ceil(dmg / 2);
      }

      const newHp = Math.max(0, target.hp - dmg);
      updatedParty = currentParty.map(m => m.id === target.id ? { ...m, hp: newHp } : m);

      // If attacking player, also update main hp state
      if (target.isPlayer) {
        setHp(newHp);
      }

      logMsg = isCrit
        ? `💀 CRIT! ${enemy.name} rolled ${attackRoll} — CRITICAL HIT on ${target.name} for ${dmg} damage!`
        : `💥 ${enemy.name} rolled ${attackRoll}+${enemy.attackMod}=${totalAttack} vs AC ${target.ac} — HIT! ${target.name} takes ${dmg} damage.`;

      playSoundEffect('fail');
      setActiveFlashEffect('red');
      setTimeout(() => setActiveFlashEffect(''), 500);
      triggerShake();
      spawnDamagePopup(dmg.toString(), target.isPlayer ? 'player' : 'companion', isCrit ? 'crit' : 'damage');

      setParty(updatedParty);
      setCombatLog(prev => [logMsg, ...prev]);

      // Check full party defeat
      if (updatedParty.every(m => m.hp <= 0)) {
        setTimeout(() => resolvePartyDefeat(), 1200);
        return;
      }
    } else {
      logMsg = isMiss
        ? `😅 ${enemy.name} rolled a 1 — CRITICAL MISS! Its attack swiped empty air.`
        : `💨 ${enemy.name} rolled ${attackRoll}+${enemy.attackMod}=${totalAttack} vs AC ${target.ac} — MISS!`;
      playSoundEffect('success');
      setCombatLog(prev => [logMsg, ...prev]);
    }

    setTimeout(() => {
      setCombatPhase('enemy-resolve');
      setTimeout(() => advanceInitiative(idx, currentOrder), 700);
    }, 1200);
  };

  /**
   * Victory: all enemies defeated
   */
  const resolvePartyVictory = () => {
    setTimeout(() => {
      playSoundEffect('success');
      setCombatPhase('victory');
      setCombatBuffs({ battleCry: false, rage: false, huntersMarkActive: false, bardDebuff: false, enemyStunned: false });
      setCompanionActing(false);
      if (campaignMode === 'ai') {
        setGameState('active');
        const aliveCompanions = partyRef.current.filter(m => !m.isPlayer && m.hp > 0).map(m => m.name);
        fetchNextAiNode(`Victory! The party defeated all enemies. Surviving companions: ${aliveCompanions.join(', ')}. Survey surroundings and check for loot.`);
      } else {
        setGameState('active');
        // Route to the postCombatNode (set when combat started) or fallback
        const victoryNodeKey = postCombatNode || 'act1_hound_victory';
        advanceStory(victoryNodeKey);
      }
    }, 1000);
  };

  /**
   * Defeat: player + all companions dead
   */
  const resolvePartyDefeat = () => {
    setTimeout(() => {
      setCombatPhase('defeat');
      setCombatBuffs({ battleCry: false, rage: false, huntersMarkActive: false, bardDebuff: false, enemyStunned: false });
      setCompanionActing(false);
      if (campaignMode === 'ai') {
        setGameState('active');
        fetchNextAiNode(`The party was defeated. Describe a narrow escape or dramatic collapse.`);
      } else {
        setGameState('active');
        advanceStory('vault_fail');
      }
    }, 1800);
  };

  const handleCustomActionSubmit = (e) => {
    e.preventDefault();
    if (!customAction.trim() || isAiLoading) return;
    playSoundEffect('click');
    const userActionText = customAction;
    setCustomAction('');
    fetchNextAiNode(`User typed action: ${userActionText}`);
  };

  const advanceStory = (nodeKey) => {
    const node = STORY_NODES[nodeKey];
    if (!node) { console.warn(`Story node not found: ${nodeKey}`); return; }
    
    triggerShake();
    
    if (node.damage) {
      setHp(prev => Math.max(1, prev - node.damage));
      playSoundEffect('fail');
    }

    // Healing nodes (camp / rest)
    if (node.heal) {
      setHp(prev => Math.min(maxHp, prev + node.heal));
      playSoundEffect('success');
    }

    if (node.loot) {
      setInventory(prev => {
        if (prev.some(item => item.id === node.loot.id)) return prev;
        return [...prev, node.loot];
      });
      if (!node.damage) playSoundEffect('success');
    }

    setCurrentNodeKey(nodeKey);
    setJournal(prev => [...prev, { title: node.title, text: node.text, act: node.act, actLabel: node.actLabel, companionDialogue: node.companionDialogue }]);
    
    // Endings trigger epilogue screen
    const endingNodes = ['ending_scholar', 'ending_guardian', 'ending_sacrifice'];
    if (endingNodes.includes(nodeKey)) {
      setGameState('epilogue');
    } else {
      setGameState('active');
    }
  };

  const triggerShake = () => {
    setShakeScreen(true);
    setTimeout(() => setShakeScreen(false), 500);
  };

  const handleDiceRoll = () => {
    if (diceRolling || !activeCheck) return;
    
    setDiceRolling(true);
    let counter = 0;
    const interval = setInterval(() => {
      playSoundEffect('dice');
      setRolledValue(Math.floor(Math.random() * 20) + 1);
      counter++;
      if (counter > 12) {
        clearInterval(interval);
        
        const finalRoll = Math.floor(Math.random() * 20) + 1;
        setRolledValue(finalRoll);
        
        let bonusFromEquipment = 0;
        inventory.forEach(item => {
          if (item.equipped && item.statBonus && item.statBonus[activeCheck.stat]) {
            bonusFromEquipment += item.statBonus[activeCheck.stat];
          }
        });

        const statScore = charStats[activeCheck.stat] + bonusFromEquipment;
        const modifier = Math.floor((statScore - 10) / 2);
        const total = finalRoll + modifier;
        const passed = total >= activeCheck.difficulty;
        
        setRollSuccess(passed);
        
        let resultMsg = `Rolled ${finalRoll} + (${modifier >= 0 ? '+' : ''}${modifier}) mod = ${total}. `;
        if (finalRoll === 20) {
          resultMsg += "NATURAL 20! Critical Success!";
          playSoundEffect('success');
        } else if (finalRoll === 1) {
          resultMsg += "NATURAL 1! Critical Fumble!";
          playSoundEffect('fail');
        } else if (passed) {
          resultMsg += `Passed! (DC ${activeCheck.difficulty})`;
          playSoundEffect('success');
        } else {
          resultMsg += `Failed! (DC ${activeCheck.difficulty})`;
          playSoundEffect('fail');
        }
        
        setRollResultMsg(resultMsg);
        setDiceRolling(false);

        // Auto resolve after 2.5 seconds
        setTimeout(() => {
          autoResolveCheck(passed, finalRoll, modifier, total);
        }, 2500);
      }
    }, 70);
  };

  const autoResolveCheck = (passed, rollValue, modifierValue, totalValue) => {
    if (!activeCheckRef.current) return;
    
    const checkObj = activeCheckRef.current;
    setActiveCheck(null);
    setRollResultMsg('');
    
    if (campaignMode === 'ai') {
      const parentAction = checkObj.text || "risky path action";
      const rollDetails = `Rolled a total of ${totalValue} (Base: ${rollValue}, Mod: ${modifierValue >= 0 ? '+' : ''}${modifierValue}) against DC ${checkObj.difficulty} for check: "${parentAction}".`;
      fetchNextAiNode(parentAction, passed, rollDetails);
      setGameState('active');
    } else {
      const nextNode = passed ? checkObj.successNode : checkObj.failNode;
      advanceStory(nextNode);
    }
  };

  const resolveCheck = () => {
    if (!activeCheck) return;
    playSoundEffect('click');
    
    const checkObj = activeCheck;
    setActiveCheck(null);
    setRollResultMsg('');
    
    let bonusFromEquipment = 0;
    inventory.forEach(item => {
      if (item.equipped && item.statBonus && item.statBonus[checkObj.stat]) {
        bonusFromEquipment += item.statBonus[checkObj.stat];
      }
    });

    const statScore = charStats[checkObj.stat] + bonusFromEquipment;
    const modifier = Math.floor((statScore - 10) / 2);
    const total = rolledValue + modifier;

    if (campaignMode === 'ai') {
      const parentAction = checkObj.text || "risky path action";
      const rollDetails = `Rolled a total of ${total} (Base: ${rolledValue}, Mod: ${modifier >= 0 ? '+' : ''}${modifier}) against DC ${checkObj.difficulty} for check: "${parentAction}".`;
      fetchNextAiNode(parentAction, rollSuccess, rollDetails);
      setGameState('active');
    } else {
      const nextNode = rollSuccess ? checkObj.successNode : checkObj.failNode;
      advanceStory(nextNode);
    }
  };

  const useInventoryItem = (item) => {
    playSoundEffect('click');
    if (item.type === 'potion') {
      const healAmt = item.value;
      setHp(prev => Math.min(maxHp, prev + healAmt));
      setInventory(prev => prev.filter(i => i.id !== item.id));
      playSoundEffect('success');
      
      // visual green flash and heal popup
      setActiveFlashEffect('green');
      setTimeout(() => setActiveFlashEffect(''), 550);
      spawnDamagePopup(`+${healAmt}`, 'player', 'heal');
      
      if (gameState === 'combat') {
        setCombatLog(prev => [`🧪 Consumed ${item.name} and healed for ${healAmt} HP.`, ...prev]);
      }
    } else if (item.type === 'weapon') {
      setInventory(prev => prev.map(i => {
        if (i.id === item.id) {
          return { ...i, equipped: !i.equipped };
        }
        if (i.type === 'weapon' && !item.equipped) {
          return { ...i, equipped: false };
        }
        return i;
      }));
    }
  };

  const spawnDamagePopup = (text, target, type = 'damage') => {
    const id = Math.random().toString();
    let color = 'text-red-500 font-bold';
    let textVal = text.toString();
    if (!textVal.startsWith('-') && !textVal.startsWith('+') && !isNaN(textVal)) {
      textVal = `-${textVal}`;
    }
    
    if (target === 'enemy') {
      if (type === 'crit') color = 'text-yellow-400 font-black text-2xl drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      else if (type === 'miss') { color = 'text-stone-400 font-medium italic'; textVal = text; }
      else color = 'text-purple-400 font-extrabold';
    } else {
      if (type === 'heal') color = 'text-emerald-400 font-bold text-lg';
      else if (type === 'dodge') { color = 'text-teal-300 font-semibold italic'; textVal = text; }
      else if (type === 'miss') { color = 'text-stone-400 font-medium italic'; textVal = text; }
      else color = 'text-red-500 font-bold';
    }
    
    const newPopup = {
      id,
      text: textVal,
      color: `${color} shadow-black/85`
    };
    setDamagePopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 900);
  };



  const executeCombatAction = (action) => {
    if (hp <= 0 || diceRolling || companionActing) return;

    // Resolve which enemy to attack
    const aliveEnemies = enemiesRef.current.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0) { resolvePartyVictory(); return; }

    // Pick target: selectedTargetId or auto-target lowest HP
    const targetEnemy = aliveEnemies.find(e => e.id === selectedTargetId) ||
                        aliveEnemies.reduce((lowest, e) => e.hp < lowest.hp ? e : lowest, aliveEnemies[0]);

    // Helper to apply damage to a target enemy and sync state
    const applyDamageToEnemy = (targetId, dmg) => {
      setEnemies(prev => prev.map(e => e.id === targetId ? { ...e, hp: Math.max(0, e.hp - dmg) } : e));
    };

    const currentInitIdx = activeInitiativeIndexRef.current;
    const afterPlayerTurn = () => {
      setTimeout(() => advanceInitiative(currentInitIdx, initiativeOrderRef.current), 1800);
    };

    // kept for legacy compat (not used in new party combat but referenced in reset)
    const enemyHpCompat = enemiesRef.current.reduce((sum, e) => sum + e.hp, 0);

    let strBonus = 0, intBonus = 0, dexBonus = 0, wisBonus = 0, chaBonus = 0;
    inventory.forEach(item => {
      if (item.equipped && item.statBonus) {
        if (item.statBonus.strength) strBonus += item.statBonus.strength;
        if (item.statBonus.intelligence) intBonus += item.statBonus.intelligence;
        if (item.statBonus.dexterity) dexBonus += item.statBonus.dexterity;
        if (item.statBonus.wisdom) wisBonus += item.statBonus.wisdom;
        if (item.statBonus.charisma) chaBonus += item.statBonus.charisma;
      }
    });

    const strMod = Math.floor(((charStats.strength + strBonus) - 10) / 2);
    const intMod = Math.floor(((charStats.intelligence + intBonus) - 10) / 2);
    const dexMod = Math.floor(((charStats.dexterity + dexBonus) - 10) / 2);
    const wisMod = Math.floor(((charStats.wisdom + wisBonus) - 10) / 2);
    const chaMod = Math.floor(((charStats.charisma + chaBonus) - 10) / 2);

    const modMap = { strength: strMod, intelligence: intMod, dexterity: dexMod, wisdom: wisMod, charisma: chaMod };

    if (action === 'strike') {
      setCombatPhase('player-roll');
      setCombatDiceType('attack');
      const keyStat = getClassKeyStat(selectedClass);
      const statMod = modMap[keyStat];
      const attackMod = statMod + 3;
      setCombatRollDetails(`Strike: 1d20 + ${keyStat.substring(0,3).toUpperCase()}(+${statMod}) + Prof(+3) vs AC ${targetEnemy.ac}`);
      setCombatRollDC(targetEnemy.ac);
      let counter = 0;
      const interval = setInterval(() => {
        playSoundEffect('dice');
        setRolledValue(Math.floor(Math.random() * 20) + 1);
        counter++;
        if (counter > 10) {
          clearInterval(interval);
          const roll = Math.floor(Math.random() * 20) + 1;
          setRolledValue(roll);
          const totalAttack = roll + attackMod;
          let hit = totalAttack >= targetEnemy.ac;
          if (roll === 20) hit = true;
          if (roll === 1) hit = false;
          setCombatPhase('player-resolve');
          if (hit) {
            playSoundEffect('hit');
            setIsPlayerAttacking(true);
            setTimeout(() => setIsPlayerAttacking(false), 350);
            const isCrit = roll === 20;
            const damageNotation = getClassWeaponDamage(selectedClass);
            let dmg = rollDice(damageNotation).total + statMod;
            if (combatBuffs.battleCry) { dmg += 5; setCombatBuffs(prev => ({ ...prev, battleCry: false })); }
            if (combatBuffs.rage) { dmg += statMod; setCombatBuffs(prev => ({ ...prev, rage: false })); }
            if (combatBuffs.huntersMarkActive) { dmg += Math.floor(Math.random() * 6) + 1; setCombatBuffs(prev => ({ ...prev, huntersMarkActive: false })); }
            if (isCrit) dmg += rollDice(damageNotation).total;
            dmg = Math.max(1, dmg);
            setActiveCombatEffect('shake-monster');
            setTimeout(() => setActiveCombatEffect(''), 550);
            spawnDamagePopup(dmg.toString(), 'enemy', isCrit ? 'crit' : 'damage');
            const hitMsg = isCrit
              ? `🔥 CRIT! You rolled 20! Strike on ${targetEnemy.name} for ${dmg} damage!`
              : `⚔️ Rolled ${roll}+${attackMod}=${totalAttack} vs AC ${targetEnemy.ac} — HIT on ${targetEnemy.name}! ${dmg} damage.`;
            setCombatLog(prev => [hitMsg, ...prev]);
            applyDamageToEnemy(targetEnemy.id, dmg);
          } else {
            playSoundEffect('fail');
            spawnDamagePopup('MISS!', 'enemy', 'miss');
            const missMsg = roll === 1
              ? `❌ CRIT MISS! Your strike goes wildly wide of ${targetEnemy.name}.`
              : `⚔️ Rolled ${roll}+${attackMod}=${totalAttack} vs AC ${targetEnemy.ac} — MISS on ${targetEnemy.name}!`;
            setCombatLog(prev => [missMsg, ...prev]);
          }
          afterPlayerTurn();
        }
      }, 75);
      
    } else if (action === 'class_ability') {
      const ability = CLASS_ABILITIES[selectedClass];
      const cost = ability.manaCost;
      if (cost > 0 && mana < cost) {
        playSoundEffect('fail');
        setCombatLog(prev => [`⚠️ Not enough mana for ${ability.name}! (Need ${cost} MP)`, ...prev]);
        return;
      }
      if (cost > 0) setMana(prev => Math.max(0, prev - cost));
      if (selectedClass === 'warrior' || selectedClass === 'barbarian' || selectedClass === 'ranger') {
        playSoundEffect('magic');
        setActiveFlashEffect('purple');
        setTimeout(() => setActiveFlashEffect(''), 500);
        let logMsg = '';
        if (selectedClass === 'warrior') { setCombatBuffs(prev => ({ ...prev, battleCry: true })); logMsg = `⚔️ BATTLE CRY! Your next physical attack gains +5 damage!`; }
        else if (selectedClass === 'barbarian') { setCombatBuffs(prev => ({ ...prev, rage: true })); logMsg = `🔥 BERSERKER RAGE! Incoming damage halved, next attack boosted!`; }
        else if (selectedClass === 'ranger') { setCombatBuffs(prev => ({ ...prev, huntersMarkActive: true })); logMsg = `🎯 HUNTER'S MARK on ${targetEnemy.name}! Your next attack deals +1d6 bonus damage.`; }
        setCombatLog(prev => [logMsg, ...prev]);
        setCombatPhase('player-resolve');
        setCombatRollDetails(`Ability Activated: ${ability.name}`);
        afterPlayerTurn();
      } else {
        setCombatPhase('player-roll');
        setCombatDiceType('attack');
        const keyStat = getClassKeyStat(selectedClass);
        const statMod = modMap[keyStat];
        const attackMod = statMod + 3;
        setCombatRollDetails(`Spell (${ability.name}): 1d20+${keyStat.substring(0,3).toUpperCase()}(+${statMod})+Prof(+3) vs AC ${targetEnemy.ac}`);
        setCombatRollDC(targetEnemy.ac);
        let counter = 0;
        const interval = setInterval(() => {
          playSoundEffect('dice');
          setRolledValue(Math.floor(Math.random() * 20) + 1);
          counter++;
          if (counter > 10) {
            clearInterval(interval);
            const roll = Math.floor(Math.random() * 20) + 1;
            setRolledValue(roll);
            const totalAttack = roll + attackMod;
            const isCrit = roll === 20;
            let hit = totalAttack >= targetEnemy.ac;
            if (roll === 20) hit = true;
            if (roll === 1) hit = false;
            setCombatPhase('player-resolve');
            if (hit) {
              playSoundEffect('magic');
              setActiveFlashEffect('purple');
              setTimeout(() => setActiveFlashEffect(''), 550);
              let dmg = 0; let logMsg = '';
              if (selectedClass === 'mage') { dmg = rollDice('3d6').total + statMod; logMsg = `✨ ARCANE SURGE on ${targetEnemy.name}! ${totalAttack} vs AC ${targetEnemy.ac} — HIT! ${dmg} arcane dmg.`; }
              else if (selectedClass === 'rogue') { dmg = rollDice('2d6').total + statMod; logMsg = `🗡️ SNEAK ATTACK on ${targetEnemy.name}! ${totalAttack} vs AC ${targetEnemy.ac} — HIT! ${dmg} sneak dmg.`; }
              else if (selectedClass === 'paladin') { dmg = rollDice('3d8').total + statMod; setHp(prev => Math.min(maxHp, prev + 8)); spawnDamagePopup('+8', 'player', 'heal'); logMsg = `✝️ DIVINE SMITE on ${targetEnemy.name}! ${dmg} radiant dmg + 8 HP restored.`; }
              else if (selectedClass === 'cleric') { dmg = rollDice('2d8').total + statMod; logMsg = `🔥 SACRED FLAME on ${targetEnemy.name}! ${dmg} radiant dmg.`; }
              else if (selectedClass === 'bard') { dmg = rollDice('1d8').total + statMod; setCombatBuffs(prev => ({ ...prev, bardDebuff: true })); logMsg = `🎵 VICIOUS MOCKERY on ${targetEnemy.name}! ${dmg} psychic dmg, foe weakened.`; }
              else if (selectedClass === 'druid') { dmg = rollDice('2d6').total + statMod; logMsg = `🌿 THORN WHIP on ${targetEnemy.name}! ${dmg} nature dmg.`; }
              else if (selectedClass === 'monk') { dmg = rollDice('1d8').total + statMod; const stun = Math.random() < 0.45; if (stun) setCombatBuffs(prev => ({ ...prev, enemyStunned: true })); logMsg = `👊 STUNNING STRIKE on ${targetEnemy.name}! ${dmg} dmg${stun ? ' — STUNNED!' : '.'}`; }
              else if (selectedClass === 'sorcerer') { dmg = rollDice('2d8').total + statMod; const ele = ['fire','frost','lightning','acid'][Math.floor(Math.random()*4)]; logMsg = `⚡ CHAOS BOLT (${ele}) on ${targetEnemy.name}! ${dmg} elemental dmg.`; }
              else if (selectedClass === 'warlock') { dmg = rollDice('2d10').total + statMod; logMsg = `🌑 ELDRITCH BLAST on ${targetEnemy.name}! ${dmg} necrotic dmg.`; }
              if (isCrit) dmg = dmg * 2;
              setActiveCombatEffect('shake-monster');
              setTimeout(() => setActiveCombatEffect(''), 500);
              spawnDamagePopup(dmg.toString(), 'enemy', isCrit ? 'crit' : 'damage');
              setCombatLog(prev => [isCrit ? `🔥 CRIT! ${logMsg}` : logMsg, ...prev]);
              applyDamageToEnemy(targetEnemy.id, dmg);
            } else {
              playSoundEffect('fail');
              spawnDamagePopup('MISS!', 'enemy', 'miss');
              const missMsg = roll === 1 ? `❌ Spell fizzled! Natural 1.` : `✨ Rolled ${totalAttack} vs AC ${targetEnemy.ac} — MISS on ${targetEnemy.name}!`;
              setCombatLog(prev => [missMsg, ...prev]);
            }
            afterPlayerTurn();
          }
        }, 75);
      }
      
    } else if (action === 'dodge') {
      setCombatPhase('player-roll');
      setCombatDiceType('dodge');
      const aliveEnemiesList = enemiesRef.current.filter(e => e.hp > 0);
      const avgAtk = aliveEnemiesList.length > 0 ? Math.round(aliveEnemiesList.reduce((s,e)=>s+e.attackMod,0)/aliveEnemiesList.length) : 4;
      const dodgeDC = 10 + avgAtk;
      setCombatRollDetails(`Tactical Dodge: 1d20 + DEX(+${dexMod}) vs DC ${dodgeDC}`);
      setCombatRollDC(dodgeDC);
      let counter = 0;
      const interval = setInterval(() => {
        playSoundEffect('dice');
        setRolledValue(Math.floor(Math.random() * 20) + 1);
        counter++;
        if (counter > 10) {
          clearInterval(interval);
          const roll = Math.floor(Math.random() * 20) + 1;
          setRolledValue(roll);
          const total = roll + dexMod;
          const passed = total >= dodgeDC;
          setCombatPhase('player-resolve');
          playSoundEffect(passed ? 'success' : 'fail');
          const logMsg = passed
            ? `💨 Dodge: Rolled ${roll}+${dexMod}=${total} vs DC ${dodgeDC} — SUCCESS! You brace to evade the next incoming strike.`
            : `⚠️ Dodge: Rolled ${roll}+${dexMod}=${total} vs DC ${dodgeDC} — FAILED! You stumbled.`;
          setCombatLog(prev => [logMsg, ...prev]);
          afterPlayerTurn();
        }
      }, 75);
    }
  };

  const resetGame = () => {
    playSoundEffect('click');
    handleClassChange('warrior');
    setGameState('character-select');
    setJournal([]);
    setCurrentNodeKey('intro_camp_chat');
    setCurrentAiNode(null);
    setApiError(null);
    setCombatBuffs({ battleCry: false, rage: false, huntersMarkActive: false, bardDebuff: false, enemyStunned: false });
  };

  useEffect(() => {
    if (textEndRef.current) {
      textEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [journal, gameState, isAiLoading]);

  const currentNode = campaignMode === 'ai' ? currentAiNode : STORY_NODES[currentNodeKey];

  return (
    <div className={`min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between font-serif relative overflow-hidden select-none ${shakeScreen ? 'animate-shake-screen' : ''}`}>
      <style>{STYLE_INJECTION}</style>

      {/* Full-Screen Visual Flash Overlays */}
      {activeFlashEffect === 'red' && <div className="absolute inset-0 bg-red-600/25 mix-blend-overlay pointer-events-none z-50 animate-red-flash" />}
      {activeFlashEffect === 'green' && <div className="absolute inset-0 bg-emerald-600/20 mix-blend-overlay pointer-events-none z-50 animate-green-flash" />}
      {activeFlashEffect === 'purple' && <div className="absolute inset-0 bg-indigo-600/20 mix-blend-overlay pointer-events-none z-50 animate-purple-flash" />}

      {/* Environment-Aware Ambient Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden scene-transition">
        {/* Dynamic ambient glow based on visualType */}
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[130px] transition-colors duration-1000"
          style={{
            background: currentNode?.visualType === 'arcane'
              ? 'rgba(88, 28, 135, 0.2)'
              : currentNode?.visualType === 'battle'
                ? 'rgba(127, 29, 29, 0.2)'
                : 'rgba(120, 53, 15, 0.2)'
          }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[130px] transition-colors duration-1000"
          style={{
            background: currentNode?.visualType === 'arcane'
              ? 'rgba(67, 56, 202, 0.25)'
              : currentNode?.visualType === 'battle'
                ? 'rgba(153, 27, 27, 0.2)'
                : 'rgba(88, 28, 135, 0.15)'
          }} />

        {/* Floating embers — color shifts with environment */}
        <div className="absolute bottom-0 left-[15%] w-1.5 h-1.5 rounded-full animate-float opacity-0 transition-colors duration-700" style={{ animationDelay: '0.1s', animationDuration: '4.2s', background: currentNode?.visualType === 'arcane' ? '#a78bfa' : currentNode?.visualType === 'battle' ? '#f87171' : '#f59e0b' }} />
        <div className="absolute bottom-0 left-[38%] w-2 h-2 rounded-full animate-float opacity-0 transition-colors duration-700" style={{ animationDelay: '1.4s', animationDuration: '5.6s', background: currentNode?.visualType === 'arcane' ? '#818cf8' : currentNode?.visualType === 'battle' ? '#ef4444' : '#d97706' }} />
        <div className="absolute bottom-0 left-[64%] w-1 h-1 rounded-full animate-float opacity-0 transition-colors duration-700" style={{ animationDelay: '0.8s', animationDuration: '3.9s', background: currentNode?.visualType === 'arcane' ? '#c4b5fd' : currentNode?.visualType === 'battle' ? '#dc2626' : '#ef4444' }} />
        <div className="absolute bottom-0 left-[83%] w-2.5 h-2.5 rounded-full animate-float opacity-0 transition-colors duration-700" style={{ animationDelay: '2.8s', animationDuration: '6.2s', background: currentNode?.visualType === 'arcane' ? '#8b5cf6' : currentNode?.visualType === 'battle' ? '#b91c1c' : '#fbbf24' }} />
      </div>

      {/* Header Bar */}
      <header className="border-b border-amber-900/30 bg-stone-900/80 backdrop-blur-md px-6 py-4 flex justify-between items-center z-10 shrink-0">
        <div className="flex items-center gap-3">
          <BookOpen className="text-amber-500 w-6 h-6 animate-pulse" />
          <div>
            <h1 className="text-xl font-bold tracking-wider text-amber-500 uppercase font-sans">Eldritch Ascent</h1>
            <p className="text-xs text-stone-400 tracking-widest uppercase font-sans">Interactive Tabletop Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleMuteToggle} 
            className={`p-2 rounded border transition-all bg-stone-950/60 ${isMuted ? 'border-stone-800 text-stone-500 hover:text-stone-300' : 'border-amber-900/50 text-amber-500 hover:text-amber-400'}`}
            title={isMuted ? "Unmute sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          
          {gameState !== 'character-select' && (
            <button 
              onClick={resetGame}
              className="flex items-center gap-2 text-xs font-sans px-3 py-1.5 rounded border border-red-950 bg-red-950/30 text-red-300 hover:bg-red-900/40 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retreat
            </button>
          )}
        </div>
      </header>

      {/* Player Character Status HUD bar */}
      {gameState !== 'character-select' && (
        <div className="w-full bg-stone-900/50 border-b border-amber-900/20 px-6 py-3 flex flex-wrap justify-between items-center gap-4 z-10 font-sans shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
              <User className="w-4 h-4 text-amber-500" />
              <span className="font-semibold text-stone-200">{CLASSES[selectedClass].name}</span>
            </div>

            <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
              <Heart className={`w-4 h-4 ${hp < maxHp / 3 ? 'text-red-500 animate-bounce' : 'text-red-500 fill-red-900'}`} />
              <div className="w-24 bg-stone-800 h-2 rounded overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-red-600 to-red-500 h-full transition-all duration-300"
                  style={{ width: `${(hp / maxHp) * 100}%` }}
                />
              </div>
              <span className="text-xs text-stone-300 font-bold">{hp}/{maxHp}</span>
            </div>

            <div className="flex items-center gap-2 bg-stone-950/80 px-3 py-1.5 rounded border border-stone-800">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <div className="w-20 bg-stone-800 h-2 rounded overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 h-full transition-all duration-300"
                  style={{ width: `${(mana / maxMana) * 100}%` }}
                />
              </div>
              <span className="text-xs text-stone-300 font-bold">{mana}/{maxMana}</span>
            </div>
          </div>

          {/* D&D Stats panel */}
          <div className="flex gap-4 overflow-x-auto">
            {Object.entries(charStats).map(([stat, val]) => {
              let extraBonus = 0;
              inventory.forEach(item => {
                if (item.equipped && item.statBonus && item.statBonus[stat]) {
                  extraBonus += item.statBonus[stat];
                }
              });
              const finalStat = val + extraBonus;
              const modifier = Math.floor((finalStat - 10) / 2);
              return (
                <div key={stat} className="flex flex-col items-center bg-stone-950/60 border border-stone-800/80 px-2.5 py-1 rounded w-14 flex-shrink-0">
                  <span className="text-[10px] uppercase text-stone-400 tracking-wider font-semibold">{stat.substring(0,3)}</span>
                  <span className={`text-sm font-bold ${extraBonus > 0 ? 'text-emerald-400' : 'text-amber-500'}`}>{finalStat}</span>
                  <span className="text-[10px] text-stone-500">({modifier >= 0 ? '+' : ''}{modifier})</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Container Grid */}
      <main className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-6 gap-6 z-10 overflow-hidden">
        
        {/* CHARACTER CREATOR PANEL */}
        {gameState === 'character-select' && (
          <div className="w-full flex flex-col lg:flex-row gap-6 animate-ink-bleed">
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="mb-4">
                <span className="text-amber-500 font-sans tracking-widest text-xs font-bold uppercase">Begin Your Chronicle</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-stone-100 font-serif leading-tight mt-1">Select Your Paragon</h2>
                <p className="text-stone-400 mt-2 text-sm md:text-base font-sans">Choose your class and customize your narrative mode parameters below.</p>
              </div>

              {/* Campaign Mode Selection */}
              <div className="bg-stone-900/60 border border-stone-800 p-4 rounded-lg mb-4">
                <p className="text-xs text-amber-500 font-bold uppercase tracking-wider mb-3">Narrative Pathing Mode</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setCampaignMode('static')}
                    className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${campaignMode === 'static' ? 'border-amber-500 bg-amber-950/10' : 'border-stone-800 bg-stone-950/40 hover:bg-stone-900/40'}`}
                  >
                    <span className="block font-bold text-sm text-stone-200">The High Pass Prologue</span>
                    <span className="block text-xs text-stone-400 mt-1">Play the hand-crafted, beautifully paced prologue module through the ancient crypt.</span>
                  </button>
                  <button 
                    onClick={() => setCampaignMode('ai')}
                    className={`p-4 rounded-lg border text-left transition-all cursor-pointer ${campaignMode === 'ai' ? 'border-purple-500 bg-purple-950/10' : 'border-stone-800 bg-stone-950/40 hover:bg-stone-900/40'}`}
                  >
                    <span className="block font-bold text-sm text-purple-400 flex items-center gap-1.5">
                      <Sparkle className="w-4 h-4 text-purple-400 animate-pulse" />
                      Gemini Infinite Dungeon Master
                    </span>
                    <span className="block text-xs text-stone-400 mt-1">Connect directly with AI models to experience dynamic infinite story generation.</span>
                  </button>
                </div>

                {/* API Key configuration when using AI Mode */}
                {campaignMode === 'ai' && (
                  <div className="mt-4 border-t border-stone-800 pt-4 animate-ink-bleed">
                    <label className="block text-xs text-stone-400 mb-1.5 font-sans">
                      Dungeon Master API Key (Optional; Leave blank to use auto-injected runtime key)
                    </label>
                    <input 
                      type="password" 
                      placeholder="AI DM Key (Optional)" 
                      value={apiKey} 
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full bg-stone-950 border border-stone-800 rounded px-3 py-2 text-xs text-stone-300 font-sans focus:outline-none focus:border-purple-600"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {Object.entries(CLASSES).map(([key, data]) => {
                  const IconComp = data.icon;
                  const isSelected = selectedClass === key;
                  return (
                    <button
                      key={key}
                      onClick={() => handleClassChange(key)}
                      className={`relative text-left p-5 rounded-lg border transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer ${
                        isSelected 
                          ? 'border-amber-600 bg-stone-905/90 shadow-lg shadow-amber-950/20 scale-[1.02]' 
                          : 'border-stone-800 bg-stone-950/40 hover:border-stone-700 hover:bg-stone-900/30'
                      }`}
                    >
                      {isSelected && (
                        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent blur-xl pointer-events-none" />
                      )}

                      <div className="flex items-center gap-3 mb-4">
                        <div className={`p-2 rounded-lg bg-stone-900 border ${isSelected ? 'border-amber-600/40 text-amber-500' : 'border-stone-800 text-stone-500 group-hover:text-stone-400'}`}>
                          <IconComp className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold text-lg font-sans text-stone-200">{data.name}</h3>
                      </div>

                      <p className="text-xs text-stone-400 font-sans mb-6 line-clamp-3 leading-relaxed">{data.desc}</p>

                      <div className="border-t border-stone-800/80 pt-3 flex justify-between items-center text-xs font-sans">
                        <span className="text-stone-500">Starting HP:</span>
                        <span className="font-bold text-stone-300">{data.hp}</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button 
                onClick={startGame}
                disabled={isAiLoading}
                className={`mt-6 w-full py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-stone-950 font-sans uppercase font-extrabold tracking-widest rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isAiLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isAiLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Forging Backstory...
                  </>
                ) : (
                  <>
                    Assemble Adventure Gear & Enter the Pass
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Sidebar Details Card */}
            <div className="lg:w-96 bg-stone-900/90 border border-stone-800 p-6 rounded-xl flex flex-col justify-between shadow-2xl relative">
              <div>
                <div className="flex items-center gap-2 text-amber-500 text-xs font-sans tracking-widest uppercase font-bold mb-4 border-b border-stone-800 pb-3">
                  <Shield className="w-4 h-4" />
                  <span>Stats & Inventory Packs</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6 font-sans">
                  {Object.entries(charStats).map(([stat, val]) => {
                    const mod = Math.floor((val - 10) / 2);
                    return (
                      <div key={stat} className="bg-stone-950/60 p-3 rounded border border-stone-800/80 flex justify-between items-center">
                        <div>
                          <p className="text-[10px] text-stone-500 uppercase tracking-widest">{stat}</p>
                          <p className="text-lg font-extrabold text-stone-200">{val}</p>
                        </div>
                        <span className="text-xs font-bold text-amber-500 bg-amber-950/40 border border-amber-900/40 px-2 py-1 rounded">
                          {mod >= 0 ? '+' : ''}{mod}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <p className="text-xs text-amber-500 uppercase font-sans font-bold tracking-widest mb-3">Gear Pack</p>
                <div className="space-y-2">
                  {inventory.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-stone-950/40 px-3 py-2 rounded text-xs text-stone-300 font-sans border border-stone-800/50">
                      <span className="flex items-center gap-2">
                        <Scroll className="w-3.5 h-3.5 text-amber-700" />
                        <span>{item.name}</span>
                      </span>
                      {item.equipped && (
                        <span className="text-[10px] font-sans font-semibold bg-emerald-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded uppercase">Equipped</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 bg-stone-950/80 p-3 rounded border border-stone-800 text-[11px] text-stone-500 font-sans leading-relaxed">
                * Dynamic modifiers automatically add bonus success factors during active skill checks.
              </div>
            </div>
          </div>
        )}

        {/* ACTIVE ADVENTURE STAGE */}
        {gameState !== 'character-select' && (
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            
            {/* Story display and text logs */}
            <div className="flex-1 flex flex-col bg-stone-900/35 border border-stone-800/60 rounded-xl overflow-hidden shadow-2xl relative min-h-[400px]">
              
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentNode?.visualType === 'arcane' ? 'from-purple-600 via-indigo-600 to-amber-600 animate-pulse' : 'from-amber-600 via-red-600 to-stone-900'}`} />

              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-parchment flex flex-col justify-start relative">
                
                {gameState === 'combat' ? (
                  /* COMBAT VIEW MODE */
                  <div className="space-y-6 animate-ink-bleed">
                    <div className="text-center space-y-2">
                      <span className="text-xs font-sans font-bold tracking-widest text-red-500 uppercase flex items-center justify-center gap-1">
                        <ShieldAlert className="w-4 h-4 animate-pulse" /> Combat Encounters — Party vs Enemies
                      </span>
                      <h3 className="text-2xl font-bold text-stone-100 uppercase tracking-wider font-sans">
                        {enemies.length > 0 ? enemies.map(e => e.name).join(' + ') : 'Battle!'}
                      </h3>
                      {(combatPhase !== 'initiative-setup') && (
                        <p className="text-[10px] text-stone-500 font-sans uppercase tracking-widest">
                          {combatPhase === 'select-action'
                            ? '⚔️ YOUR TURN — Choose an action below'
                            : combatPhase === 'companion-acting'
                              ? `🤝 ${initiativeOrder[activeInitiativeIndex]?.name ?? 'Companion'}'s Turn — Acting...`
                              : combatPhase.startsWith('enemy')
                                ? `👹 Enemy's Action`
                                : combatPhase === 'initiative-setup'
                                  ? '🎲 Rolling Initiative...'
                                  : `Phase: ${combatPhase}`
                          }
                        </p>
                      )}
                    </div>

                    {/* Initiative Tracker */}
                    {initiativeOrder.length > 0 && (
                      <InitiativeTracker
                        initiativeOrder={initiativeOrder}
                        activeIndex={activeInitiativeIndex}
                      />
                    )}

                    {/* Main Combat Arena: Party | Log | Enemies */}
                    <div className="flex gap-3 min-h-[280px]">

                      {/* Party Panel (left) */}
                      {party.length > 0 && (
                        <div className="flex-shrink-0">
                          <PartyPanel
                            party={party}
                            activeEntityId={initiativeOrder[activeInitiativeIndex]?.id}
                          />
                        </div>
                      )}

                      {/* Center: damage popups + combat log */}
                      <div className="flex-1 flex flex-col gap-3 min-w-0">
                        {/* Damage Popups */}
                        <div className="relative h-10 overflow-visible">
                          <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
                            {damagePopups.map((pop) => (
                              <div key={pop.id} className={`text-xl font-sans animate-damage absolute ${pop.color}`}>
                                {pop.text}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Phase status banner */}
                        {(combatPhase === 'initiative-setup' || combatPhase === 'companion-acting') && (
                          <div className="bg-stone-950/80 border border-amber-900/40 rounded-lg px-4 py-3 text-center">
                            <p className="text-xs text-amber-400 font-sans animate-pulse">
                              {combatPhase === 'initiative-setup' ? '🎲 Rolling initiative for all combatants...' : `⏳ ${initiativeOrder[activeInitiativeIndex]?.name ?? 'Companion'} is acting...`}
                            </p>
                          </div>
                        )}

                        {/* Combat Log */}
                        <div className="flex-1 bg-stone-900/60 rounded border border-stone-800 p-4 overflow-y-auto scrollbar-parchment font-sans text-xs space-y-2">
                          {combatLog.length === 0 && (
                            <p className="text-stone-600 italic text-center">Combat begins...</p>
                          )}
                          {combatLog.map((log, index) => (
                            <p key={index} className={`text-stone-300 leading-relaxed border-l-2 pl-2 ${
                              log.startsWith('🎲') || log.startsWith('📋') ? 'border-amber-600/70 text-amber-200 font-semibold' :
                              log.startsWith('⚔️') ? 'border-amber-600/70 text-amber-200' :
                              log.startsWith('💥') || log.startsWith('💀') ? 'border-red-800/80 text-red-300' :
                              log.startsWith('💚') ? 'border-green-700/70 text-green-300' :
                              log.startsWith('✨') || log.startsWith('🔮') || log.startsWith('⚡') ? 'border-purple-700/60 text-purple-200' :
                              log.startsWith('🔥') ? 'border-orange-700/60 text-orange-300' :
                              'border-purple-800/40'
                            }`}>
                              {log}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Enemy Panel (right) */}
                      {enemies.length > 0 && (
                        <div className={`flex-shrink-0 rounded-xl transition-all duration-300 ${
                          combatPhase === 'select-action'
                            ? 'ring-2 ring-yellow-500/40 shadow-lg shadow-yellow-950/30 p-1'
                            : 'p-1'
                        }`}>
                          {combatPhase === 'select-action' && (
                            <p className="text-[9px] font-sans font-bold text-yellow-400 tracking-widest uppercase text-center mb-1 animate-pulse">
                              👆 Click to Target
                            </p>
                          )}
                          <EnemyPanel
                            enemies={enemies}
                            activeEntityId={initiativeOrder[activeInitiativeIndex]?.id}
                            selectedTargetId={selectedTargetId}
                            isPlayerTurn={combatPhase === 'select-action'}
                            onSelectTarget={setSelectedTargetId}
                          />
                        </div>
                      )}
                    </div>

                    {/* Active buff indicators */}
                    {(combatBuffs.battleCry || combatBuffs.rage || combatBuffs.huntersMarkActive || combatBuffs.bardDebuff || combatBuffs.enemyStunned) && (
                      <div className="flex flex-wrap gap-2 mb-1">
                        {combatBuffs.battleCry && (
                          <span className="text-[10px] font-sans font-bold bg-amber-950/60 text-amber-400 border border-amber-700/40 px-2 py-0.5 rounded-full animate-pulse">⚔️ Battle Cry Active — next strike +5 dmg</span>
                        )}
                        {combatBuffs.rage && (
                          <span className="text-[10px] font-sans font-bold bg-red-950/60 text-red-400 border border-red-700/40 px-2 py-0.5 rounded-full animate-pulse">🔥 Raging — damage halved &amp; strike boosted</span>
                        )}
                        {combatBuffs.huntersMarkActive && (
                          <span className="text-[10px] font-sans font-bold bg-green-950/60 text-green-400 border border-green-700/40 px-2 py-0.5 rounded-full animate-pulse">🎯 Hunter's Mark — next strike +1d6</span>
                        )}
                        {combatBuffs.bardDebuff && (
                          <span className="text-[10px] font-sans font-bold bg-pink-950/60 text-pink-400 border border-pink-700/40 px-2 py-0.5 rounded-full animate-pulse">🎵 Enemy Mocked — foe hits weaker</span>
                        )}
                        {combatBuffs.enemyStunned && (
                          <span className="text-[10px] font-sans font-bold bg-cyan-950/60 text-cyan-400 border border-cyan-700/40 px-2 py-0.5 rounded-full animate-pulse">👊 Enemy Stunned — loses next action</span>
                        )}
                      </div>
                    )}

                    {/* Combat Commands Conditional Phase Render */}
                    {combatPhase === 'select-action' && (() => {
                      const aliveEnemies = enemies.filter(e => e.hp > 0);
                      const currentTarget = aliveEnemies.find(e => e.id === selectedTargetId);
                      const autoTarget = !currentTarget && aliveEnemies.length > 0
                        ? aliveEnemies.reduce((low, e) => e.hp < low.hp ? e : low, aliveEnemies[0])
                        : null;
                      return (
                        <div className="bg-stone-950/70 border border-stone-800/60 rounded-lg px-4 py-2 flex items-center justify-between gap-3">
                          <span className="text-[10px] font-sans text-stone-500 uppercase tracking-widest">Target</span>
                          {currentTarget ? (
                            <span className="flex items-center gap-1.5 text-xs font-sans font-bold text-yellow-300">
                              <span>{currentTarget.emoji}</span>
                              <span>{currentTarget.name}</span>
                              <span className="text-[9px] text-yellow-500/60">({currentTarget.hp}/{currentTarget.maxHp} HP)</span>
                              <button
                                onClick={() => setSelectedTargetId(null)}
                                className="ml-1 text-[9px] text-stone-500 hover:text-red-400 transition-colors cursor-pointer"
                                title="Clear target"
                              >✕</button>
                            </span>
                          ) : autoTarget ? (
                            <span className="flex items-center gap-1.5 text-xs font-sans text-stone-400 italic">
                              <span>{autoTarget.emoji}</span>
                              <span>{autoTarget.name}</span>
                              <span className="text-[9px] text-amber-600/70">(auto — lowest HP)</span>
                            </span>
                          ) : (
                            <span className="text-xs font-sans text-red-400 italic">No enemies remaining</span>
                          )}
                          <span className="text-[9px] text-stone-600 font-sans hidden sm:block">Click an enemy card →</span>
                        </div>
                      );
                    })()}
                    {combatPhase === 'select-action' ? (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button 
                          onClick={() => executeCombatAction('strike')}
                          className="p-3 bg-red-950/40 hover:bg-red-900/30 text-red-200 border border-red-900/60 rounded text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Sword className="w-4 h-4 text-red-400" /> Weapon Strike
                        </button>
                        {/* Class Signature Ability Button */}
                        {(() => {
                          const ability = CLASS_ABILITIES[selectedClass];
                          const canAfford = mana >= ability.manaCost;
                          const colorMap = {
                            amber:  { bg: 'bg-amber-950/40 hover:bg-amber-900/30',   border: 'border-amber-800/60',   text: 'text-amber-200',   icon: 'text-amber-400'   },
                            purple: { bg: 'bg-purple-950/40 hover:bg-purple-900/30', border: 'border-purple-800/60', text: 'text-purple-200', icon: 'text-purple-400' },
                            emerald:{ bg: 'bg-emerald-950/40 hover:bg-emerald-900/30',border: 'border-emerald-800/60',text: 'text-emerald-200',icon: 'text-emerald-400'},
                            yellow: { bg: 'bg-yellow-950/40 hover:bg-yellow-900/30', border: 'border-yellow-800/60', text: 'text-yellow-200', icon: 'text-yellow-400' },
                            green:  { bg: 'bg-green-950/40 hover:bg-green-900/30',   border: 'border-green-800/60',   text: 'text-green-200',   icon: 'text-green-400'   },
                            sky:    { bg: 'bg-sky-950/40 hover:bg-sky-900/30',       border: 'border-sky-800/60',     text: 'text-sky-200',     icon: 'text-sky-400'     },
                            pink:   { bg: 'bg-pink-950/40 hover:bg-pink-900/30',     border: 'border-pink-800/60',    text: 'text-pink-200',    icon: 'text-pink-400'    },
                            red:    { bg: 'bg-red-950/40 hover:bg-red-900/30',       border: 'border-red-800/60',     text: 'text-red-200',     icon: 'text-red-400'     },
                            lime:   { bg: 'bg-lime-950/40 hover:bg-lime-900/30',     border: 'border-lime-800/60',    text: 'text-lime-200',    icon: 'text-lime-400'    },
                            cyan:   { bg: 'bg-cyan-950/40 hover:bg-cyan-900/30',     border: 'border-cyan-800/60',    text: 'text-cyan-200',    icon: 'text-cyan-400'    },
                            violet: { bg: 'bg-violet-950/40 hover:bg-violet-900/30', border: 'border-violet-800/60', text: 'text-violet-200', icon: 'text-violet-400' },
                            slate:  { bg: 'bg-slate-800/40 hover:bg-slate-700/30',   border: 'border-slate-600/60',   text: 'text-slate-200',   icon: 'text-slate-300'   },
                          };
                          const c = colorMap[ability.color] || colorMap.purple;
                          return (
                            <button
                              onClick={() => executeCombatAction('class_ability')}
                              disabled={!canAfford}
                              title={ability.tooltip}
                              className={`p-3 ${canAfford ? c.bg : 'bg-stone-900/40 hover:bg-stone-900/40 opacity-50 cursor-not-allowed'} ${c.text} border ${canAfford ? c.border : 'border-stone-800'} rounded text-xs font-sans font-semibold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer relative group`}
                            >
                              <span className="flex items-center gap-1.5">
                                <Sparkles className={`w-3.5 h-3.5 ${canAfford ? c.icon : 'text-stone-600'}`} />
                                <span>{ability.icon} {ability.name}</span>
                              </span>
                              <span className={`text-[9px] font-sans ${canAfford ? 'text-stone-400' : 'text-stone-600'}`}>
                                {ability.manaCost === 0 ? 'Free · ' : `${ability.manaCost} MP · `}{ability.stat.substring(0,3).toUpperCase()} scaled
                              </span>
                              {/* Tooltip */}
                              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-stone-900 border border-stone-700 text-stone-300 text-[10px] font-sans p-2 rounded shadow-xl z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none leading-relaxed">
                                {ability.tooltip}
                              </span>
                            </button>
                          );
                        })()}
                        <button 
                          onClick={() => executeCombatAction('dodge')}
                          className="p-3 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 rounded text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-stone-400" /> Tactical Dodge
                        </button>
                      </div>
                    ) : (
                      /* DICE RESOLVING & TRANSITIONAL TEXT */
                      <div className="bg-stone-900/50 border border-stone-850 rounded p-4 text-center">
                        <p className="font-serif text-stone-400 italic animate-pulse text-sm">
                          {combatPhase === 'player-roll' && "Rolling attack dice..."}
                          {combatPhase === 'player-resolve' && "Resolving attack effect..."}
                          {combatPhase === 'enemy-wait' && `${initiativeOrder[activeInitiativeIndex]?.name || 'Enemy'} prepares to strike...`}
                          {combatPhase === 'enemy-roll' && `${initiativeOrder[activeInitiativeIndex]?.name || 'Enemy'} rolls attack dice...`}
                          {combatPhase === 'enemy-resolve' && `Resolving ${initiativeOrder[activeInitiativeIndex]?.name || 'Enemy'} attack...`}
                        </p>
                      </div>
                    )}

                  </div>
                ) : (
                  /* NARRATIVE SCENE READING AREA */
                  <>
                    {/* Scene Illustration — D&D 5e style environment art */}
                    {currentNode && (
                      <SceneIllustration visualType={currentNode.visualType || 'hearth'} />
                    )}

                    {journal.map((item, idx) => {
                      const isLast = idx === journal.length - 1;
                      // Show an Act banner when actLabel appears for the first time
                      const prevActLabel = idx > 0 ? journal[idx - 1].actLabel : null;
                      const showActBanner = item.actLabel && item.actLabel !== prevActLabel;
                      return (
                        <div key={idx}>
                          {showActBanner && (
                            <div className="flex items-center gap-3 py-3 my-2">
                              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
                              <span className="text-[9px] font-sans font-black tracking-[0.25em] uppercase text-amber-600/80 shrink-0">
                                {item.actLabel}
                              </span>
                              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-900/40 to-transparent" />
                            </div>
                          )}
                          <div className={`space-y-3 transition-opacity duration-500 ${isLast ? 'animate-ink-bleed' : 'opacity-40 hover:opacity-75 transition-opacity'}`}>
                            <h3 className="text-xs font-sans text-amber-500 tracking-widest uppercase font-bold flex items-center gap-2">
                              <Flame className="w-3.5 h-3.5" />
                              {item.title}
                            </h3>
                            <p className="text-stone-100 text-base md:text-lg leading-relaxed font-serif tracking-wide first-letter:text-3xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1">
                              {item.text}
                            </p>
                            
                            {item.companionDialogue && item.companionDialogue.length > 0 && (
                              <div className="mt-4 p-4 rounded-lg bg-stone-950/60 border border-amber-950/20 space-y-3">
                                <p className="text-[10px] font-sans tracking-wider text-amber-600/80 uppercase font-bold mb-1">Party Banter</p>
                                <div className="space-y-2">
                                  {item.companionDialogue.map((dialogue, dIdx) => (
                                    <div key={dIdx} className="text-sm font-sans flex items-start gap-2.5 leading-relaxed text-stone-300">
                                      <span className="text-base select-none shrink-0" role="img" aria-label={dialogue.speaker}>
                                        {dialogue.emoji}
                                      </span>
                                      <div>
                                        <span className="font-bold text-amber-500/90 mr-1.5">{dialogue.speaker}:</span>
                                        <span>{dialogue.text}</span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* AI Generation Loading Skeleton */}
                    {isAiLoading && (
                      <div className="space-y-4 animate-pulse pt-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-400 animate-spin" />
                          <div className="h-3.5 bg-purple-950/40 border border-purple-900/30 w-32 rounded"></div>
                        </div>
                        <div className="space-y-2">
                          <div className="h-4 bg-stone-800/80 w-full rounded"></div>
                          <div className="h-4 bg-stone-800/80 w-5/6 rounded"></div>
                          <div className="h-4 bg-stone-800/80 w-2/3 rounded"></div>
                        </div>
                      </div>
                    )}

                    {apiError && (
                      <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-lg text-red-200 text-xs font-sans space-y-2 animate-ink-bleed">
                        <div className="flex items-center gap-2 font-bold uppercase text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>AI DM Error</span>
                        </div>
                        <p>{apiError}</p>
                        <div className="flex gap-3">
                          <button 
                            onClick={startGame}
                            className="bg-red-900 hover:bg-red-800 text-red-100 px-3 py-1.5 rounded font-bold cursor-pointer transition-colors"
                          >
                            Retry Connection
                          </button>
                          <button 
                            onClick={() => {
                              setCampaignMode('static');
                              setGameState('active');
                              setCurrentNodeKey('intro_camp_chat');
                              setJournal([{ title: STORY_NODES.intro_camp_chat.title, text: STORY_NODES.intro_camp_chat.text, act: STORY_NODES.intro_camp_chat.act, actLabel: STORY_NODES.intro_camp_chat.actLabel, companionDialogue: STORY_NODES.intro_camp_chat.companionDialogue }]);
                              setApiError(null);
                            }}
                            className="text-stone-400 hover:text-stone-200 cursor-pointer"
                          >
                            Switch to Offline Prologue
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
                <div ref={textEndRef} />
              </div>

              {/* Action Panels */}
              {gameState !== 'combat' && !apiError && (
                <div className="p-4 md:p-6 border-t border-stone-800/60 bg-stone-900/50 backdrop-blur-sm z-10 shrink-0">
                  
                  {gameState === 'active' && !isAiLoading && (
                    <div className="space-y-4">
                      {/* AI DM: Support custom text choices */}
                      {campaignMode === 'ai' && (
                        <form onSubmit={handleCustomActionSubmit} className="flex gap-2 bg-stone-950 border border-stone-800 p-1.5 rounded-lg">
                          <input 
                            type="text" 
                            placeholder="Type any action... (e.g., 'Search the corners of the room for keys')" 
                            value={customAction} 
                            onChange={(e) => setCustomAction(e.target.value)}
                            className="flex-1 bg-transparent px-3 text-xs text-stone-200 font-sans focus:outline-none"
                          />
                          <button 
                            type="submit" 
                            className="bg-purple-900 hover:bg-purple-800 text-purple-100 p-2 rounded transition-colors cursor-pointer"
                            title="Perform custom action"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      )}

                      <p className="text-[10px] text-stone-500 font-sans tracking-widest uppercase mb-1">Select your path:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {currentNode?.choices?.map((choice, i) => {
                          const isCheck = !!choice.check;
                          return (
                            <button
                              key={i}
                              onClick={() => handleChoice(choice)}
                              className={`w-full text-left p-3.5 rounded bg-stone-900/80 border text-sm font-sans flex items-center justify-between transition-all group cursor-pointer ${
                                isCheck 
                                  ? 'border-purple-950/80 hover:border-purple-600 hover:bg-purple-950/20 text-purple-200' 
                                  : 'border-stone-800 hover:border-amber-700 hover:bg-amber-950/10 text-stone-300'
                              }`}
                            >
                              <span className="flex items-center gap-3">
                                {isCheck ? (
                                  <span className="bg-purple-900/60 text-purple-100 text-[10px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase border border-purple-500/30">
                                    {choice.check.stat.substring(0,3)} Check (DC {choice.check.difficulty})
                                  </span>
                                ) : (
                                  <span className="w-1.5 h-1.5 bg-amber-600 rounded-full group-hover:scale-125 transition-transform" />
                                )}
                                <span>{choice.text}</span>
                              </span>
                              <ChevronRight className="w-4 h-4 text-stone-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Dice Rolling Screen */}
                  {gameState === 'check-pending' && activeCheck && (
                    <div className="p-4 bg-stone-950/80 border border-purple-950/60 rounded-lg flex flex-col items-center justify-center space-y-4 animate-ink-bleed">
                      <div className="text-center space-y-1">
                        <span className="text-[11px] font-sans tracking-widest text-purple-400 font-bold uppercase">Critical Venture</span>
                        <h4 className="text-lg font-bold font-sans text-stone-200">
                          {activeCheck.stat.toUpperCase()} Check Required!
                        </h4>
                        <p className="text-xs font-sans text-stone-400">
                          Difficulty Class (DC): <span className="text-purple-400 font-bold">{activeCheck.difficulty}</span>
                        </p>
                      </div>

                      <div className="flex flex-col items-center justify-center p-3">
                        <button 
                          onClick={handleDiceRoll}
                          disabled={diceRolling}
                          className={`px-6 py-2.5 rounded-lg font-sans text-sm font-bold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer ${
                            diceRolling 
                              ? 'bg-purple-950/30 border border-purple-900/40 text-purple-400 cursor-not-allowed'
                              : 'bg-purple-900 hover:bg-purple-800 text-stone-100 border border-purple-500 shadow-lg shadow-purple-950/40 active:scale-95'
                          }`}
                        >
                          <Dice5 className={`w-5 h-5 ${diceRolling ? 'animate-spin' : ''}`} />
                          {diceRolling ? "Rolling..." : "Roll d20 Initiative"}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Game Epilogue Panel */}
                  {gameState === 'epilogue' && (
                    <div className="p-6 bg-stone-950/80 border border-amber-900/30 rounded-lg flex flex-col items-center justify-center text-center space-y-4 animate-ink-bleed">
                      <div className="relative">
                        <Award className="w-12 h-12 text-amber-500" />
                        <div className="absolute inset-0 w-12 h-12 bg-amber-500/20 rounded-full animate-ping" />
                      </div>
                      <div>
                        <p className="text-[10px] font-sans font-black tracking-[0.3em] uppercase text-amber-600/80 mb-1">Eldritch Ascent</p>
                        <h4 className="text-xl font-bold text-stone-100">Chronicle Complete!</h4>
                        <p className="text-xs text-stone-400 mt-2 max-w-md mx-auto leading-relaxed font-serif">
                          {currentNodeKey === 'ending_scholar' && 'The Eye of the Void is delivered to the scholars of Silverymoon. The vigil continues.'}
                          {currentNodeKey === 'ending_guardian' && 'You have chosen the Warden\'s path. The under-empire will not be left unguarded again.'}
                          {currentNodeKey === 'ending_sacrifice' && 'The Dreaming One dreams no more. The cost was absolute. The victory was complete.'}
                          {!['ending_scholar','ending_guardian','ending_sacrifice'].includes(currentNodeKey) && 'Your legend has been written in the stones of the High Pass.'}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-2 text-[10px] text-stone-600 font-sans">
                        <span>Acts completed: {Math.max(...journal.map(j => j.act || 1))} of 5</span>
                        <span>Scenes witnessed: {journal.length}</span>
                      </div>
                      <button 
                        onClick={resetGame}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-sans font-bold uppercase tracking-wider rounded transition-all text-xs cursor-pointer"
                      >
                        Begin a New Chronicle
                      </button>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* Sidebar Controls Panel (Dice Tower & Inventory) */}
            <div className="w-full md:w-80 flex flex-col gap-6 shrink-0">
              
              {/* Dynamic d20 Dice roller model */}
              <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col items-center justify-center shadow-2xl relative min-h-[220px]">
                <div className="absolute top-2 left-3 text-[10px] font-sans tracking-widest uppercase text-stone-500 flex items-center gap-1.5">
                  <Dice5 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Arcane d20 Die</span>
                </div>

                <div className={`absolute w-32 h-32 rounded-full border border-dashed transition-all duration-1000 flex items-center justify-center ${
                  gameState === 'check-pending' || (gameState === 'combat' && (combatPhase.includes('roll') || combatPhase.includes('resolve') || combatPhase === 'initiative-roll'))
                    ? 'border-purple-500/35 bg-purple-950/10 animate-spin-slow' 
                    : 'border-stone-800/80'
                }`}>
                  <div className="text-stone-950 opacity-10 text-6xl font-extrabold select-none">d20</div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center mt-3">
                  <div className={`w-28 h-28 flex items-center justify-center relative select-none cursor-pointer ${
                    diceRolling ? 'scale-110' : 'hover:scale-[1.03] transition-transform'
                  }`}
                  onClick={
                    gameState === 'check-pending' 
                      ? handleDiceRoll 
                      : (gameState === 'combat' && combatPhase === 'initiative-roll') 
                        ? rollCombatInitiative 
                        : undefined
                  }
                  >
                    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-2xl transition-transform duration-300 ${
                      diceRolling 
                        ? 'animate-spin text-purple-500' 
                        : gameState === 'combat' && combatPhase.startsWith('enemy')
                          ? 'text-purple-600'
                          : rolledValue === 20 
                            ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse' 
                            : rolledValue === 1 
                              ? 'text-red-500' 
                              : 'text-amber-500'
                    }`}>
                      <polygon points="50,5 90,30 90,70 50,95 10,70 10,30" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="1.5" />
                      <polygon points="50,5 50,95" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
                      <polygon points="10,30 90,30" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
                      <polygon points="10,70 90,70" stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.4" />
                      <polygon points="50,5 10,30 50,55 90,30" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
                      <polygon points="50,95 10,70 50,55 90,70" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1" />
                    </svg>

                    <span className={`absolute text-3xl font-extrabold tracking-tight z-20 ${
                      diceRolling 
                        ? 'text-purple-400 font-sans' 
                        : rolledValue === 20 
                          ? 'text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)] animate-pulse' 
                          : rolledValue === 1 
                            ? 'text-red-500' 
                            : 'text-stone-100'
                    }`}>
                      {rolledValue}
                    </span>
                  </div>

                  {rollResultMsg && gameState !== 'combat' && (
                    <div className="mt-4 text-center max-w-[240px] animate-ink-bleed">
                      <p className={`text-xs font-sans font-bold ${rollSuccess ? 'text-emerald-400' : 'text-red-400'}`}>
                        {rollSuccess ? 'SUCCESS' : 'FAILURE'}
                      </p>
                      <p className="text-[11px] font-sans text-stone-400 leading-relaxed mt-1">
                        {rollResultMsg}
                      </p>
                      <button 
                        onClick={resolveCheck}
                        className="mt-3 px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded border border-stone-700 text-xs font-sans font-medium transition-all cursor-pointer"
                      >
                        Advance narrative
                      </button>
                    </div>
                  )}

                  {!rollResultMsg && gameState === 'check-pending' && (
                    <p className="text-[10px] text-purple-400 font-sans animate-pulse mt-3 text-center">
                      * Stat check challenge active. Roll!
                    </p>
                  )}

                  {gameState === 'combat' && combatRollDetails && (
                    <div className="mt-3 text-center max-w-[240px] animate-ink-bleed">
                      <p className="text-[10px] text-purple-400 font-sans font-bold uppercase tracking-wider">
                        {combatPhase === 'initiative-roll' ? 'Initiative Roll' : combatPhase.startsWith('enemy') ? `${initiativeOrder[activeInitiativeIndex]?.name || 'Enemy'}'s Action` : 'Your Action'}
                      </p>
                      <p className="text-[11px] font-sans text-stone-400 leading-relaxed mt-1">
                        {combatRollDetails}
                      </p>
                      {rolledValue && (combatPhase.includes('resolve') || combatPhase === 'initiative-roll') && !diceRolling && (
                        <p className={`text-xs font-sans font-bold mt-1 ${rolledValue === 20 ? 'text-yellow-400 font-black animate-pulse' : rolledValue === 1 ? 'text-red-500' : 'text-stone-200'}`}>
                          Die roll: {rolledValue}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* D&D Mini-Map — Expedition Tracker */}
              <MiniMap
                journal={journal}
                currentTitle={currentNode?.title || ''}
              />

              {/* Character inventory screen */}
              <div className="bg-stone-900/40 border border-stone-800 rounded-xl p-5 flex flex-col shadow-2xl">
                <p className="text-xs text-amber-500 uppercase font-sans tracking-widest font-bold mb-3 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5" />
                  Your Backpack
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-parchment">
                  {inventory.length === 0 ? (
                    <p className="text-[11px] text-stone-500 font-sans italic py-2">Your inventory bags are empty.</p>
                  ) : (
                    inventory.map((item) => (
                      <div 
                        key={item.id} 
                        onClick={() => useInventoryItem(item)}
                        className={`flex flex-col gap-1 p-2.5 rounded text-xs font-sans border transition-all cursor-pointer ${
                          item.equipped 
                            ? 'bg-emerald-950/20 border-emerald-800/60 text-stone-200 hover:bg-emerald-900/30' 
                            : 'bg-stone-950/60 border-stone-850 text-stone-300 hover:bg-stone-900 hover:border-amber-900/30'
                        }`}
                        title={item.type === 'potion' ? "Click to Consume & Heal" : "Click to Equip / Unequip"}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold flex items-center gap-1.5">
                            {item.type === 'potion' ? (
                              <FlaskConical className="w-3.5 h-3.5 text-red-500" />
                            ) : (
                              <Scroll className="w-3.5 h-3.5 text-amber-800" />
                            )}
                            {item.name}
                          </span>
                          {item.type === 'potion' && (
                            <span className="text-[9px] text-red-400 bg-red-950/40 px-1.5 py-0.5 rounded border border-red-900/30 font-sans">Heal</span>
                          )}
                          {item.equipped && (
                            <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-900/30 font-sans">Equipped</span>
                          )}
                        </div>
                        <p className="text-[10px] text-stone-400 font-sans mt-1 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      <footer className="border-t border-stone-900/60 bg-stone-950 py-3 text-center text-[10px] text-stone-600 font-sans z-10 tracking-widest uppercase shrink-0">
        © Eldritch Ascent • Designed to evoke the spirit of classic tabletop RPGs with a modern twist. Crafted with care.
      </footer>

      {gameState === 'prologue' && (
        <PrologueScreen
          character={{
            name: CLASSES[selectedClass].name,
            class: CLASSES[selectedClass].name,
            weapons: CLASSES[selectedClass].inventory.filter(i => i.type === 'weapon')
          }}
          paragraphs={aiPrologueParagraphs}
          onBegin={beginAdventureAfterPrologue}
          onSkip={beginAdventureAfterPrologue}
        />
      )}
    </div>
  );
}

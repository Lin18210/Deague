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
  FlaskConical
} from 'lucide-react';
import audio from './utils/audioEngine';

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
.animate-float { animation: float-up 3.5s ease-out infinite; }
.animate-glow { animation: campfire-glow 2s ease-in-out infinite; }
.animate-ring { animation: pulse-ring 3s cubic-bezier(0.215, 0.610, 0.355, 1) infinite; }
.animate-spin-slow { animation: rune-spin 25s linear infinite; }
.animate-ink-bleed { animation: ink-bleed 1s ease-out forwards; }
.animate-damage { animation: damage-pop 0.8s ease-out forwards; }
.animate-shake-screen { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }
.scrollbar-parchment::-webkit-scrollbar { width: 5px; }
.scrollbar-parchment::-webkit-scrollbar-track { background: rgba(28, 25, 23, 0.9); }
.scrollbar-parchment::-webkit-scrollbar-thumb { background: rgba(217, 119, 6, 0.3); border-radius: 4px; }
`;

const CLASSES = {
  warrior: {
    key: "warrior",
    name: "Vanguard",
    desc: "A veteran heavy knight armored in steel plating. Specializes in direct, brutal physical checks.",
    icon: Sword,
    color: "from-amber-700 to-red-800",
    themeColor: "amber",
    stats: { strength: 16, intelligence: 9, dexterity: 11, wisdom: 12 },
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
    stats: { strength: 7, intelligence: 17, dexterity: 12, wisdom: 14 },
    hp: 18,
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
    stats: { strength: 11, intelligence: 11, dexterity: 17, wisdom: 10 },
    hp: 24,
    mana: 10,
    inventory: [
      { id: "daggers_1", name: "Dual Silent Daggers", desc: "Adds +2 to Dexterity Checks when equipped.", statBonus: { dexterity: 2 }, type: "weapon", equipped: true },
      { id: "potion_1", name: "Elixir of Life", desc: "Consumable. Restores 15 HP immediately.", type: "potion", value: 15 }
    ]
  }
};

const STORY_NODES = {
  intro: {
    title: "An Outpost Under Shadow",
    text: "The campfire crackles weakly against the freezing gales sealing the High Pass. You gather your traveling supplies, your knuckles aching from the bite of the sub-zero wind. Beneath your leather boots, a rhythmic thrum shakes the ancient stone foundation of the mountain cave. Deep in the forgotten chambers below, a magic seal has burst. Runes on the walls are bleeding light.",
    visualType: "hearth",
    choices: [
      { text: "Equip your gear and step closer to the pulsing runestones.", nextNode: "approach_seal" },
      { text: "Recite an ancient warding incantation to stabilize the tremors.", nextNode: "stabilize_ward" }
    ]
  },
  approach_seal: {
    title: "The Bleeding Runes",
    text: "As you step near, the runic inscriptions glow with blinding lavender fire. The scent of hot ozone fills your lungs. Suddenly, a violent fracture splits the cave's stone portal. Through the dense cloud of stone dust and sparks, you hear a mechanical grind of gears, followed by a menacing, inhuman growl.",
    visualType: "arcane",
    choices: [
      { text: "[DEXTERITY CHECK] Vault back to safety before the portal collapses!", check: { stat: "dexterity", difficulty: 12, successNode: "vault_success", failNode: "vault_fail" } },
      { text: "[STRENGTH CHECK] Plant your shield and withstand the seismic shockwave!", check: { stat: "strength", difficulty: 13, successNode: "shield_success", failNode: "shield_fail" } }
    ]
  },
  stabilize_ward: {
    title: "Aether Restabilization",
    text: "Focusing your spiritual reserves, you sketch geometric arcane lines in the air. The raw, bleeding magic of the runestones begins to feed on your spellwork. The vibrations begin to harmonize, but the seals are too old—the gate still opens, revealing a dark stone staircase.",
    visualType: "arcane",
    choices: [
      { text: "[INTELLIGENCE CHECK] Decode the shimmering runic equations to lock the inner threshold.", check: { stat: "intelligence", difficulty: 13, successNode: "lock_success", failNode: "lock_fail" } },
      { text: "Light a torch and cautiously descend the dark staircase.", nextNode: "descent_darkness" }
    ]
  },
  vault_success: {
    title: "Lightfoot Acrobatics",
    text: "With a clean leap, you propel yourself backward. Heavy stone monoliths crash exactly where you were standing, throwing shards of granite everywhere. In the dust, you spot a secret side passageway leading deep into the crypt.",
    visualType: "hearth",
    choices: [
      { text: "Enter the side passageway.", nextNode: "descent_darkness" }
    ]
  },
  vault_fail: {
    title: "Trapped in the Debris",
    text: "You stumble over loose slate! A heavy shard of ancient masonry clips your shoulder, pinning your coat. You pull yourself free, but the impact leaves you winded, and your armor is dented.",
    visualType: "hearth",
    damage: 6,
    choices: [
      { text: "Recover your balance and inspect the breach.", nextNode: "encounter_hound" }
    ]
  },
  shield_success: {
    title: "Immovable Bastion",
    text: "You dig your boots into the stone. The kinetic blast ripples against your defensive guard, creating brilliant sparks but leaving you completely unharmed. You look forward; the path into the crypt lies clear.",
    visualType: "hearth",
    choices: [
      { text: "March forward through the broken threshold.", nextNode: "descent_darkness" }
    ]
  },
  shield_fail: {
    title: "Crushed Defenses",
    text: "The sheer kinetic energy is immense. Your shield arm is slammed backward into your chest, cracking your guard. You are thrown onto the wet cavern floor as the cave entrance collapses behind you.",
    visualType: "hearth",
    damage: 8,
    choices: [
      { text: "Stagger to your feet and search for an exit.", nextNode: "encounter_hound" }
    ]
  },
  lock_success: {
    title: "The Glyphs Sealed",
    text: "Your fingers trace the ancient glyphs, altering their core parameters. The wild purple portal stabilizes, crystallizing into safe, golden pathways. A hidden compartment pops open, revealing a pristine Health Potion!",
    visualType: "arcane",
    loot: { id: "potion_2", name: "Gleaming Healing Potion", desc: "Consumable. Restores 20 HP.", type: "potion", value: 20 },
    choices: [
      { text: "Pocket the potion and descend the stairs.", nextNode: "descent_darkness" }
    ]
  },
  lock_fail: {
    title: "Arcane Backlash",
    text: "A sharp hum sounds in your ears, followed by a shocking blue bolt of lightning that shoots out from the wall. The magic shocks your core, draining your physical energy as the chamber walls begin to buckle.",
    visualType: "arcane",
    damage: 10,
    choices: [
      { text: "Flee down the stairs to escape the collapsing chamber.", nextNode: "encounter_hound" }
    ]
  },
  descent_darkness: {
    title: "The Sunken Vault",
    text: "You descend deep into the tomb. The walls are carved with intricate murals of fallen elven lords and towering dragons. Suddenly, the shadows in the corner of the vault begin to coagulate. A beast made of pure darkness and purple embers—the legendary Shadow-Hound—leaps in front of you!",
    visualType: "battle",
    choices: [
      { text: "Draw your weapon and engage the beast in active combat!", combatStart: true, nextNode: "battle_active" }
    ]
  },
  encounter_hound: {
    title: "Ambushed from the Void",
    text: "As you catch your breath, a menacing growl echoes from the shadows. Glowing purple eyes lock onto your location. It's a ravenous Shadow-Hound, spawned from the broken rift. It charges you immediately with bared fangs!",
    visualType: "battle",
    choices: [
      { text: "Brace for combat and counter-attack!", combatStart: true, nextNode: "battle_active" }
    ]
  },
  victory_node: {
    title: "The Beast Dissolved",
    text: "With a final striking blow, the Shadow-Hound dissipates into a cloud of harmless dark ash. Among the soot, you discover a glowing, runed amulet—the Seal of the High Pass. The master door of the under-empire grinds open, revealing rivers of glowing liquid silver below.",
    visualType: "arcane",
    choices: [
      { text: "Claim the amulet and enter the under-empire (Complete Prologue).", nextNode: "epilogue" }
    ]
  },
  epilogue: {
    title: "PROLOGUE COMPLETE",
    text: "You step out onto a towering stone balcony overlooking an underground metropolis that has slept for three millennia. Runic light posts flicker to life across the silent plazas. Your epic quest to unite the broken kingdoms and control the ancient magic has officially begun.",
    visualType: "arcane",
    choices: []
  }
};

const GEMINI_MODEL = 'gemini-2.5-flash';

export default function App() {
  const [gameState, setGameState] = useState('character-select'); 
  const [selectedClass, setSelectedClass] = useState('warrior');
  const [campaignMode, setCampaignMode] = useState('static'); // 'static' or 'ai'
  const [charStats, setCharStats] = useState(CLASSES.warrior.stats);
  const [inventory, setInventory] = useState(CLASSES.warrior.inventory);
  const [hp, setHp] = useState(CLASSES.warrior.hp);
  const [maxHp, setMaxHp] = useState(CLASSES.warrior.hp);
  const [mana, setMana] = useState(CLASSES.warrior.mana);
  const [maxMana, setMaxMana] = useState(CLASSES.warrior.mana);
  const [currentNodeKey, setCurrentNodeKey] = useState('intro');
  const [journal, setJournal] = useState([]);
  
  // Custom API configuration
  const [apiKey, setApiKey] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [customAction, setCustomAction] = useState('');
  const [currentAiNode, setCurrentAiNode] = useState(null);
  const [apiError, setApiError] = useState(null);

  // Dice rolling state variables
  const [diceRolling, setDiceRolling] = useState(false);
  const [rolledValue, setRolledValue] = useState(20);
  const [activeCheck, setActiveCheck] = useState(null); 
  const [rollResultMsg, setRollResultMsg] = useState('');
  const [rollSuccess, setRollSuccess] = useState(false);
  const [shakeScreen, setShakeScreen] = useState(false);

  // Combat systems
  const [enemyHp, setEnemyHp] = useState(40);
  const [maxEnemyHp] = useState(40);
  const [combatLog, setCombatLog] = useState([]);
  const [damagePopups, setDamagePopups] = useState([]); 
  const [activeCombatEffect, setActiveCombatEffect] = useState(''); 

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

  const startGame = async () => {
    playSoundEffect('success');
    setApiError(null);
    if (campaignMode === 'ai') {
      setGameState('active');
      setJournal([]);
      await fetchNextAiNode("Begin the adventure! Introduce the dark environment and give initial options.");
    } else {
      setGameState('active');
      setCurrentNodeKey('intro');
      setJournal([{ title: STORY_NODES.intro.title, text: STORY_NODES.intro.text }]);
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
      "check": { "stat": "dexterity" | "intelligence" | "strength" | "wisdom", "difficulty": 12 } 
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
                    intelligence: { type: "INTEGER" },
                    dexterity: { type: "INTEGER" },
                    wisdom: { type: "INTEGER" }
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
                      stat: { type: "STRING", enum: ["strength", "intelligence", "dexterity", "wisdom"] },
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

  const handleChoice = (choice) => {
    playSoundEffect('click');
    if (choice.check) {
      setActiveCheck({ ...choice.check, text: choice.text });
      setGameState('check-pending');
      setRolledValue(20);
      setRollResultMsg('');
    } else if (choice.combatStart) {
      setGameState('combat');
      setEnemyHp(40);
      setCombatLog(["A menacing Shadow-Hound emerges from the dark. Prepare to fight!"]);
    } else {
      if (campaignMode === 'ai') {
        fetchNextAiNode(choice.text);
      } else {
        advanceStory(choice.nextNode);
      }
    }
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
    if (!node) return;
    
    triggerShake();
    
    if (node.damage) {
      setHp(prev => Math.max(1, prev - node.damage));
      playSoundEffect('fail');
    }

    if (node.loot) {
      setInventory(prev => {
        if (prev.some(item => item.id === node.loot.id)) return prev;
        return [...prev, node.loot];
      });
      playSoundEffect('success');
    }

    setCurrentNodeKey(nodeKey);
    setJournal(prev => [...prev, { title: node.title, text: node.text }]);
    
    if (nodeKey === 'epilogue') {
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
      setHp(prev => Math.min(maxHp, prev + item.value));
      setInventory(prev => prev.filter(i => i.id !== item.id));
      playSoundEffect('success');
      
      if (gameState === 'combat') {
        setCombatLog(prev => [`Consumed ${item.name} and healed for ${item.value} HP.`, ...prev]);
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

  const executeCombatAction = (action) => {
    if (enemyHp <= 0 || hp <= 0) return;

    let playerDmg = 0;
    let hitSuccess = true;
    let combatLogMsg = "";

    let strBonus = 0;
    let intBonus = 0;
    inventory.forEach(item => {
      if (item.equipped && item.statBonus) {
        if (item.statBonus.strength) strBonus += item.statBonus.strength;
        if (item.statBonus.intelligence) intBonus += item.statBonus.intelligence;
      }
    });

    if (action === 'strike') {
      playSoundEffect('hit');
      const weaponModifier = Math.floor(((charStats.strength + strBonus) - 10) / 2);
      playerDmg = Math.floor(Math.random() * 8) + 4 + weaponModifier;
      
      setActiveCombatEffect('shake-monster');
      setTimeout(() => setActiveCombatEffect(''), 550);

      spawnDamagePopup(playerDmg, "enemy");
      setEnemyHp(prev => Math.max(0, prev - playerDmg));
      combatLogMsg = `🛡️ You swung your blade at the beast, dealing ${playerDmg} physical damage!`;
    } else if (action === 'spell') {
      if (mana < 6) {
        playSoundEffect('fail');
        setCombatLog(prev => ["⚠️ Not enough Aether charge to cast spells!", ...prev]);
        return;
      }
      playSoundEffect('magic');
      setMana(prev => Math.max(0, prev - 6));
      const spellModifier = Math.floor(((charStats.intelligence + intBonus) - 10) / 2);
      playerDmg = Math.floor(Math.random() * 12) + 6 + spellModifier;

      setActiveCombatEffect('spell-cast');
      setTimeout(() => setActiveCombatEffect(''), 600);

      spawnDamagePopup(playerDmg, "enemy");
      setEnemyHp(prev => Math.max(0, prev - playerDmg));
      combatLogMsg = `🔮 You cast a bolt of cosmic light, scorching the monster for ${playerDmg} magic damage!`;
    } else if (action === 'dodge') {
      playSoundEffect('click');
      hitSuccess = Math.random() > 0.6;
      combatLogMsg = "💨 You focused your senses, preparing to parry or evade the beast's next swipe.";
    }

    setCombatLog(prev => [combatLogMsg, ...prev]);

    if (enemyHp - playerDmg <= 0) {
      setTimeout(() => {
        playSoundEffect('success');
        if (campaignMode === 'ai') {
          setGameState('active');
          fetchNextAiNode("The Shadow-Hound dissolves into soot! Survey your surroundings and check for loot.");
        } else {
          setGameState('active');
          advanceStory('victory_node');
        }
      }, 1200);
      return;
    }

    setTimeout(() => {
      if (hp <= 0) return;
      let enemyDmg = Math.floor(Math.random() * 6) + 3;
      
      if (action === 'dodge' && hitSuccess) {
        setCombatLog(prev => ["💫 Evaded! You gracefully rolled beneath the monster's claws.", ...prev]);
        playSoundEffect('success');
      } else {
        playSoundEffect('fail');
        if (action === 'dodge') {
          enemyDmg = Math.floor(enemyDmg / 2);
          setCombatLog(prev => [`💥 Parry! You cushioned the blow, taking only ${enemyDmg} crushing damage.`, ...prev]);
        } else {
          setCombatLog(prev => [`👹 The Shadow-Hound retaliated, slashing your defenses for ${enemyDmg} dark damage!`, ...prev]);
        }
        spawnDamagePopup(enemyDmg, "player");
        setHp(prev => Math.max(1, prev - enemyDmg));
      }
    }, 800);
  };

  const spawnDamagePopup = (amt, target) => {
    const id = Math.random().toString();
    const newPopup = {
      id,
      text: `-${amt}`,
      color: target === 'enemy' ? 'text-purple-400 font-extrabold shadow-purple-900/50' : 'text-red-500 font-bold shadow-red-900/50'
    };
    setDamagePopups(prev => [...prev, newPopup]);
    setTimeout(() => {
      setDamagePopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  };

  const resetGame = () => {
    playSoundEffect('click');
    handleClassChange('warrior');
    setGameState('character-select');
    setJournal([]);
    setCurrentNodeKey('intro');
    setCurrentAiNode(null);
    setApiError(null);
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

      {/* Campaign Particle Accents */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-orange-950/20 blur-[130px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-950/30 blur-[130px]" />

        <div className="absolute bottom-0 left-[15%] w-1.5 h-1.5 bg-amber-500 rounded-full animate-float opacity-0" style={{ animationDelay: '0.1s', animationDuration: '4.2s' }} />
        <div className="absolute bottom-0 left-[38%] w-2 h-2 bg-amber-600 rounded-full animate-float opacity-0" style={{ animationDelay: '1.4s', animationDuration: '5.6s' }} />
        <div className="absolute bottom-0 left-[64%] w-1 h-1 bg-red-500 rounded-full animate-float opacity-0" style={{ animationDelay: '0.8s', animationDuration: '3.9s' }} />
        <div className="absolute bottom-0 left-[83%] w-2.5 h-2.5 bg-amber-400 rounded-full animate-float opacity-0" style={{ animationDelay: '2.8s', animationDuration: '6.2s' }} />
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                className="mt-6 w-full py-4 bg-gradient-to-r from-amber-600 to-amber-800 text-stone-950 font-sans uppercase font-extrabold tracking-widest rounded-lg shadow-lg hover:from-amber-500 hover:to-amber-700 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Assemble Adventure Gear & Enter the Pass
                <ChevronRight className="w-5 h-5" />
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
                        <ShieldAlert className="w-4 h-4" /> Combat Encounters
                      </span>
                      <h3 className="text-2xl font-bold text-stone-100">BATTLE: The Void Stalker</h3>
                    </div>

                    <div className="bg-stone-950/80 border border-purple-900/40 rounded-xl p-6 flex flex-col md:flex-row items-center justify-around gap-6 relative min-h-[160px]">
                      
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none z-30">
                        {damagePopups.map((pop) => (
                          <div key={pop.id} className={`text-xl font-sans animate-damage ${pop.color}`}>
                            {pop.text}
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-16 h-16 rounded-full bg-stone-900 border-2 border-amber-500 flex items-center justify-center ${activeCombatEffect === 'spell-cast' ? 'scale-110 ring-4 ring-indigo-500 transition-all' : ''}`}>
                          <User className="w-8 h-8 text-amber-500" />
                        </div>
                        <span className="text-xs font-sans font-bold">{CLASSES[selectedClass].name}</span>
                        <span className="text-xs font-sans text-stone-400">HP: {hp}/{maxHp}</span>
                      </div>

                      <div className="text-lg font-sans font-semibold text-stone-600">VS</div>

                      <div className="flex flex-col items-center gap-2">
                        <div className={`w-20 h-20 rounded-full bg-stone-900 border-2 border-purple-600 flex items-center justify-center overflow-hidden relative ${activeCombatEffect === 'shake-monster' ? 'animate-shake-screen ring-4 ring-red-500 animate-monster-shake' : ''}`}>
                          <svg className="w-12 h-12 text-purple-500" viewBox="0 0 100 100">
                            <polygon points="50,15 90,50 50,85 10,50" fill="none" stroke="currentColor" strokeWidth="3" />
                            <circle cx="50" cy="50" r="14" fill="currentColor" className="animate-pulse" />
                          </svg>
                        </div>
                        <span className="text-xs font-sans font-bold text-purple-400">Shadow-Hound</span>
                        <div className="w-32 bg-stone-800 h-2 rounded overflow-hidden">
                          <div className="bg-purple-600 h-full transition-all duration-300" style={{ width: `${(enemyHp / maxEnemyHp) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-sans text-stone-400">Enemy HP: {enemyHp}/{maxEnemyHp}</span>
                      </div>

                    </div>

                    <div className="bg-stone-900/60 rounded border border-stone-800 p-4 h-32 overflow-y-auto scrollbar-parchment font-sans text-xs space-y-2">
                      {combatLog.map((log, index) => (
                        <p key={index} className="text-stone-300 leading-relaxed border-l-2 border-purple-800/40 pl-2">
                          {log}
                        </p>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button 
                        onClick={() => executeCombatAction('strike')}
                        className="p-3 bg-red-950/40 hover:bg-red-900/30 text-red-200 border border-red-900/60 rounded text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sword className="w-4 h-4 text-red-400" /> Slash (Weapon)
                      </button>
                      <button 
                        onClick={() => executeCombatAction('spell')}
                        className="p-3 bg-indigo-950/40 hover:bg-indigo-900/30 text-indigo-200 border border-indigo-900/60 rounded text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Sparkles className="w-4 h-4 text-indigo-400" /> Aether Bolt (6 MP)
                      </button>
                      <button 
                        onClick={() => executeCombatAction('dodge')}
                        className="p-3 bg-stone-900 hover:bg-stone-850 text-stone-300 border border-stone-800 rounded text-xs font-sans font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-stone-400" /> Tactical Dodge
                      </button>
                    </div>

                  </div>
                ) : (
                  /* NARRATIVE SCENE READING AREA */
                  <>
                    {journal.map((item, idx) => {
                      const isLast = idx === journal.length - 1;
                      return (
                        <div 
                          key={idx} 
                          className={`space-y-3 transition-opacity duration-500 ${isLast ? 'animate-ink-bleed' : 'opacity-40 hover:opacity-75 transition-opacity'}`}
                        >
                          <h3 className="text-xs font-sans text-amber-500 tracking-widest uppercase font-bold flex items-center gap-2">
                            <Flame className="w-3.5 h-3.5" />
                            {item.title}
                          </h3>
                          <p className="text-stone-100 text-base md:text-lg leading-relaxed font-serif tracking-wide first-letter:text-3xl first-letter:font-bold first-letter:text-amber-500 first-letter:mr-1">
                            {item.text}
                          </p>
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
                              setCurrentNodeKey('intro');
                              setJournal([{ title: STORY_NODES.intro.title, text: STORY_NODES.intro.text }]);
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
                          {activeCheck.stat.toUpperCase()} Check required!
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
                      <Award className="w-10 h-10 text-amber-500 animate-bounce" />
                      <div>
                        <h4 className="text-xl font-bold text-stone-100">Chronicle Concluded!</h4>
                        <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto leading-relaxed">
                          You have completed the intro prologue module of Eldritch Ascent.
                        </p>
                      </div>
                      <button 
                        onClick={resetGame}
                        className="px-6 py-2.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-sans font-bold uppercase tracking-wider rounded transition-all text-xs cursor-pointer"
                      >
                        Start New Adventure
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
                  gameState === 'check-pending' 
                    ? 'border-purple-500/20 bg-purple-950/5 animate-spin-slow' 
                    : 'border-stone-800/80'
                }`}>
                  <div className="text-stone-950 opacity-10 text-6xl font-extrabold select-none">d20</div>
                </div>

                <div className="relative z-10 flex flex-col items-center justify-center mt-3">
                  <div className={`w-28 h-28 flex items-center justify-center relative select-none cursor-pointer ${
                    diceRolling ? 'scale-110' : 'hover:scale-[1.03] transition-transform'
                  }`}
                  onClick={gameState === 'check-pending' ? handleDiceRoll : undefined}
                  >
                    <svg viewBox="0 0 100 100" className={`w-full h-full drop-shadow-2xl transition-transform duration-300 ${
                      diceRolling ? 'animate-spin text-purple-500' : 'text-amber-500'
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

                  {rollResultMsg && (
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
                </div>
              </div>

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
        © Eldritch Ascent • Designed for Epic Campaigns & Tabletop Storytellers
      </footer>
    </div>
  );
}

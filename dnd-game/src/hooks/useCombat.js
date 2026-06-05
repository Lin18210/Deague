import { useState, useCallback, useRef, useEffect } from 'react';
import { rollD20, rollDice } from '../utils/diceUtils';
import { getAbilityMod } from '../data/initialCharacter';
import { generateCombatNarration } from '../services/aiService';
import audio from '../utils/audioEngine';

function doubleDice(notation) {
  const match = notation.match(/^(\d+)d(\d+)([+-]\d+)?$/);
  if (!match) return notation;
  const count = parseInt(match[1], 10) * 2;
  const sides = match[2];
  const mod = match[3] || '';
  return `${count}d${sides}${mod}`;
}

export function useCombat(character, updateCharacter, addLog, onEndCombat, storyState) {
  const [combatState, setCombatState] = useState(null);
  const [diceResult, setDiceResult] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [combatNarration, setCombatNarration] = useState('');

  const characterRef = useRef(character);
  useEffect(() => {
    characterRef.current = character;
  }, [character]);

  const combatLogRef = useRef([]);

  const strMod = getAbilityMod(character, 'STR');
  const dexMod = getAbilityMod(character, 'DEX');
  const profBonus = character.proficiency;
  const weapon = character.weapons[0];
  const spellAttackMod = character.spells[1]?.attackMod || (strMod + profBonus);

  const buildCombatContext = useCallback(() => {
    if (!storyState) return '';
    const flags = Object.entries(storyState.flags || {})
      .slice(0, 10)
      .map(([k, v]) => `${k}: ${v}`)
      .join(', ');
    return `World state: location=${storyState.currentLocation || 'unknown'}, reputation=${storyState.playerReputation || 0}, flags=[${flags}]`;
  }, [storyState]);

  const narrateAction = useCallback(async (actor, action, result, target) => {
    const context = buildCombatContext();
    try {
      const narration = await generateCombatNarration(actor, action, result, target, context);
      return narration;
    } catch {
      return null;
    }
  }, [buildCombatContext]);

  const startCombat = useCallback((enemy) => {
    audio.play('dice');
    const playerInit = rollD20(dexMod);
    const enemyInit = rollD20(enemy.dexMod || 2);

    combatLogRef.current = [];

    const state = {
      enemy: { ...enemy },
      turn: playerInit.total >= enemyInit.total ? 'player' : 'enemy',
      round: 1,
      playerAC: character.ac,
      log: [
        `⚔️ Combat begins! ${enemy.name} appears!`,
        `${character.name} initiative: ${playerInit.total} | ${enemy.name} initiative: ${enemyInit.total}`,
        playerInit.total >= enemyInit.total
          ? `${character.name} reacts faster and goes first!`
          : `${enemy.name} strikes first!`,
      ],
    };

    combatLogRef.current = [...state.log];
    setCombatState(state);
    addLog(`⚔️ Combat started against ${enemy.name}!`);
    setDiceResult(playerInit);
    setCombatNarration('');
  }, [character, dexMod, addLog]);

  const addCombatLog = useCallback((text) => {
    combatLogRef.current = [...combatLogRef.current, text];
    setCombatState((prev) => {
      if (!prev) return prev;
      return { ...prev, log: [...prev.log, text] };
    });
  }, []);

  const enemyTurn = useCallback(async () => {
    setCombatState((prev) => {
      if (!prev || prev.turn === 'player') return prev;

      const char = characterRef.current;
      const enemy = prev.enemy;
      const attackRoll = rollD20(enemy.attackMod);
      let logEntry;
      let combatNarr = '';

      if (attackRoll.isCrit) {
        const doubled = doubleDice(enemy.damage);
        const critDamage = rollDice(doubled);
        const totalDamage = critDamage.total + enemy.damageMod;
        audio.play('crit');
        const resultText = `CRITICAL HIT — ${critDamage.rolls.join('+')}+${enemy.damageMod}=${totalDamage} damage`;

        generateCombatNarration(
          enemy.name, 'attack', resultText, char.name, buildCombatContext()
        ).then(n => {
          if (n) setCombatNarration(n);
        });

        logEntry = `💀 CRITICAL HIT! ${enemy.name} attacks: rolled ${attackRoll.roll} — deals ${critDamage.rolls.join('+')}+${enemy.damageMod}=${totalDamage} damage!`;
        addLog(logEntry);
        combatLogRef.current = [...combatLogRef.current, logEntry];

        const newHp = char.health - totalDamage;
        if (newHp <= 0) {
          const deathEntry = `💀 ${char.name} has fallen in battle!`;
          addLog(deathEntry);
          combatLogRef.current = [...combatLogRef.current, deathEntry];
          setDiceResult(attackRoll);
          updateCharacter({ health: 0 });
          setTimeout(() => onEndCombat(false, enemy.name, combatLogRef.current, enemy), 500);
          return { ...prev, turn: 'player', round: prev.round + 1, log: [...prev.log, logEntry, deathEntry] };
        }

        updateCharacter({ health: newHp });
        addLog(`❤️ ${char.name} HP: ${newHp}/${char.maxHealth}`);
        setDiceResult(attackRoll);
        return { ...prev, turn: 'player', round: prev.round + 1, log: [...prev.log, logEntry] };
      }

      if (attackRoll.isFumble) {
        logEntry = `😅 ${enemy.name} attacks: rolled 1 — CRITICAL MISS!`;
        generateCombatNarration(
          enemy.name, 'attack', 'CRITICAL MISS', char.name, buildCombatContext()
        ).then(n => {
          if (n) setCombatNarration(n);
        });
      } else if (attackRoll.total >= prev.playerAC) {
        const damage = rollDice(enemy.damage);
        const totalDamage = Math.max(1, damage.total + enemy.damageMod);
        const resultText = `HIT — ${damage.rolls.join('+')}+${enemy.damageMod}=${totalDamage} damage`;
        audio.play('fail');

        generateCombatNarration(
          enemy.name, 'attack', resultText, char.name, buildCombatContext()
        ).then(n => {
          if (n) setCombatNarration(n);
        });

        logEntry = `💥 ${enemy.name} attacks: rolled ${attackRoll.roll}+${enemy.attackMod}=${attackRoll.total} vs AC ${prev.playerAC} — HIT! ${damage.rolls.join('+')}+${enemy.damageMod}=${totalDamage} damage`;

        const newHp = char.health - totalDamage;
        if (newHp <= 0) {
          const deathEntry = `💀 ${char.name} has fallen in battle!`;
          addLog(logEntry);
          addLog(deathEntry);
          combatLogRef.current = [...combatLogRef.current, logEntry, deathEntry];
          updateCharacter({ health: 0 });
          setDiceResult(attackRoll);
          setTimeout(() => onEndCombat(false, enemy.name, combatLogRef.current, enemy), 500);
          return { ...prev, turn: 'player', round: prev.round + 1, log: [...prev.log, logEntry, deathEntry] };
        }

        updateCharacter({ health: newHp });
        addLog(`❤️ ${char.name} HP: ${newHp}/${char.maxHealth}`);
      } else {
        logEntry = `💨 ${enemy.name} attacks: rolled ${attackRoll.roll}+${enemy.attackMod}=${attackRoll.total} vs AC ${prev.playerAC} — MISS!`;
        generateCombatNarration(
          enemy.name, 'attack', 'MISS', char.name, buildCombatContext()
        ).then(n => {
          if (n) setCombatNarration(n);
        });
      }

      addLog(logEntry);
      combatLogRef.current = [...combatLogRef.current, logEntry];
      setDiceResult(attackRoll);
      return { ...prev, turn: 'player', round: prev.round + 1, log: [...prev.log, logEntry] };
    });
  }, [updateCharacter, addLog, onEndCombat, buildCombatContext]);

  const playerAttack = useCallback(async () => {
    if (!combatState || combatState.turn !== 'player' || processing) return;
    setProcessing(true);

    const attackRoll = rollD20(strMod + profBonus + weapon.magic);
    let logEntry;

    if (attackRoll.isCrit) {
      const doubled = doubleDice(weapon.damage);
      const critDamage = rollDice(doubled);
      const totalDamage = critDamage.total + strMod + weapon.magic;
      audio.play('crit');
      const resultText = `CRITICAL HIT — ${critDamage.rolls.join('+')}+${strMod + weapon.magic}=${totalDamage} damage`;

      narrateAction(character.name, `${weapon.name} strike`, resultText, combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });

      logEntry = `🔥 CRITICAL HIT! ${character.name} attacks with ${weapon.name}: rolled ${attackRoll.roll} (total ${attackRoll.total}). Deals ${critDamage.rolls.join('+')}+${strMod + weapon.magic}=${totalDamage} damage!`;
      addCombatLog(logEntry);
      addLog(logEntry);

      const newHp = combatState.enemy.hp - totalDamage;
      if (newHp <= 0) {
        addCombatLog(`🏆 ${combatState.enemy.name} is defeated!`);
        addLog(`🏆 ${character.name} defeated ${combatState.enemy.name}!`);
        setDiceResult(attackRoll);
        setProcessing(false);
        setTimeout(() => onEndCombat(true, combatState.enemy.name, combatLogRef.current, combatState.enemy), 500);
        return;
      }

      setCombatState((prev) => ({
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        turn: 'enemy',
      }));
      setDiceResult(attackRoll);
      setProcessing(false);
      setTimeout(() => enemyTurn(), 800);
      return;
    }

    if (attackRoll.isFumble) {
      audio.play('fail');
      logEntry = `❌ ${character.name} attacks with ${weapon.name}: rolled 1 — CRITICAL MISS! The swing goes wide.`;
      narrateAction(character.name, `${weapon.name} swing`, 'CRITICAL MISS', combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });
    } else if (attackRoll.total >= combatState.enemy.ac) {
      const damageRoll = rollDice(weapon.damage);
      const totalDamage = damageRoll.total + strMod + weapon.magic;
      const resultText = `HIT — ${damageRoll.rolls.join('+')}+${strMod + weapon.magic}=${totalDamage} damage`;
      audio.play('hit');

      narrateAction(character.name, `${weapon.name}`, resultText, combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });

      logEntry = `⚔️ ${character.name} attacks with ${weapon.name}: rolled ${attackRoll.roll}+${strMod + profBonus + weapon.magic}=${attackRoll.total} vs AC ${combatState.enemy.ac} — HIT! ${damageRoll.rolls.join('+')}+${strMod + weapon.magic}=${totalDamage} damage`;

      const newHp = combatState.enemy.hp - totalDamage;
      if (newHp <= 0) {
        addCombatLog(logEntry);
        addCombatLog(`🏆 ${combatState.enemy.name} is defeated!`);
        addLog(logEntry);
        addLog(`🏆 ${character.name} defeated ${combatState.enemy.name}!`);
        setDiceResult(attackRoll);
        setProcessing(false);
        setTimeout(() => onEndCombat(true, combatState.enemy.name, combatLogRef.current, combatState.enemy), 500);
        return;
      }

      setCombatState((prev) => ({
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        turn: 'enemy',
      }));
    } else {
      logEntry = `⚔️ ${character.name} attacks with ${weapon.name}: rolled ${attackRoll.roll}+${strMod + profBonus + weapon.magic}=${attackRoll.total} vs AC ${combatState.enemy.ac} — MISS!`;
      narrateAction(character.name, `${weapon.name}`, 'MISS', combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });
    }

    addCombatLog(logEntry);
    addLog(logEntry);
    setDiceResult(attackRoll);
    setProcessing(false);

    setTimeout(() => enemyTurn(), 800);
  }, [combatState, processing, character, strMod, profBonus, weapon, addCombatLog, addLog, onEndCombat, enemyTurn, narrateAction]);

  const playerCastSpell = useCallback(async (spell) => {
    if (!combatState || combatState.turn !== 'player' || processing) return;
    if (!spell.damage && !spell.autoHit && !spell.effect) return;
    if (character.mana < spell.manaCost) {
      addCombatLog(`⚠️ Not enough mana! Need ${spell.manaCost}, have ${character.mana}`);
      return;
    }
    setProcessing(true);

    updateCharacter({ mana: character.mana - spell.manaCost });

    if (spell.autoHit) {
      audio.play('magic');
      const damage = rollDice(spell.damage);
      const resultText = `Auto-hit — ${damage.rolls.join('+')}+${damage.modifier}=${damage.total} damage`;

      narrateAction(character.name, spell.name, resultText, combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });

      const logEntry = `✨ ${character.name} casts ${spell.name}: ${damage.rolls.join('+')}+${damage.modifier}=${damage.total} damage (auto-hit)! Mana: ${character.mana - spell.manaCost}/${character.maxMana}`;
      addCombatLog(logEntry);
      addLog(logEntry);

      const newHp = combatState.enemy.hp - damage.total;
      if (newHp <= 0) {
        addCombatLog(`🏆 ${combatState.enemy.name} is defeated!`);
        setDiceResult(damage);
        setProcessing(false);
        setTimeout(() => onEndCombat(true, combatState.enemy.name, combatLogRef.current, combatState.enemy), 500);
        return;
      }

      setCombatState((prev) => ({
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        turn: 'enemy',
      }));
      setDiceResult(damage);
      setProcessing(false);
      setTimeout(() => enemyTurn(), 800);
      return;
    }

    if (spell.effect) {
      audio.play('magic');
      if (spell.effect === 'ac_boost') {
        const logEntry = `🛡️ ${character.name} casts ${spell.name}: +2 AC! Mana: ${character.mana - spell.manaCost}/${character.maxMana}`;
        addCombatLog(logEntry);
        addLog(logEntry);
        narrateAction(character.name, spell.name, '+2 AC buff', 'self').then(n => {
          if (n) setCombatNarration(n);
        });
        setCombatState((prev) => ({
          ...prev,
          playerAC: (prev?.playerAC || character.ac) + 2,
          turn: 'enemy',
        }));
        setProcessing(false);
        setTimeout(() => enemyTurn(), 800);
        return;
      }
      setProcessing(false);
      return;
    }

    const atkMod = spell.attackMod || spellAttackMod;
    const attackRoll = rollD20(atkMod);
    let logEntry;

    if (attackRoll.isCrit) {
      audio.play('crit');
      const doubled = doubleDice(spell.damage);
      const critDamage = rollDice(doubled);
      const totalDamage = critDamage.total;
      const resultText = `SPELL CRIT — ${critDamage.rolls.join('+')}=${totalDamage} damage`;

      narrateAction(character.name, spell.name, resultText, combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });

      logEntry = `🔥 SPELL CRIT! ${character.name} casts ${spell.name}: rolled ${attackRoll.roll} — deals ${critDamage.rolls.join('+')}=${totalDamage} damage! Mana: ${character.mana - spell.manaCost}/${character.maxMana}`;
      addCombatLog(logEntry);
      addLog(logEntry);

      const newHp = combatState.enemy.hp - totalDamage;
      if (newHp <= 0) {
        addCombatLog(`🏆 ${combatState.enemy.name} is defeated!`);
        setDiceResult(attackRoll);
        setProcessing(false);
        setTimeout(() => onEndCombat(true, combatState.enemy.name, combatLogRef.current, combatState.enemy), 500);
        return;
      }

      setCombatState((prev) => ({
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        turn: 'enemy',
      }));
      setDiceResult(attackRoll);
      setProcessing(false);
      setTimeout(() => enemyTurn(), 800);
      return;
    }

    if (attackRoll.isFumble) {
      audio.play('fail');
      logEntry = `❌ ${character.name} casts ${spell.name}: rolled 1 — the spell fizzles out! Mana: ${character.mana - spell.manaCost}/${character.maxMana}`;
      narrateAction(character.name, spell.name, 'FUMBLE — spell fizzles', combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });
    } else if (attackRoll.total >= combatState.enemy.ac) {
      const damage = rollDice(spell.damage);
      const resultText = `HIT — ${damage.rolls.join('+')}=${damage.total} damage`;
      audio.play('magic');

      narrateAction(character.name, spell.name, resultText, combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });

      logEntry = `✨ ${character.name} casts ${spell.name}: rolled ${attackRoll.roll}+${atkMod}=${attackRoll.total} vs AC ${combatState.enemy.ac} — HIT! ${damage.rolls.join('+')}=${damage.total} damage. Mana: ${character.mana - spell.manaCost}/${character.maxMana}`;

      const newHp = combatState.enemy.hp - damage.total;
      if (newHp <= 0) {
        addCombatLog(logEntry);
        addCombatLog(`🏆 ${combatState.enemy.name} is defeated!`);
        setDiceResult(attackRoll);
        setProcessing(false);
        setTimeout(() => onEndCombat(true, combatState.enemy.name, combatLogRef.current, combatState.enemy), 500);
        return;
      }

      setCombatState((prev) => ({
        ...prev,
        enemy: { ...prev.enemy, hp: newHp },
        turn: 'enemy',
      }));
    } else {
      logEntry = `✨ ${character.name} casts ${spell.name}: rolled ${attackRoll.roll}+${atkMod}=${attackRoll.total} vs AC ${combatState.enemy.ac} — MISS! Mana: ${character.mana - spell.manaCost}/${character.maxMana}`;
      narrateAction(character.name, spell.name, 'MISS', combatState.enemy.name).then(n => {
        if (n) setCombatNarration(n);
      });
    }

    addCombatLog(logEntry);
    addLog(logEntry);
    setDiceResult(attackRoll);
    setProcessing(false);
    setTimeout(() => enemyTurn(), 800);
  }, [combatState, processing, character, updateCharacter, spellAttackMod, addCombatLog, addLog, onEndCombat, enemyTurn, narrateAction]);

  const usePotion = useCallback(async () => {
    if (!combatState || combatState.turn !== 'player' || processing) return;
    setProcessing(true);

    const healAmount = rollDice('2d4+2').total;
    audio.play('potion');
    const char = characterRef.current;
    const newHp = Math.min(char.health + healAmount, char.maxHealth);
    updateCharacter({ health: newHp });
    const logEntry = `🧪 ${char.name} drinks a healing potion: +${healAmount} HP (${newHp}/${char.maxHealth})`;
    addCombatLog(logEntry);
    addLog(logEntry);

    narrateAction(char.name, 'Healing Potion', `Healed ${healAmount} HP`, 'self').then(n => {
      if (n) setCombatNarration(n);
    });

    setCombatState((prev) => ({ ...prev, turn: 'enemy' }));
    setProcessing(false);
    setTimeout(() => enemyTurn(), 800);
  }, [combatState, processing, updateCharacter, addCombatLog, addLog, enemyTurn, narrateAction]);

  const flee = useCallback(async () => {
    if (!combatState || combatState.turn !== 'player' || processing) return;
    setProcessing(true);

    const escapeRoll = rollD20(dexMod);
    const dc = 12 + (combatState.enemy.dexMod || 2);

    if (escapeRoll.total >= dc) {
      const logEntry = `🏃 ${character.name} flees successfully! (Rolled ${escapeRoll.total} vs DC ${dc})`;
      addCombatLog(logEntry);
      addLog(`🏃 ${character.name} escaped from ${combatState.enemy.name}!`);
      setDiceResult(escapeRoll);
      setProcessing(false);
      setTimeout(() => onEndCombat(false, combatState.enemy.name, combatLogRef.current, combatState.enemy), 300);
    } else {
      const logEntry = `🚫 ${character.name} tries to flee but fails! (Rolled ${escapeRoll.total} vs DC ${dc})`;
      addCombatLog(logEntry);
      setDiceResult(escapeRoll);
      setCombatState((prev) => ({ ...prev, turn: 'enemy' }));
      setProcessing(false);
      setTimeout(() => enemyTurn(), 800);
    }
  }, [combatState, processing, character, dexMod, addCombatLog, addLog, onEndCombat, enemyTurn]);

  return {
    combatState,
    diceResult,
    processing,
    combatNarration,
    startCombat,
    playerAttack,
    playerCastSpell,
    usePotion,
    flee,
    addCombatLog,
  };
}

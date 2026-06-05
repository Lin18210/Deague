import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Sword, ChevronRight } from 'lucide-react';
import { initialCharacter } from '../../data/initialCharacter';
import { generateBackstory } from '../../services/aiService';

const FALLBACK_PROLOGUE = [
  {
    text: 'The Age of Ash has ended, but its scars remain.',
    subtitle: 'A hundred years after the Dragon Wars',
  },
  {
    text: 'The great kingdoms of men have crumbled into squabbling fiefdoms. Elven citadels sit abandoned in dying forests, their songs silenced by some ancient grief. Dwarven holds seal their gates ever tighter, hoarding iron and gold against a world that has forgotten the meaning of trust.',
    subtitle: 'A shattered world',
  },
  {
    text: 'But shadows are stirring in the east. Caravans vanish on roads that were safe a season ago. Villages report strange lights in the hills at night — and worse, the silence that follows. Something is waking in the forgotten places of the world. Something that was never meant to return.',
    subtitle: 'Darkness gathers',
  },
  {
    text: `Among the few who still dare to walk the old roads is a lone adventurer — ${initialCharacter.name}. A ${initialCharacter.class.toLowerCase()} of some renown, carrying a ${initialCharacter.weapons[0].name.toLowerCase()} and the weight of choices yet unmade. Whether they become legend or lament, the road ahead will tell.`,
    subtitle: 'A hero rises',
  },
  {
    text: 'Tonight, the road leads to the Crossroads Tavern. Its lanterns burn against the dark like a promise — or a warning. Inside, strangers swap rumors over tankards of ale. A hooded figure watches from the corner. A scarred half-orc tends the bar. And somewhere, a flickering candle casts a shadow that moves when no one is watching.',
    subtitle: 'The Crossroads Tavern — where all stories begin',
  },
];

const WORD_DELAY_MS = 90;
const PAUSE_BETWEEN_PARAGRAPHS = 2400;
const INITIAL_DELAY = 600;

const EMBER_COUNT = 28;

function makeEmber() {
  return {
    id: Math.random(),
    left: `${Math.random() * 100}%`,
    bottom: `${Math.random() * 30}%`,
    size: 2 + Math.random() * 5,
    duration: 3 + Math.random() * 7,
    delay: Math.random() * 8,
    drift: (Math.random() - 0.5) * 40,
    color: Math.random() > 0.5 ? '#f59e0b' : '#ea580c',
  };
}

function Embers() {
  const embers = useMemo(() => Array.from({ length: EMBER_COUNT }, makeEmber), []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {embers.map((e) => (
        <div
          key={e.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: e.left,
            bottom: e.bottom,
            width: e.size,
            height: e.size,
            background: e.color,
            boxShadow: `0 0 ${e.size * 1.5}px ${e.color}, 0 0 ${e.size * 3}px ${e.color}80`,
            opacity: 0,
            animation: `emberFloat ${e.duration}s ${e.delay}s ease-out infinite`,
            '--ember-drift': `${e.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

function EmberSpark({ x, y }) {
  if (!x) return null;
  return (
    <div className="fixed pointer-events-none z-50" style={{ left: x, top: y }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + Math.random() * 2,
            height: 2 + Math.random() * 2,
            background: '#f59e0b',
            boxShadow: '0 0 4px #f59e0b, 0 0 8px #ea580c',
            opacity: 0,
            animation: `emberFloat ${0.8 + Math.random() * 1.2}s ease-out forwards`,
            animationDelay: `${Math.random() * 0.3}s`,
            '--ember-drift': `${(Math.random() - 0.5) * 30}px`,
          }}
        />
      ))}
    </div>
  );
}

function FadeWord({ word, visible }) {
  return (
    <span
      className="inline transition-opacity duration-[400ms] ease-out"
      style={{ opacity: visible ? 1 : 0 }}
    >
      {word}
    </span>
  );
}

export default function PrologueScreen({ onBegin, onSkip }) {
  const [paragraphs, setParagraphs] = useState([]);
  const [doneIndices, setDoneIndices] = useState([]);
  const [revealIndex, setRevealIndex] = useState(-1);
  const [visibleWordCount, setVisibleWordCount] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);
  const [showBegin, setShowBegin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [atmosphericLine, setAtmosphericLine] = useState(0);
  const [spark, setSpark] = useState({ x: null, y: null });
  const timerRef = useRef(null);
  const isPausingRef = useRef(false);

  const paragraphWords = useMemo(() => {
    return paragraphs.map((p) => {
      const parts = p.text.split(/(\s+)/);
      const words = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i].trim() === '') {
          if (words.length > 0) {
            words[words.length - 1] += parts[i];
          }
        } else {
          words.push(parts[i]);
        }
      }
      return words;
    });
  }, [paragraphs]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await generateBackstory(initialCharacter);
        if (!cancelled && result?.narrative) {
          const parts = result.narrative
            .split(/\n\n+/)
            .filter((p) => p.trim())
            .map((text) => ({ text: text.trim(), subtitle: null }));

          if (parts.length >= 3) {
            setParagraphs(parts);
            setLoading(false);
            return;
          }
        }
      } catch {}

      setParagraphs(FALLBACK_PROLOGUE);
      setLoading(false);
    }

    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (loading || paragraphs.length === 0) return;

    setRevealIndex(0);
    setVisibleWordCount(0);
    setDoneIndices([]);
    setAllRevealed(false);
    setShowBegin(false);
    isPausingRef.current = false;
  }, [paragraphs, loading]);

  const advanceToNextParagraph = useCallback(() => {
    setDoneIndices((prev) => {
      const nextDone = [...prev, revealIndex];
      if (nextDone.length >= paragraphs.length) {
        setRevealIndex(-1);
        setAllRevealed(true);
        timerRef.current = setTimeout(() => setShowBegin(true), 1800);
      } else {
        isPausingRef.current = true;
        timerRef.current = setTimeout(() => {
          isPausingRef.current = false;
          setRevealIndex((r) => r + 1);
          setVisibleWordCount(0);
        }, PAUSE_BETWEEN_PARAGRAPHS);
      }
      return nextDone;
    });
  }, [revealIndex, paragraphs]);

  const skipAllTyping = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const allIndices = paragraphs.map((_, i) => i);
    setDoneIndices(allIndices);
    setRevealIndex(-1);
    setAllRevealed(true);
    setShowBegin(true);
  }, [paragraphs]);

  useEffect(() => {
    if (revealIndex < 0 || revealIndex >= paragraphWords.length) return;
    if (isPausingRef.current) return;

    const words = paragraphWords[revealIndex];
    const maxWords = words.length;

    timerRef.current = setTimeout(() => {
      setVisibleWordCount((prev) => {
        const next = prev + 1;
        if (next >= maxWords) {
          advanceToNextParagraph();
        }
        return next;
      });
    }, WORD_DELAY_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [revealIndex, visibleWordCount, paragraphWords, advanceToNextParagraph]);

  useEffect(() => {
    const lines = [
      'The embers dance...',
      'Flames whisper tales of ages past...',
      'The wood hisses and cracks...',
      'Somewhere, a log collapses into ash...',
      'Shadows stretch and retreat...',
      'The fire burns on, waiting...',
    ];

    const interval = setInterval(() => {
      setAtmosphericLine((prev) => (prev + 1) % lines.length);
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback(
    (e) => {
      setSpark({ x: e.clientX, y: e.clientY });
      setTimeout(() => setSpark({ x: null, y: null }), 1200);

      if (allRevealed) {
        setShowBegin(true);
        return;
      }

      if (isPausingRef.current) {
        if (timerRef.current) clearTimeout(timerRef.current);
        isPausingRef.current = false;
        const nextIdx = revealIndex + 1;
        if (nextIdx >= paragraphWords.length) {
          setDoneIndices(paragraphs.map((_, i) => i));
          setRevealIndex(-1);
          setAllRevealed(true);
          setShowBegin(true);
        } else {
          const prevDone = [...doneIndices, revealIndex];
          setDoneIndices(prevDone);
          setRevealIndex(nextIdx);
          setVisibleWordCount(0);
        }
        return;
      }

      const words = paragraphWords[revealIndex];
      if (words) {
        const prevDone = [...doneIndices, revealIndex];
        setDoneIndices(prevDone);
        setVisibleWordCount(words.length);

        if (prevDone.length >= paragraphs.length) {
          setRevealIndex(-1);
          setAllRevealed(true);
          timerRef.current = setTimeout(() => setShowBegin(true), 1800);
        } else {
          isPausingRef.current = true;
          timerRef.current = setTimeout(() => {
            isPausingRef.current = false;
            setRevealIndex((r) => r + 1);
            setVisibleWordCount(0);
          }, PAUSE_BETWEEN_PARAGRAPHS);
        }
      }
    },
    [allRevealed, revealIndex, doneIndices, paragraphs, paragraphWords, advanceToNextParagraph]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        skipAllTyping();
        return;
      }
      if (e.key === ' ') {
        e.preventDefault();
        handleClick({ clientX: 0, clientY: 0 });
        return;
      }
      if (e.key === 'Enter') {
        if (!allRevealed) {
          skipAllTyping();
        } else {
          onBegin();
        }
      }
    },
    [allRevealed, onBegin, handleClick, skipAllTyping]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-2 border-amber-700/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="font-serif text-amber-200/40 italic animate-[hearthPulse_2s_ease-in-out_infinite]">
            The fire stirs... the story takes shape...
          </p>
        </div>
      </div>
    );
  }

  const lines = [
    'The embers dance...',
    'Flames whisper tales of ages past...',
    'The wood hisses and cracks...',
    'Somewhere, a log collapses into ash...',
    'Shadows stretch and retreat...',
    'The fire burns on, waiting...',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col cursor-default select-none" onClick={handleClick}>
      <Embers />
      <EmberSpark x={spark.x} y={spark.y} />

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at bottom, rgba(180,83,9,0.06) 0%, rgba(120,53,15,0.03) 35%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none z-10" />

      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 z-20">
        <p className="font-display text-[10px] tracking-[0.4em] text-amber-400/25 uppercase">Prologue</p>
        {!showBegin && (
          <button
            onClick={(e) => { e.stopPropagation(); skipAllTyping(); }}
            className="font-display text-[10px] tracking-wider text-amber-400/20 hover:text-amber-300/50 cursor-pointer transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-6 md:px-16 lg:px-32 z-10" style={{ scrollbarWidth: 'none' }}>
        <div className="w-full max-w-3xl mx-auto flex items-center min-h-full py-20">
          <div className="w-full space-y-10 md:space-y-14">
            {paragraphs.map((p, i) => {
              const isDone = doneIndices.includes(i);
              const isRevealing = revealIndex === i;
              const isHidden = !isDone && !isRevealing;
              const isLatest = isRevealing || (isDone && i === doneIndices[doneIndices.length - 1] && !allRevealed);

              if (isHidden) return <div key={i} className="min-h-[1em]" />;

              const words = paragraphWords[i] || [];

              return (
                <div key={i}>
                  <p
                    className={`font-serif leading-relaxed text-lg md:text-xl ${
                      isLatest ? 'text-amber-200/90' : 'text-amber-200/25'
                    }`}
                    style={
                      isLatest
                        ? {
                            textShadow: '0 0 12px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.08)',
                            animation: 'heatWaver 5s ease-in-out infinite',
                          }
                        : isDone
                          ? { textShadow: '0 0 4px rgba(245,158,11,0.08)' }
                          : undefined
                    }
                  >
                    {words.map((word, w) => (
                      <FadeWord
                        key={`${i}-${w}`}
                        word={word}
                        visible={isDone || (isRevealing && w < visibleWordCount)}
                      />
                    ))}
                  </p>
                  {p.subtitle && isDone && (
                    <p
                      className="font-display text-[10px] tracking-[0.25em] uppercase mt-4 animate-[fadeSlideUp_0.8s_ease-out] text-amber-400/45"
                      style={isLatest ? { animation: 'hearthPulse 3s ease-in-out infinite' } : undefined}
                    >
                      {p.subtitle}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {!allRevealed && (
        <div className="absolute bottom-10 left-0 right-0 text-center z-10 pointer-events-none">
          <p className="font-serif text-[11px] text-amber-400/12 italic animate-[hearthPulse_4s_ease-in-out_infinite]">
            {lines[atmosphericLine]}
          </p>
        </div>
      )}

      <div className="relative z-10 shrink-0">
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
        {showBegin && (
          <div className="relative flex flex-col items-center pb-14 z-20 animate-[fadeSlideUp_1s_ease-out]">
            <button
              onClick={(e) => { e.stopPropagation(); onBegin(); }}
              className="group flex items-center gap-3 bg-amber-900/20 border border-amber-800/50 hover:border-amber-400 text-amber-200 px-12 py-5 rounded-lg font-display text-xl tracking-wider hover:scale-105 cursor-pointer transition-all duration-500"
              style={{ boxShadow: '0 0 20px rgba(180,83,9,0.2), 0 0 60px rgba(245,158,11,0.1)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 0 30px rgba(245,158,11,0.4), 0 0 80px rgba(245,158,11,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '0 0 20px rgba(180,83,9,0.2), 0 0 60px rgba(245,158,11,0.1)';
              }}
            >
              <Sword size={24} className="text-amber-400 group-hover:rotate-12 transition-transform duration-500" />
              Begin Your Journey
              <ChevronRight size={20} className="text-amber-400/40 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
            <p className="font-serif text-[11px] text-amber-400/15 italic mt-5">Press Enter to begin</p>
          </div>
        )}
      </div>
    </div>
  );
}

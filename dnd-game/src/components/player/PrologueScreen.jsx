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

const REVEAL_DELAY = 800;
const PARAGRAPH_DELAY = 5000;

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
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y }}
    >
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

export default function PrologueScreen({ onBegin, onSkip }) {
  const [paragraphs, setParagraphs] = useState([]);
  const [visibleIndices, setVisibleIndices] = useState([]);
  const [allRevealed, setAllRevealed] = useState(false);
  const [showBegin, setShowBegin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [atmosphericLine, setAtmosphericLine] = useState(0);
  const [spark, setSpark] = useState({ x: null, y: null });
  const timerRef = useRef(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const result = await generateBackstory(initialCharacter);
        if (!cancelled && result?.narrative) {
          const parts = result.narrative
            .split(/\n\n+/)
            .filter(p => p.trim())
            .map(text => ({ text: text.trim(), subtitle: null }));

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
    if (loading) return;

    let current = 0;
    const revealed = [];

    function showNext() {
      if (current >= paragraphs.length) {
        setAllRevealed(true);
        timerRef.current = setTimeout(() => setShowBegin(true), 1500);
        return;
      }

      revealed.push(current);
      setVisibleIndices([...revealed]);
      current++;

      const isLast = current >= paragraphs.length;
      timerRef.current = setTimeout(showNext, isLast ? PARAGRAPH_DELAY + 1000 : PARAGRAPH_DELAY);
    }

    timerRef.current = setTimeout(showNext, REVEAL_DELAY);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [paragraphs, loading]);

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
      setAtmosphericLine(prev => (prev + 1) % lines.length);
    }, 7500);

    return () => clearInterval(interval);
  }, []);

  const handleClick = useCallback((e) => {
    setSpark({ x: e.clientX, y: e.clientY });
    setTimeout(() => setSpark({ x: null, y: null }), 1200);

    if (allRevealed) {
      setShowBegin(true);
    }
  }, [allRevealed]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onSkip();
    }
    if (e.key === 'Enter' && allRevealed) {
      onBegin();
    }
  }, [onSkip, onBegin, allRevealed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

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
    <div
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden cursor-default select-none"
      onClick={handleClick}
    >
      <Embers />
      <EmberSpark x={spark.x} y={spark.y} />

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at bottom, rgba(180,83,9,0.06) 0%, rgba(120,53,15,0.03) 35%, transparent 70%)',
        }}
      />

      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 100%, rgba(245,158,11,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-black to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black to-transparent pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6 z-10">
        <p className="font-display text-[10px] tracking-[0.4em] text-amber-400/25 uppercase">
          Prologue
        </p>
        {!showBegin && (
          <button
            onClick={(e) => { e.stopPropagation(); onSkip(); }}
            className="font-display text-[10px] tracking-wider text-amber-400/20 hover:text-amber-300/50 cursor-pointer transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-6 md:px-16 lg:px-32 z-10">
        <div className="w-full max-w-3xl space-y-10 md:space-y-14">
          {paragraphs.map((p, i) => {
            const isVisible = visibleIndices.includes(i);
            const isLatest = visibleIndices.length > 0 && i === visibleIndices[visibleIndices.length - 1];

            return (
              <div
                key={i}
                className={`transition-all duration-[1800ms] ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-6'
                }`}
              >
                <p
                  className={`font-serif leading-relaxed transition-all duration-[1200ms] ${
                    isLatest
                      ? 'text-amber-200/90 text-lg md:text-xl'
                      : isVisible
                        ? 'text-amber-200/25 text-lg md:text-xl'
                        : 'text-lg md:text-xl'
                  }`}
                  style={isLatest ? {
                    textShadow: '0 0 12px rgba(245,158,11,0.25), 0 0 40px rgba(245,158,11,0.08)',
                    animation: 'heatWaver 5s ease-in-out infinite',
                  } : isVisible ? {
                    textShadow: '0 0 4px rgba(245,158,11,0.08)',
                  } : undefined}
                >
                  {p.text}
                </p>
                {p.subtitle && (
                  <p
                    className={`font-display text-[10px] tracking-[0.25em] uppercase mt-4 transition-all duration-[1200ms] ${
                      isVisible ? 'text-amber-400/45' : 'text-transparent'
                    }`}
                    style={isVisible && isLatest ? {
                      animation: 'hearthPulse 3s ease-in-out infinite',
                    } : undefined}
                  >
                    {p.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!allRevealed && (
        <div className="absolute bottom-10 left-0 right-0 text-center z-10">
          <p className="font-serif text-[11px] text-amber-400/12 italic transition-opacity duration-[2500ms] animate-[hearthPulse_4s_ease-in-out_infinite]">
            {lines[atmosphericLine]}
          </p>
        </div>
      )}

      {showBegin && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-14 z-10 animate-[fadeSlideUp_1s_ease-out]">
          <button
            onClick={(e) => { e.stopPropagation(); onBegin(); }}
            className="group flex items-center gap-3 bg-amber-900/20 border border-amber-800/50 hover:border-amber-400 text-amber-200 px-12 py-5 rounded-lg font-display text-xl tracking-wider hover:scale-105 cursor-pointer transition-all duration-500"
            style={{
              boxShadow: '0 0 20px rgba(180,83,9,0.2), 0 0 60px rgba(245,158,11,0.1)',
            }}
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
          <p className="font-serif text-[11px] text-amber-400/15 italic mt-5">
            Press Enter to begin
          </p>
        </div>
      )}
    </div>
  );
}

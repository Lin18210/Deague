import { useState, useEffect, useRef, useCallback } from 'react';
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
const PARAGRAPH_DELAY = 4500;

export default function PrologueScreen({ onBegin, onSkip }) {
  const [paragraphs, setParagraphs] = useState([]);
  const [visibleIndices, setVisibleIndices] = useState([]);
  const [allRevealed, setAllRevealed] = useState(false);
  const [showBegin, setShowBegin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [atmosphericLine, setAtmosphericLine] = useState(0);
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
        timerRef.current = setTimeout(() => setShowBegin(true), 1200);
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
    const atmosphericLines = [
      'A cold wind blows from the eastern ridges...',
      'The old gods watch from their forgotten thrones...',
      'Somewhere, a raven takes flight into the dusk...',
      'The dice of fate are already rolling...',
    ];

    const interval = setInterval(() => {
      setAtmosphericLine(prev => (prev + 1) % atmosphericLines.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape' || e.key === 'Enter') {
      onSkip();
    }
  }, [onSkip]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 border-2 border-amber-700/30 border-t-amber-400 rounded-full animate-spin mx-auto" />
          <p className="font-serif text-amber-50/40 italic animate-pulse">
            The threads of fate are weaving...
          </p>
        </div>
      </div>
    );
  }

  const atmosphericLines = [
    'A cold wind blows from the eastern ridges...',
    'The old gods watch from their forgotten thrones...',
    'Somewhere, a raven takes flight into the dusk...',
    'The dice of fate are already rolling...',
  ];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col overflow-hidden"
      onClick={() => { if (allRevealed) setShowBegin(true); }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(120,53,15,0.08)_0%,_transparent_70%)]" />

      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent pointer-events-none" />

      <div className="absolute top-0 left-0 right-0 flex justify-between items-start p-6">
        <p className="font-display text-xs tracking-[0.3em] text-amber-50/20 uppercase select-none">
          Prologue
        </p>
        {!showBegin && (
          <button
            onClick={(e) => { e.stopPropagation(); onSkip(); }}
            className="font-display text-xs tracking-wider text-amber-50/20 hover:text-amber-50/60 cursor-pointer transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center px-6 md:px-16 lg:px-32">
        <div className="w-full max-w-3xl space-y-8 md:space-y-12">
          {paragraphs.map((p, i) => {
            const isVisible = visibleIndices.includes(i);
            const isLatest = visibleIndices.length > 0 && i === visibleIndices[visibleIndices.length - 1];

            return (
              <div
                key={i}
                className={`transition-all duration-[1500ms] ease-out ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
              >
                <p className={`font-serif leading-relaxed transition-all duration-1000 ${
                  isLatest
                    ? 'text-amber-50/90 text-lg md:text-xl'
                    : isVisible
                      ? 'text-amber-50/40 text-lg md:text-xl'
                      : 'text-lg md:text-xl'
                }`}>
                  {p.text}
                </p>
                {p.subtitle && (
                  <p className={`font-display text-xs tracking-[0.2em] uppercase mt-3 transition-all duration-1000 ${
                    isVisible ? 'text-amber-300/60' : 'text-transparent'
                  }`}>
                    {p.subtitle}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {!allRevealed && (
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="font-serif text-xs text-amber-50/15 italic transition-opacity duration-[2000ms] animate-pulse">
            {atmosphericLines[atmosphericLine]}
          </p>
        </div>
      )}

      {showBegin && (
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center pb-12 animate-[fadeSlideUp_0.8s_ease-out]">
          <button
            onClick={(e) => { e.stopPropagation(); onBegin(); }}
            className="group flex items-center gap-3 bg-amber-900/40 border-2 border-amber-700 hover:border-amber-300 text-amber-100 px-12 py-5 rounded-lg font-display text-xl tracking-wider hover:scale-105 hover:shadow-[0_0_30px_rgba(252,211,77,0.4)] cursor-pointer transition-all duration-300"
          >
            <Sword size={24} className="text-amber-300 group-hover:rotate-12 transition-transform" />
            Begin Your Journey
            <ChevronRight size={20} className="text-amber-300/60" />
          </button>
          <p className="font-serif text-xs text-amber-50/20 italic mt-4">
            Press Enter to begin
          </p>
        </div>
      )}
    </div>
  );
}

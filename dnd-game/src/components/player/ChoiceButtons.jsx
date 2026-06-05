export default function ChoiceButtons({ choices, onChoice, isLoading, onDiceCheck }) {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-stone-500 tracking-widest uppercase mb-1" style={{ fontFamily: 'system-ui, sans-serif' }}>Select your path:</p>
      {choices.map((choice, i) => {
        const checkMatch = typeof choice === 'string' ? choice.match(/\[CHECK\s*:\s*(\w+)\s*:\s*(\d+)/i) : null;
        const isCheck = !!checkMatch;

        return (
          <button
            key={i}
            onClick={() => onChoice(choice)}
            disabled={isLoading}
            className={`w-full text-left p-3.5 rounded border text-sm flex items-center justify-between transition-all group cursor-pointer disabled:opacity-50 ${
              isCheck
                ? 'bg-stone-900/80 border-purple-900/40 hover:border-purple-600 hover:bg-purple-950/20 text-purple-200'
                : 'bg-stone-900/80 border-stone-800 hover:border-amber-700/60 hover:bg-amber-950/10 text-stone-300'
            }`}
            style={{ fontFamily: 'system-ui, sans-serif' }}
          >
            <span className="flex items-center gap-3">
              {isCheck ? (
                <span className="bg-purple-900/60 text-purple-100 text-[9px] font-extrabold px-2 py-0.5 rounded tracking-widest uppercase border border-purple-500/30">
                  {checkMatch[1].substring(0, 3)} Check
                </span>
              ) : (
                <span className="w-1.5 h-1.5 bg-amber-600 rounded-full group-hover:scale-125 transition-transform shrink-0" />
              )}
              <span>{typeof choice === 'string' ? choice.replace(/\[CHECK\s*:.*?\]/i, '').trim() : choice}</span>
            </span>
            <svg className="w-4 h-4 text-stone-600 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        );
      })}
    </div>
  );
}

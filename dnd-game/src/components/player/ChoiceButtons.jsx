export default function ChoiceButtons({ choices, onChoice, isLoading }) {
  if (!choices || choices.length === 0) return null;

  return (
    <div className="space-y-3">
      {choices.map((choice, i) => (
        <button
          key={i}
          onClick={() => onChoice(choice)}
          disabled={isLoading}
          className="w-full text-left bg-slate-800 border border-amber-900/30 hover:border-amber-300 hover:bg-slate-800/80 text-amber-100 px-5 py-4 rounded-lg font-serif text-lg hover:translate-x-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0"
        >
          → {choice}
        </button>
      ))}
    </div>
  );
}

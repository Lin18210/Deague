export default function GameHeader({ title, subtitle, onReturn }) {
  return (
    <header className="border-b border-amber-900/30 bg-slate-900/80 px-6 py-4 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-2xl font-display text-amber-300">{title}</h2>
        {subtitle && <p className="text-xs text-amber-50/40 font-serif">{subtitle}</p>}
      </div>
      <button
        onClick={onReturn}
        className="text-amber-50/60 hover:text-amber-300 font-display text-sm tracking-wider cursor-pointer"
      >
        Return to Lobby
      </button>
    </header>
  );
}

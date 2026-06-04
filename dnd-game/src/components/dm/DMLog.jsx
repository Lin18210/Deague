export default function DMLog({ entries }) {
  return (
    <div>
      <h3 className="font-display text-lg text-amber-300 mb-3">Game Log</h3>
      <div className="bg-slate-800 border border-amber-900/20 rounded-lg p-4 max-h-64 overflow-y-auto space-y-2">
        {entries.map((entry) => (
          <p key={entry.id} className="text-xs text-amber-50/50 font-serif">
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
}

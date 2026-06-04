export default function EventLog({ entries }) {
  return (
    <div className="bg-slate-900 border border-amber-900/30 rounded-lg p-6">
      <h3 className="font-display text-lg text-amber-300 mb-4">Recent Events</h3>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {entries.map((entry) => (
          <p key={entry.id} className="text-amber-50/60 text-sm font-serif">
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
}

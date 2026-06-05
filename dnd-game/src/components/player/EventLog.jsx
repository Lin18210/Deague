export default function EventLog({ entries }) {
  if (!entries || entries.length === 0) return null;

  return (
    <div className="bg-stone-900/60 border border-stone-800 rounded-lg p-4">
      <h3 className="text-[10px] text-stone-500 tracking-widest uppercase font-bold mb-2" style={{ fontFamily: 'system-ui, sans-serif' }}>
        Chronicle
      </h3>
      <div className="max-h-32 overflow-y-auto scrollbar-parchment space-y-1.5">
        {entries.slice(0, 20).map((entry) => (
          <p key={entry.id} className="text-stone-400 text-[12px] font-serif leading-relaxed border-l-2 border-stone-800/60 pl-2">
            {entry.text}
          </p>
        ))}
      </div>
    </div>
  );
}

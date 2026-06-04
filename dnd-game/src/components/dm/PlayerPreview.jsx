export default function PlayerPreview({ scene }) {
  return (
    <div>
      <h3 className="font-display text-lg text-amber-300 mb-3">Player Preview</h3>
      <div className="bg-slate-800 border border-amber-900/20 rounded-lg p-4 space-y-3">
        <h4 className="font-display text-amber-200">{scene.title}</h4>
        <p className="text-sm font-serif text-amber-50/60 line-clamp-3">{scene.description}</p>
        {scene.ascii && (
          <div className="bg-slate-950 border border-amber-900/20 rounded p-3">
            <pre className="text-amber-300/40 text-xs font-mono whitespace-pre overflow-x-auto">
              {scene.ascii}
            </pre>
          </div>
        )}
        <p className="text-xs text-amber-50/40 font-serif">
          {scene.choices.length} choice{scene.choices.length !== 1 ? 's' : ''} available
        </p>
      </div>
    </div>
  );
}

export default function SceneDisplay({ scene, narrative }) {
  return (
    <>
      {scene.ascii && (
        <div className="bg-slate-900 border border-amber-900/30 rounded-lg p-6">
          <pre className="text-amber-300/60 text-xs leading-tight font-mono whitespace-pre overflow-x-auto">
            {scene.ascii}
          </pre>
        </div>
      )}

      <div className="bg-slate-900 border border-amber-900/30 rounded-lg p-6">
        <p className="font-serif text-lg italic leading-relaxed text-amber-50/90">
          {scene.description}
        </p>
      </div>

      {narrative && (
        <div className="bg-slate-900 border border-amber-500/20 rounded-lg p-6 animate-in">
          <p className="font-serif text-lg leading-relaxed text-amber-100">
            {narrative}
          </p>
        </div>
      )}
    </>
  );
}

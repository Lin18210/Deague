import { Volume2, VolumeX } from 'lucide-react';
import audio from '../../utils/audioEngine';

export default function GameHeader({ title, subtitle, onReturn }) {
  const handleMute = () => {
    const next = !audio.muted;
    audio.setMuted(next);
    if (!next) audio.play('click');
  };

  return (
    <header className="border-b border-amber-900/30 bg-slate-900/80 px-6 py-4 flex items-center justify-between shrink-0">
      <div>
        <h2 className="text-2xl font-display text-amber-300">{title}</h2>
        {subtitle && <p className="text-xs text-amber-50/40 font-serif">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleMute}
          className={`p-1.5 rounded border transition-all ${audio.muted ? 'border-slate-800 text-slate-600 hover:text-slate-400' : 'border-amber-900/50 text-amber-500 hover:text-amber-400'}`}
          title={audio.muted ? 'Enable sound' : 'Mute sound'}
        >
          {audio.muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button
          onClick={onReturn}
          className="text-amber-50/60 hover:text-amber-300 font-display text-sm tracking-wider cursor-pointer"
        >
          Return to Lobby
        </button>
      </div>
    </header>
  );
}

import { Sword, Shield } from 'lucide-react';

export default function LobbyScreen({ onSelectDM, onSelectPlayer }) {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-bold text-amber-300 mb-4 tracking-wider drop-shadow-[0_0_15px_rgba(252,211,77,0.5)]">
          ⚔️ QUEST MASTER ⚔️
        </h1>
        <p className="text-amber-50/70 text-lg md:text-xl font-serif italic mb-12">
          Forge your destiny in a world of magic and monsters
        </p>
        <div className="flex flex-col md:flex-row gap-6 justify-center">
          <button
            onClick={onSelectDM}
            className="group bg-amber-900/40 border-2 border-amber-700 hover:border-amber-300 text-amber-100 px-10 py-6 rounded-lg font-display text-xl tracking-wider hover:scale-105 hover:shadow-[0_0_30px_rgba(252,211,77,0.3)] cursor-pointer"
          >
            <Shield className="inline-block mr-3 mb-1" size={24} />
            DUNGEON MASTER
          </button>
          <button
            onClick={onSelectPlayer}
            className="group bg-slate-800/60 border-2 border-slate-800 hover:border-amber-300 text-amber-100 px-10 py-6 rounded-lg font-display text-xl tracking-wider hover:scale-105 hover:shadow-[0_0_30px_rgba(252,211,77,0.3)] cursor-pointer"
          >
            <Sword className="inline-block mr-3 mb-1" size={24} />
            BRAVE ADVENTURER
          </button>
        </div>
      </div>
    </div>
  );
}

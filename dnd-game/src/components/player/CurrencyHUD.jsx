import React from 'react';
import { Coins, Sparkles, Gem } from 'lucide-react';
import { getWallet } from '../../services/currencyService';

export default function CurrencyHUD() {
  const wallet = getWallet();

  return (
    <div className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-stone-950/80 border border-amber-900/40 text-xs shadow-inner">
      <div className="flex items-center gap-1 text-amber-300 font-mono font-bold" title="Gold Sovereigns">
        <Coins size={14} className="text-amber-400" />
        <span>{wallet.gold}</span>
      </div>

      <div className="w-[1px] h-3.5 bg-stone-800" />

      <div className="flex items-center gap-1 text-purple-300 font-mono font-bold" title="Soul Shards for Eldritch Crafting">
        <Sparkles size={14} className="text-purple-400" />
        <span>{wallet.soulShards}</span>
      </div>

      <div className="w-[1px] h-3.5 bg-stone-800" />

      <div className="flex items-center gap-1 text-blue-300 font-mono font-bold" title="Ancient Runed Coins">
        <Gem size={14} className="text-blue-400" />
        <span>{wallet.ancientCoins}</span>
      </div>
    </div>
  );
}

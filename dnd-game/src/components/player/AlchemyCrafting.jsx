import React, { useState } from 'react';
import { FlaskConical, Sparkles, Flame, Plus, Check, X, ShieldAlert } from 'lucide-react';

export const RECIPES = [
  {
    id: 'greater_healing_potion',
    name: 'Greater Potion of Healing',
    outputItem: { id: 'potion_greater_heal', name: 'Greater Healing Potion', type: 'potion', heal: 35 },
    icon: '🧪',
    description: 'A glowing crimson elixir distilled from bloodcap mushrooms and purified spring water. Restores 35 HP.',
    ingredients: [
      { name: 'Bloodcap Mushroom', qty: 2 },
      { name: 'Moonlit Herb', qty: 1 }
    ]
  },
  {
    id: 'arcane_power_elixir',
    name: 'Elixir of Arcane Surge',
    outputItem: { id: 'elixir_mana', name: 'Elixir of Arcane Surge', type: 'potion', manaRestore: 30 },
    icon: '💙',
    description: 'Concentrated star-dust and mana crystals that instantly recharge 30 Spell Mana.',
    ingredients: [
      { name: 'Void Essence', qty: 1 },
      { name: 'Star-Dust Powder', qty: 2 }
    ]
  },
  {
    id: 'shadow_draught',
    name: 'Draught of Shadow Cloak',
    outputItem: { id: 'potion_shadow', name: 'Draught of Shadow Cloak', type: 'potion', stealthBuff: 5 },
    icon: '🌫️',
    description: 'Swirling dark vapor that renders the user practically invisible to enemy sentries for 3 turns.',
    ingredients: [
      { name: 'Void Essence', qty: 2 },
      { name: 'Bloodcap Mushroom', qty: 1 }
    ]
  },
  {
    id: 'dragons_breath_flask',
    name: "Dragon's Fire Flask",
    outputItem: { id: 'flask_fire', name: "Dragon's Fire Flask", type: 'combat_consumable', damage: 25 },
    icon: '💥',
    description: 'Volatile explosive liquid harvested from dragon scale dust. Deals 25 Fire damage in an area.',
    ingredients: [
      { name: 'Dragon Scale Shard', qty: 1 },
      { name: 'Star-Dust Powder', qty: 1 }
    ]
  }
];

export default function AlchemyCrafting({ isOpen, onClose, character, onBrewPotion }) {
  const [selectedRecipe, setSelectedRecipe] = useState(RECIPES[0]);
  const [craftStatus, setCraftStatus] = useState(null);

  // Simulated player inventory reagents for alchemy crafting demo
  const [playerReagents, setPlayerReagents] = useState({
    'Bloodcap Mushroom': 5,
    'Moonlit Herb': 3,
    'Void Essence': 4,
    'Star-Dust Powder': 6,
    'Dragon Scale Shard': 2
  });

  if (!isOpen) return null;

  const canCraft = (recipe) => {
    return recipe.ingredients.every(
      ing => (playerReagents[ing.name] || 0) >= ing.qty
    );
  };

  const handleBrew = (recipe) => {
    if (!canCraft(recipe)) {
      setCraftStatus({ type: 'error', text: 'Missing required alchemy reagents!' });
      return;
    }

    // Deduct ingredients
    const nextReagents = { ...playerReagents };
    recipe.ingredients.forEach(ing => {
      nextReagents[ing.name] -= ing.qty;
    });
    setPlayerReagents(nextReagents);

    if (onBrewPotion) {
      onBrewPotion(recipe.outputItem);
    }

    setCraftStatus({ type: 'success', text: `Successfully brewed [${recipe.name}]!` });
    setTimeout(() => setCraftStatus(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-emerald-500/40 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-amber-50">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-emerald-400/60 hover:text-emerald-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-6 border-b border-emerald-900/40 pb-4">
          <FlaskConical className="text-emerald-400" size={28} />
          <div>
            <h2 className="font-display text-2xl text-emerald-300">Alchemy Lab & Workshop</h2>
            <p className="text-xs text-amber-50/60 font-serif">Transmute rare ingredients into magical elixirs</p>
          </div>
        </div>

        {craftStatus && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-medium border ${
            craftStatus.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-300'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300'
          }`}>
            {craftStatus.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipe list */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
            <h4 className="text-xs font-display text-emerald-400/70 uppercase tracking-wider mb-2">Available Recipes</h4>
            {RECIPES.map((recipe) => {
              const isSelected = selectedRecipe.id === recipe.id;
              const craftable = canCraft(recipe);

              return (
                <button
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-950/60 border-emerald-400/80 shadow-lg'
                      : 'bg-slate-950/50 border-slate-800 hover:border-emerald-900/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{recipe.icon}</span>
                    <div>
                      <h4 className="font-display text-emerald-200 text-sm">{recipe.name}</h4>
                      <p className="text-xs text-amber-50/50">Output: {recipe.outputItem.name}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-mono ${craftable ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50' : 'bg-red-950 text-red-400 border border-red-900/40'}`}>
                    {craftable ? 'Ready' : 'Missing Reagents'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Recipe Details & Alchemical Furnace */}
          {selectedRecipe && (
            <div className="bg-slate-950/80 border border-emerald-900/30 rounded-lg p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">{selectedRecipe.icon}</span>
                  <div>
                    <h3 className="font-display text-xl text-emerald-300">{selectedRecipe.name}</h3>
                    <p className="text-xs text-emerald-400/70 font-mono">Formula Tier I</p>
                  </div>
                </div>

                <p className="text-sm text-amber-100/80 font-serif leading-relaxed mb-4">
                  {selectedRecipe.description}
                </p>

                <div className="space-y-2 border-t border-slate-800 pt-3 mb-4">
                  <h5 className="text-xs font-display text-amber-50/60 uppercase">Required Reagents:</h5>
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    const playerHas = playerReagents[ing.name] || 0;
                    const hasEnough = playerHas >= ing.qty;

                    return (
                      <div key={idx} className="flex justify-between items-center text-xs font-mono bg-slate-900/60 px-3 py-1.5 rounded">
                        <span className="text-amber-100/90">{ing.name}</span>
                        <span className={hasEnough ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                          {playerHas} / {ing.qty}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => handleBrew(selectedRecipe)}
                disabled={!canCraft(selectedRecipe)}
                className={`w-full py-2.5 font-display font-bold rounded-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                  canCraft(selectedRecipe)
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-emerald-950 cursor-pointer'
                    : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                }`}
              >
                <Flame size={16} /> Brew {selectedRecipe.name}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

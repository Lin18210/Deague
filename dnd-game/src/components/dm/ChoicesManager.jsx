import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export default function ChoicesManager({ choices, onAdd, onDelete }) {
  const [value, setValue] = useState('');

  const handleAdd = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <div className="bg-slate-900 border border-amber-900/30 rounded-lg p-6">
      <h3 className="font-display text-lg text-amber-300 mb-4">Choices</h3>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new choice..."
          className="flex-1 bg-slate-800 border border-amber-900/30 rounded-lg px-4 py-2 text-amber-50 font-serif placeholder:text-amber-50/30 focus:outline-none focus:border-amber-300"
        />
        <button
          onClick={handleAdd}
          className="bg-amber-900/40 border border-amber-700 hover:border-amber-300 text-amber-100 px-4 py-2 rounded-lg hover:scale-105 cursor-pointer"
        >
          <Plus size={18} />
        </button>
      </div>

      <ul className="space-y-2">
        {choices.map((choice, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-slate-800 border border-amber-900/20 rounded-lg px-4 py-3"
          >
            <span className="font-serif text-amber-50/80">{choice}</span>
            <button
              onClick={() => onDelete(i)}
              className="text-red-400 hover:text-red-300 hover:scale-110 cursor-pointer"
            >
              <Trash2 size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
